import React from "react";
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import CrudSearchField from "./CrudSearchField";
import {Col, Row} from "react-bootstrap";
import {debug} from '../../commons/defs'

class CrudTable extends React.Component {
    constructor(props) {
        super(props);

        this.filterOne = this.filterOne.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.getTRPropsType = this.getTRPropsType.bind(this)
        this.selectedHandler = props.selectedHandler

        this.state = {
            data: props.data,
            columns: props.columns,
            search: props.search,
            filters: [],
            getTrPropsFunction: props.getTrProps,
            pageSize: props.pageSize || 10,
        };
        this.isSr = props.isSr
        if (debug) console.log('table data', this.state.data)
    }
    
    componentWillReceiveProps(nextProps) {
        this.setState({ data: nextProps.data });  
      }

    filterOne(object) {
        let accepted = true

        this.state.filters.forEach(singleFilter => {
            if (!(String(singleFilter.value) === "") &&
                            !String(object[singleFilter.accessor]).includes(String(singleFilter.value)) && 
                            !String(singleFilter.value).includes(String(object[singleFilter.accessor]))) {
                accepted = false
            }
        });

        return accepted;
    }

    handleChange(value, index, header) {
        if (this.state.filters === undefined)
            this.setState({filters: []});

        this.state.filters[index] = {
            value: value.target.value,
            accessor: header
        };

        this.forceUpdate();
    }


    getTRPropsType(state, rowInfo) {
        if (rowInfo && rowInfo.row) {
            return {
                style: {
                    textAlign: "center",
                    background: rowInfo.index === this.state.selected ? '#00afec' : 'white',
                    color: rowInfo.index === this.state.selected ? 'white' : 'black'
                },
                onClick: (e) => {
                    this.setState({
                        selected: rowInfo.index
                    }, this.selectedHandler(rowInfo.index))
                },
            };
        }
        else
            return {}
    }



    render() {
        let data = this.state.data ? this.state.data.filter(item => this.filterOne(item)) : [];

        return (
            <div>
                <Row>
                    {
                        this.state.search.map((header, index) => {
                            return (
                                <Col key={index}>
                                    <div >
                                        <CrudSearchField id={header.accessor} label={header.accessor}
                                               onChange={(e) => this.handleChange(e, index, header.accessor)}/>
                                    </div>
                                </Col>
                            )
                        })
                    }
                </Row>
                <Row>
                    <Col>
                        <ReactTable
                            data={data}
                            resolveData={data => data.map(row => row)}
                            columns={this.state.columns}
                            defaultPageSize={this.state.pageSize}
                            getTrProps={this.getTRPropsType}
                            showPagination={true}
                        />
                    </Col>
                </Row>
            </div>
        )
    }
}

export default CrudTable;
