import CrudApi from '../commons/api/crudApi';
import React from "react";
import {debug} from '../commons/defs'
import {
    CardHeader
} from 'reactstrap';
import CrudTable from '../GenericCrud/components/CrudTable'

const mpColumns = [
    {
        Header: 'Name',
        accessor: 'name',
    },
    {
        Header: 'Interval of ingestion',
        accessor: 'ingestIntervals',
    },
    {
        Header: 'Treatment Period',
        accessor: 'treatmentPeriod',
    }]

    const mpiColumns = [
        {
            Header: 'Interval for ingestion',
            accessor: 'ingestInterval',
        },
        {
            Header: 'Acceptable ingestion offset',
            accessor: 'ingestOffset',
        }]

const pColumns = [
    {
        Header: 'Name',
        accessor: 'name',
    },
    {
        Header: 'Birth Date',
        accessor: 'birthDate',
    },
    {
        Header: 'Gender',
        accessor: 'gender',
    },
    {
        Header: 'Address',
        accessor: 'address',
    },
    {
        Header: 'Medical Record',
        accessor: 'medicalRecord',
    }]

class Dashboard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            object: props.object,
            type: props.type,
            srData: [],
            sr2Data: [],
            selectedRowSR: null,
            selectedRowSR2: null,
            selectedRowSR3: null,
        }
        this.updateSelectedRowSR = this.updateSelectedRowSR.bind(this)
        this.updateSelectedRowSR2 = this.updateSelectedRowSR2.bind(this)
        this.updateSelectedRowSR3 = this.updateSelectedRowSR3.bind(this)
        this.onSelectedRowUpdate = this.onSelectedRowUpdate.bind(this)

        if (this.state.type === 'patient') {
            this.api = new CrudApi('patients')
            this.srapi = new CrudApi('medicationPlans')
            this.sr2api = null
        }
        else {
            this.api = new CrudApi('careGivers')
            this.srapi = new CrudApi('patients')
            this.sr2api = new CrudApi('medicationPlans')
        }
    }

    componentDidMount() {
        this.fetchObjects()
    }

    updateSelectedRowSR(index) {
        if (debug) console.log('received SR selected row index: ', index)

        this.setState({
            selectedRowSR: index
        }, () => {
                this.onSelectedRowUpdate()
        })
    }

    updateSelectedRowSR2(index) {
        if (debug) console.log('received SR2 selected row index: ', index)

        this.setState({
            selectedRowSR2: index
        }, () => {
                this.onSelectedRowUpdate2()
        })
    }

    updateSelectedRowSR3(index) {
        if (debug) console.log('received SR3 selected row index: ', index)

        this.setState({
            selectedRowSR3: index
        })
    }

    onChange = (e) =>
        this.setState({ [e.target.name]: e.target.value });


    fetchObjects() {
        this.api.readUserSubresources(this.state.object, this.state.type === 'patient' ? 'medicationPlans' : 'patients')
        .then(
            res => {
                this.setState({srData: res.data._embedded[Object.keys(res.data._embedded)[0]]})
            },
            err => {
                this.setState({errorStatus: err, error: err})
            }
        )
    }

    onSelectedRowUpdate() {
        if (this.state.type === 'patient') {
            this.srapi.readSubresources(this.state.srData[this.state.selectedRowSR], 'medicationPlanItems')
            .then(
                res => {
                    this.setState({sr2Data: res.data._embedded[Object.keys(res.data._embedded)[0]]}, () => {
                        if (debug) console.log('read object subresources', this.state.srData[this.state.selectedRowSR], this.state.sr2Data)
                    })
                }
            )
        }
        else {
            this.srapi.readSubresources(this.state.srData[this.state.selectedRowSR], 'medicationPlans')
            .then(
                res => {
                    this.setState({sr2Data: res.data._embedded[Object.keys(res.data._embedded)[0]]}, () => {
                        if (debug) console.log('read object subresources', this.state.srData[this.state.selectedRowSR], this.state.sr2Data)
                    })
                }
            )
        }
    }

    onSelectedRowUpdate2() {
        if (!(this.state.type === 'patient')){
            this.srapi.readSubresources(this.state.sr2Data[this.state.selectedRowSR2], 'medications')
            .then(
                res => {
                    this.setState({sr3Data: res.data._embedded[Object.keys(res.data._embedded)[0]]}, () => {
                        if (debug) console.log('read medications', this.state.srData[this.state.selectedRowSR2], this.state.sr3Data)
                    })
                }
            )
        }
    }

    render(){
        return (
            <div>
                <ul>
                    {
                        Object.keys(this.state.object).map((key, index) => {
                            if (!(key === "_links") && !(key === "medicationsPlan")) {
                                if(!(key === 'patients') && !(key === 'medicationPlans')&& !(key === 'id') && !(key === 'careGivers'))
                                return (
                                    <li key={index}><strong>{key}:</strong> {this.state.object[key]}</li>
                                )
                            }
                        })
                    }                    
                </ul>
                {
                    this.state.type === 'patient' ?
                        <div>
                            <CardHeader>
                                <strong> Medication Plans </strong>
                            </CardHeader>
                            <CrudTable 
                                data = {this.state.srData}
                                columns = {mpColumns}
                                search = {[]}
                                pageSize = {5}
                                isSr = {true}
                                selectedHandler={this.updateSelectedRowSR}
                            />
                            <CardHeader>
                                <strong> Medication Plan Items </strong>
                            </CardHeader>
                            <CrudTable 
                                data = {this.state.sr2Data}
                                columns = {mpiColumns}
                                search = {[]}
                                pageSize = {5}
                                isSr = {true}
                                selectedHandler={this.updateSelectedRowSR2}
                            />
                        </div>
                    : <div>
                        <CardHeader>
                            <strong> Patients </strong>
                        </CardHeader>
                        <CrudTable 
                            data = {this.state.srData}
                            columns = {pColumns}
                            search = {[]}
                            pageSize = {5}
                            isSr = {true}
                            selectedHandler={this.updateSelectedRowSR}
                        />
                        <CardHeader>
                            <strong> Medication Plans </strong>
                        </CardHeader>
                        <CrudTable 
                            data = {this.state.sr2Data}
                            columns = {mpColumns}
                            search = {[]}
                            pageSize = {5}
                            isSr = {true}
                            selectedHandler={this.updateSelectedRowSR2}
                        />
                        <CardHeader>
                            <strong> MedicationPlanItems </strong>
                        </CardHeader>
                        <CrudTable 
                            data = {this.state.sr3Data}
                            columns = {mpiColumns}
                            search = {[]}
                            pageSize = {5}
                            isSr = {true}
                            selectedHandler={this.updateSelectedRowSR3}
                        />
                    </div>
                }
            </div>
        )
    }
}

export default Dashboard
