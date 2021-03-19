import React from 'react';
import APIResponseErrorMessage from "../commons/errorhandling/api-response-error-message";
import {
    Button,
    Card,
    CardHeader,
    Col,
    Modal,
    ModalBody,
    ModalHeader,
    Row
} from 'reactstrap';
import CrudForm from "./components/CrudForm";

import CrudApi from "../commons/api/crudApi"
import CrudTable from './components/CrudTable'
import {debug} from '../commons/defs'

class CrudContainer extends React.Component {

    constructor(props) {
        super(props)
        this.toggleForm = this.toggleForm.bind(this)
        this.closeForm = this.closeForm.bind(this)
        this.toggleUpdateForm = this.toggleUpdateForm.bind(this)
        this.closeUpdateForm = this.closeUpdateForm.bind(this)
        this.reload = this.reload.bind(this)
        this.fetchObjects = this.fetchObjects.bind(this)
        this.deleteSelected = this.deleteSelected.bind(this)
        this.updateSelectedRow = this.updateSelectedRow.bind(this)
        this.updateSelectedRowSR = this.updateSelectedRowSR.bind(this)
        this.updateSelectedRowSRAll = this.updateSelectedRowSRAll.bind(this)
        this.onSelectedRowUpdate = this.onSelectedRowUpdate.bind(this)
        this.deleteSelectedSR = this.deleteSelectedSR.bind(this)
        this.addSelectedSR = this.addSelectedSR.bind(this)
        this.api = new CrudApi(props.apiResource)
        this.apiResource = props.apiResource
        this.title = props.title
        this.singleName = props.singleName
        this.columns = props.columns
        this.filters = props.searchableFields.map(field => {return {accessor: field}})
        this.pageSize = props.pageSize
        this.formControls = props.formControls
        
        if (!(props.subresources === undefined)) {
            this.subresources = props.subresources.map(sr => {
                let nsr = sr
                nsr.filters = sr.searchableFields.map(field => {return {accessor: field}})
                nsr.api = new CrudApi(sr.name)
                return nsr
            })
        } else {
            this.subresources = []
        }

        this.state = {
            selected: false,
            collapseForm: false,
            tableData: [],
            subresourceData: [],
            subresourceDataAll: [],
            isLoaded: false,
            errorStatus: 0,
            error: null,
            selectedRow: null,
            selectedRowSR: null,
            selectedRowSRAll: null,
            selectedUpdate: false,
        };

        if (debug) console.log('subresources info', this.subresources)

        if (debug) console.log('subresources data info', this.state.subresourceData)
    }

    componentDidMount() {
        this.fetchObjects()
    }

    fetchObjects() {
        this.api.readAll()
        .then(
            res => {
                this.setState({tableData: res.data._embedded[Object.keys(res.data._embedded)[0]], isLoaded: true})
            },
            err => {
                this.setState({errorStatus: err, error: err})
            }
        )
        this.subresources.forEach((sr, index) => {
            sr.api.readAll()
            .then(
                res => {
                    let srd = this.state.subresourceDataAll
                    console.log(res, sr.name)
                    srd[index] = res.data._embedded[Object.keys(res.data._embedded)[0]]
                    this.setState({subresourceDataAll: srd}, () => {
                        if (debug) console.log('read all subresources', sr, this.state.subresourceDataAll)
                    })
                }
            )
        })
    }

    toggleForm() {
        this.setState({selected: !this.state.selected})
    }

    closeForm() {
        this.setState({selected: false})
    }

    toggleUpdateForm() {
        if (!(this.state.selectedRow === null))
            this.setState({selectedUpdate: !this.state.selectedUpdate})
    }

    closeUpdateForm() {
        this.setState({selectedUpdate: false})
    }

    deleteSelected() {
        if (!(this.state.selectedRow === null)) {
            this.api.delete(this.state.tableData[this.state.selectedRow])
            .then(
                res => {
                    this.reload()
                },
                err => {
                    this.setState({errorStatus: err, error: err})
                }
            )
        }
    }

    onSelectedRowUpdate() {
        this.subresources.forEach((sr, index) => {
            this.api.readSubresources(this.state.tableData[this.state.selectedRow], sr.name)
            .then(
                res => {
                    let srd = this.state.subresourceData
                    srd[index] = sr.name === 'patients' ? 
                        [res.data]
                        : res.data._embedded[Object.keys(res.data._embedded)[0]];
                    this.setState({subresourceData: srd}, () => {
                        if (debug) console.log('read object subresources', sr, this.state.subresourceData)
                    })
                },
                err => {console.log("I dont know, problems with subresources", err)}
            )
        })
    }

    updateSelectedRow(index) {
        if (debug) console.log('received selected row index: ', index)

        this.setState({
            selectedRow: index
        }, this.onSelectedRowUpdate)
    }

    updateSelectedRowSR(index) {
        if (debug) console.log('received SR selected row index: ', index)

        this.setState({
            selectedRowSR: index
        })
    }

    updateSelectedRowSRAll(index) {
        if (debug) console.log('received SR All selected row index: ', index)

        this.setState({
            selectedRowSRAll: index
        })
    }

    addSelectedSR(sri) {
        if (!(this.state.selectedRowSRAll === null) && !(this.state.selectedRow === null)) {
            this.api.addSubresource(this.state.tableData[this.state.selectedRow], this.state.subresourceDataAll[sri][this.state.selectedRowSRAll])
            .then(
                res => {
                    if (debug) console.log('added resource with response', res)
                    this.onSelectedRowUpdate()
                }
            )
        }
    }

    deleteSelectedSR(sri) {
        if (!(this.state.selectedRowSR === null) && !(this.state.selectedRow === null)) {
            this.api.deleteSubresource(this.state.tableData[this.state.selectedRow], this.state.subresourceData[sri][this.state.selectedRowSR])
            .then(
                res => {
                    if (debug) console.log('added resource with response', res)
                    this.onSelectedRowUpdate()
                }
            )
        }
    }

    reload() {
        this.setState({
            isLoaded: false,
            selectedRow: null
        });
        this.closeForm()
        this.closeUpdateForm()
        this.fetchObjects()
    }

    render() {
        return (
            <div>
                <CardHeader>
                    <strong> {this.title} </strong>
                </CardHeader>
                <Card style={{height:"100%"}}>
                    <br/>
                    {!(this.apiResource === 'patientActivities') ?
                    <Row>
                        <Col sm={{size: '2', offset: 2}}>
                            <Button color="primary" onClick={this.toggleForm}>Add {this.singleName} </Button>
                        </Col>
                        <Col sm={{size: '2', offset: 1}}>
                            <Button color="primary" onClick={this.toggleUpdateForm}>Update selected {this.singleName} </Button>
                        </Col>
                        <Col sm={{size: '2', offset: 1}}>
                            <Button color="primary" onClick={this.deleteSelected}>Delete selected {this.singleName} </Button>
                        </Col>
                    </Row>
                    : <div></div>}
                    <Row>
                        <Col sm={{size: '10', offset: 1}}>
                            {
                                this.state.isLoaded && 
                                <div>
                                    <CardHeader>
                                        <strong> {this.singleName + ' Table'} </strong>
                                    </CardHeader>
                                    <CrudTable 
                                        data = {this.state.tableData}
                                        columns = {this.columns}
                                        search = {this.filters}
                                        pageSize = {this.pageSize}
                                        selectedHandler ={this.updateSelectedRow}
                                        isSr = {false}
                                    />
                                </div>
                            }

                            {
                                this.state.subresourceData.map((sr, index) => 
                                    this.state.isLoaded && 
                                    <div key={index}>
                                        <CardHeader>
                                            <strong> {this.subresources[index].title} </strong>
                                            <Button color="primary" onClick={() => {this.deleteSelectedSR(index)}}>Remove selected {this.subresources[index].singleName}</Button>
                                        </CardHeader>
                                        <CrudTable 
                                            data = {sr}
                                            columns = {this.subresources[index].columns}
                                            search = {this.subresources[index].filters}
                                            pageSize = {this.pageSize}
                                            isSr = {true}
                                            selectedHandler={this.updateSelectedRowSR}
                                        />
                                        <CardHeader>
                                            <strong> {this.subresources[index].allTitle} </strong>
                                            <Button color="primary" onClick={() => {this.addSelectedSR(index)}}>Add selected {this.subresources[index].singleName}</Button>
                                        </CardHeader>
                                        <CrudTable 
                                            data = {this.state.subresourceDataAll[index]}
                                            columns = {this.subresources[index].columns}
                                            search = {this.subresources[index].filters}
                                            pageSize = {this.pageSize}
                                            isSr = {true}
                                            selectedHandler={this.updateSelectedRowSRAll}
                                        />
                                    </div>
                                )
                            }

                            {
                                this.state.errorStatus > 0 && 
                                <APIResponseErrorMessage
                                    errorStatus={this.state.errorStatus}
                                    error={this.state.error}
                                />  
                            }
                        </Col>
                    </Row>
                </Card>

                <Modal isOpen={this.state.selected} toggle={this.toggleForm}
                       className={this.props.className} size="lg">
                    <ModalHeader toggle={this.toggleForm}> Add {this.singleName}: </ModalHeader>
                    <ModalBody>
                        <CrudForm 
                            reloadHandler={this.reload}
                            formControls={this.formControls}
                            apiResource={this.apiResource}
                            isUpdate={false}
                        />
                    </ModalBody>
                </Modal>

                <Modal isOpen={this.state.selectedUpdate} toggle={this.toggleUpdateForm}
                    className={this.props.className} size="lg">
                    <ModalHeader toggle={this.toggleUpdateForm}> Update {this.singleName}: </ModalHeader>
                    <ModalBody>
                        <CrudForm 
                            reloadHandler={this.reload}
                            formControls={this.formControls}
                            apiResource={this.apiResource}
                            isUpdate={true}
                            object={this.state.tableData[this.state.selectedRow]}
                        />
                    </ModalBody>
                </Modal>

            </div>
        )

    }
}


export default CrudContainer;
