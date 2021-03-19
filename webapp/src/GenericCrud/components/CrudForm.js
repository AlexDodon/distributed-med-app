import React from 'react';
import validate from "./genericValidators";
import Button from "react-bootstrap/Button";
import CrudApi from "../../commons/api/crudApi";
import APIResponseErrorMessage from "../../commons/errorhandling/api-response-error-message";
import {Col, Row} from "reactstrap";
import { FormGroup, Input, Label} from 'reactstrap';
import {debug} from '../../commons/defs'


class CrudForm extends React.Component {

    constructor(props) {
        super(props);
        this.toggleForm = this.toggleForm.bind(this);
        this.reloadHandler = this.props.reloadHandler;

        let fc = props.formControls

        Object.keys(fc).forEach(key => { 
            if (props.isUpdate) {
                fc[key].value = props.object[key]
                fc[key].valid = true
                fc[key].touched = true
            } else {
                fc[key].valid = false
                fc[key].touched = false
            }
        })

        if (debug) {
            console.log('form control', fc)
        }

        this.state = {

            errorStatus: 0,
            error: null,

            formIsValid: false,

            formControls: fc
        };

        this.fcTemplate = fc
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.api = new CrudApi(props.apiResource)
        this.isUpdate = props.isUpdate
        this.object = props.object
    }

    toggleForm() {
        this.setState({collapseForm: !this.state.collapseForm});
    }


    handleChange = event => {

        const name = event.target.name;
        const value = event.target.value;

        const updatedControls = this.state.formControls;

        const updatedFormElement = updatedControls[name];

        updatedFormElement.value = value;
        updatedFormElement.touched = true;
        updatedFormElement.valid = validate(value, updatedFormElement.validationRules);
        updatedControls[name] = updatedFormElement;

        let formIsValid = true;
        for (let updatedFormElementName in updatedControls) {
            formIsValid = updatedControls[updatedFormElementName].valid && formIsValid;
        }

        this.setState({
            formControls: updatedControls,
            formIsValid: formIsValid
        });

    };

    registerObject(object) {
        if (this.isUpdate) {
            let obj = this.object
            Object.keys(object).forEach(key => {
                obj[key] = object[key]
            })
            this.api.update(obj)
            .then(
                res => {
                    if (debug) {
                        console.log("Successfully updated object: ", obj, res)
                    }
    
                    this.setState({formControls: this.fcTemplate},
                        this.reloadHandler
                    )
    
                },
                err => {
                    this.setState(({
                        errorStatus: err,
                        error: err
                    }))
                }
            )
        } else {
            this.api.create(object)
            .then(
                res => {
                    if (debug) {
                        console.log("Successfully created object: ", res)
                    }
    
                    this.setState({formControls: this.fcTemplate},
                        this.reloadHandler
                    )
    
                },
                err => {
                    this.setState(({
                        errorStatus: err,
                        error: err
                    }))
                }
            )
        }
    }

    handleSubmit() {
        let object = {}
        let fc = this.state.formControls

        Object.keys(fc).forEach(key => {
            object[key] = fc[key].value
        })

        if (debug) {
            console.log('The object that wants to be submitted from the crud form: ', object)
        }

        this.registerObject(object);
    }

    render() {
        let fc = this.state.formControls
        let formGroups = Object.keys(fc).map(key =>
            <FormGroup id={key} key={key}>
                <Label for={key + 'Field'}> {fc[key].label} </Label>
                <Input
                    name            ={key}
                    id              ={key + 'Field'}
                    placeholder     ={fc[key].placeholder}
                    onChange        ={this.handleChange}
                    defaultValue    ={fc[key].value}
                    touched         ={fc[key].touched ? 1 : 0}
                    valid           ={fc[key].valid}
                    required
                />
                {
                    fc[key].touched &&
                    !fc[key].valid &&
                    <div className={'error-message row'}> The input is not valid</div>
                }
            </FormGroup>
        )

        return (
            <div>

                {formGroups}

                <Row>
                    <Col sm={{size: '4', offset: 8}}>
                        <Button type={"submit"} disabled={!this.state.formIsValid} onClick={this.handleSubmit}>  Submit </Button>
                    </Col>
                </Row>

                {
                    this.state.errorStatus > 0 &&
                    <APIResponseErrorMessage errorStatus={this.state.errorStatus} error={this.state.error}/>
                }
            </div>
        ) ;
    }
}

export default CrudForm;
