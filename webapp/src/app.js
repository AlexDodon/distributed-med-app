import React from 'react'
import {Route, Switch, withRouter} from 'react-router-dom'

import {
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Nav,
    Navbar,
    NavLink,
    UncontrolledDropdown,
    Button
} from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Home from './home/home';

import ErrorPage from './commons/errorhandling/error-page';
import styles from './commons/styles/project-style.css';
import CrudContainer from './GenericCrud/CrudContainer'
import LandingPage from './Login/LandingPage';
import Dashboard from './Dashboard/Dashboard'
import {debug} from './commons/defs'
import {HOST} from './commons/hosts'
import PillDispenser from './PillDispenser/PillDispenser';

const textStyle = {
    color: 'white',
    textDecoration: 'none'
}

const mpColumns = [
    {
        Header: 'Name',
        accessor: 'name',
    },
    {
        Header: 'Start of Treatment',
        accessor: 'treatmentStart',
    },
    {
        Header: 'End of Treatment',
        accessor: 'treatmentEnd',
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

const mColumns = [
    {
        Header: 'Name',
        accessor: 'name',
    },
    {
        Header: 'Dosage',
        accessor: 'dosage',
    },
    {
        Header: 'Side Effects',
        accessor: 'sideEffects',
    }]

const paColumns = [
    {
        Header: 'Activity',
        accessor: 'activity',
    },
    {
        Header: 'Start Time',
        accessor: 'start',
    },
    {
        Header: 'Ending Time',
        accessor: 'ending',
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

const cColumns = [
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
    }]

const dColumns = cColumns

class App extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            loginInfo: null,
            loginType: ''
        }
        this.onSuccesfulLogin = this.onSuccesfulLogin.bind(this)
        this.wrongLogin = this.wrongLogin.bind(this)
        this.logout = this.logout.bind(this)
        let user = JSON.parse(window.localStorage.getItem("loggedInUser"))
        
        if (debug) console.log("setting user type for user", user)

        if (!(user === null)) {
            if (user.medicationPlans === 'this' | user.careGivers === 'this') {
                this.state.loginInfo = user
                this.state.loginType = 'patient'
            } else 
            if (user.patients === 'this') {
                this.state.loginInfo = user
                this.state.loginType = 'careGiver'
            }
        }
        else {
            this.state.loginInfo = null
            this.state.loginType = 'doctor'
        }

        if (this.state.loginType === 'careGiver') {
            console.log(HOST.backend_api + "/socket/test")
            this.ws = new WebSocket("ws" + HOST.backend_api.replace("https","").replace("http","") + "/socket/test");

            this.ws.onmessage = e => {
                if (debug) console.log("got message: ", e)
                toast.info(e.data,{
                    position: "bottom-right",
                    autoClose: false,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                })
            }
            this.ws.onopen = e => {
                if (debug) console.log("opened: ", e)
                this.ws.send("careGiver " + this.state.loginInfo.id)
            }
            this.ws.onclose = e => {if (debug) console.log("closed: ", e)}
            this.ws.onerror = e => {if (debug) console.log("error: ", e)}
        }
    }

    logout() {
        window.localStorage.removeItem('jwtToken')
        window.localStorage.removeItem('loggedInUser')
        this.setState({loginInfo: null, loginType: ''})
        this.props.history.push('/')
    }

    onSuccesfulLogin() {
        console.log(window.localStorage.getItem("loggedInUser"))
        let user = JSON.parse(window.localStorage.getItem("loggedInUser"))
        
        if (debug) console.log("setting user type for user", user)

        if (!(user === null)) {
            if (user.medicationPlans === 'this' | user.careGivers === 'this') {
                this.setState({loginInfo: user, loginType: 'patient'})
            } else 
            if (user.patients === 'this') {
                this.setState({loginInfo: user, loginType: 'careGiver'})
            }
        }
        else {
            this.setState({loginInfo: null, loginType: 'doctor'})
        }
    }

    wrongLogin() {return (<div>You do not have the correct login for this page</div>)}

    render() {
        return (
            <div className={styles.back}>
                <ToastContainer/>
                <div>        
                    <Navbar color="dark" light expand="md">
                        <Nav className="mr-auto" navbar>

                            <UncontrolledDropdown nav inNavbar >
                                <DropdownToggle style={textStyle} nav caret>
                                    Navigation Menu
                                </DropdownToggle>
                                <DropdownMenu right >
                                        {
                                            this.state.loginType === 'doctor' ? 
                                                <DropdownItem>
                                                    <NavLink href="/home">Home</NavLink>
                                                    <NavLink href="/medications">Medications</NavLink>
                                                    <NavLink href="/medicationPlans">Medication Plans</NavLink>
                                                    <NavLink href="/careGivers">Caregivers</NavLink>
                                                    <NavLink href="/patients">Patients</NavLink>
                                                    <NavLink href="/patientActivities">Patient Activities</NavLink>
                                                    <NavLink href="/medicationPlanItems">Medication Plan Items</NavLink>
                                                </DropdownItem>
                                            : this.state.loginType === 'patient' ?
                                                <DropdownItem>
                                                    <NavLink href="/home">Home</NavLink>
                                                    <NavLink href="/dashboard">Dashboard</NavLink>
                                                    <NavLink href="/pillDispenser">Pill Dispenser</NavLink>
                                                </DropdownItem> 
                                            : this.state.loginType === 'careGiver' ?
                                                <DropdownItem>
                                                    <NavLink href="/home">Home</NavLink>
                                                    <NavLink href="/dashboard">Dashboard</NavLink>
                                                </DropdownItem>    
                                            : 
                                                <DropdownItem>
                                                    <NavLink href="/home">Home</NavLink>
                                                    <NavLink href="/">Login</NavLink>
                                                </DropdownItem> 
                                        }
                                </DropdownMenu>
                            </UncontrolledDropdown>

                        </Nav>
                        <Button className="btn" onClick={this.logout}>Log Out</Button>
                    </Navbar>
                    <Switch>

                        <Route exact path='/'
                            render={() => <LandingPage onSuccesfulLogin={this.onSuccesfulLogin}/>}
                        />

                        <Route exact path='/home'
                            render={() => <Home/>}
                        />

                        <Route exact path='/dashboard'
                            render={() => this.state.loginType === 'patient' || this.state.loginType === 'careGiver' ?
                                    <Dashboard type={this.state.loginType} object={this.state.loginInfo}/>
                                : this.wrongLogin()
                            }
                        />                       

                        <Route exact path='/pillDispenser'
                            render={() => this.state.loginType === 'patient' ?
                                    <PillDispenser/>
                                : this.wrongLogin()
                            }
                        />                       
                        
                        <Route exact path='/medicationPlanItems'
                            render={() => this.state.loginType === 'doctor' ? <CrudContainer
                            apiResource     = 'medicationPlanItems'
                            title           = 'Medication Plan Items management'
                            singleName      = 'Medication Plan Item'
                            columns         = {mpiColumns}
                            searchableFields= {[]}
                            pageSize        = {5}
                            formControls    = {{
                                name: {
                                    value: '',
                                    label: 'Interval of ingestion',
                                    placeholder: 'What is the interval?...',
                                    validationRules: {
                                        isRequired: true
                                    }
                                },
                                birthDate: {
                                    value: '',
                                    label: 'Ingestion offset',
                                    placeholder: 'What is the offset?...',
                                    validationRules: {
                                        isRequired: true
                                    }
                                },
                            }}
                            subresources    = {[
                                {
                                    name: 'medications',
                                    singleName: 'Medication',
                                    title: 'Medications  of selected Item',
                                    allTitle: 'All Medications',
                                    columns: mColumns,
                                    searchableFields: []
                                }
                            ]}
                        />
                        : this.wrongLogin()
                    }
                    />

                        <Route exact path='/medications'
                            render={() => this.state.loginType === 'doctor' ? 
                                <CrudContainer
                                    apiResource     = 'medications'
                                    title           = 'Medications management'
                                    singleName      = 'Medication'
                                    columns         = {mColumns}
                                    searchableFields= {[]}
                                    pageSize        = {5}
                                    formControls    = {{
                                        name: {
                                            value: '',
                                            label: 'Name',
                                            placeholder: 'What is the name of the medication?...',
                                            validationRules: {
                                                isRequired: true
                                            }
                                        },
                                        dosage: {
                                            value: '',
                                            label: 'Dosage',
                                            placeholder: 'Dosage...',
                                        },
                                        sideEffects: {
                                            value: '',
                                            label: 'Side Effects',
                                            placeholder: 'Side Effects...',
                                        },
                                    }}
                                />
                                : this.wrongLogin()
                            }
                        />

                        <Route exact path='/patientActivities'
                            render={() => this.state.loginType === 'doctor' ? 
                                <CrudContainer
                                    apiResource     = 'patientActivities'
                                    title           = 'Patient Activity Display'
                                    singleName      = 'Patient Activity'
                                    columns         = {paColumns}
                                    searchableFields= {[]}
                                    pageSize        = {5}
                                    formControls    = {{
                                        activity: {
                                            value: '',
                                            label: 'Activity',
                                            placeholder: 'What is the name of the activity?...',
                                            validationRules: {
                                                isRequired: true
                                            }
                                        },
                                        start: {
                                            value: '',
                                            label: 'Start',
                                            placeholder: 'Start time...',
                                        },
                                        ending: {
                                            value: '',
                                            label: 'Ending',
                                            placeholder: 'Ending time...',
                                        },
                                    }}
                                />
                                : this.wrongLogin()
                            }
                        />

                        <Route exact path='/medicationPlans'
                            render={() => this.state.loginType === 'doctor' ? <CrudContainer
                                apiResource     = 'medicationPlans'
                                title           = 'Medication Plans management'
                                singleName      = 'Medication Plan'
                                columns         = {mpColumns}
                                searchableFields= {[]}
                                pageSize        = {5}
                                formControls    = {{
                                    name: {
                                        value: '',
                                        label: 'Name',
                                        placeholder: 'What is the name of the medication plan?...',
                                        validationRules: {
                                            isRequired: true
                                        }
                                    },
                                    ingestIntervals: {
                                        value: '',
                                        label: 'Interval of ingestion',
                                        placeholder: 'Interval of ingestion...',
                                    },
                                    treatmentPeriod: {
                                        value: '',
                                        label: 'Treatment Period',
                                        placeholder: 'Treatment Period...',
                                    },
                                }}
                                subresources    = {[
                                    {
                                        name: 'medicationPlanItems',
                                        singleName: 'Medication Plan Item',
                                        title: 'Item of selected Plan',
                                        allTitle: 'All Items',
                                        columns: mpiColumns,
                                        searchableFields: []
                                    }
                                ]}
                            />
                            : this.wrongLogin()
                        }
                        />

                        <Route exact path='/patients'
                            render={() => this.state.loginType === 'doctor' ? <CrudContainer
                                apiResource     = 'patients'
                                title           = 'Patient management'
                                singleName      = 'Patient'
                                columns         = {pColumns}
                                searchableFields= {[]}
                                pageSize        = {5}
                                formControls    = {{
                                    name: {
                                        value: '',
                                        label: 'Name',
                                        placeholder: 'What is the name of the patient?...',
                                        validationRules: {
                                            isRequired: true
                                        }
                                    },
                                    birthDate: {
                                        value: '',
                                        label: 'Birth Date',
                                        placeholder: 'What is the birth date of the patient?...',
                                    },
                                    gender: {
                                        value: '',
                                        label: 'Gender',
                                        placeholder: 'What is the gender of the patient?...',
                                    },
                                    address: {
                                        value: '',
                                        label: 'Address',
                                        placeholder: 'What is the address of the patient?...',
                                    },
                                    medicalRecord: {
                                        value: '',
                                        label: 'Medical Record',
                                        placeholder: 'What is the medical record of the patient?...',
                                    },
                                }}
                                subresources    = {[
                                    {
                                        name: 'medicationPlans',
                                        singleName: 'Medication Plan',
                                        title: 'Medication Plan of selected Patient',
                                        allTitle: 'All Medication Plans',
                                        columns: mpColumns,
                                        searchableFields: []
                                    }
                                ]}
                            />
                            : this.wrongLogin()
                        }
                        />

                        <Route exact path='/careGivers'
                            render={() => this.state.loginType === 'doctor' ? <CrudContainer
                                apiResource     = 'careGivers'
                                title           = 'Caregiver management'
                                singleName      = 'Caregiver'
                                columns         = {cColumns}
                                searchableFields= {[]}
                                pageSize        = {5}
                                formControls    = {{
                                    name: {
                                        value: '',
                                        label: 'Name',
                                        placeholder: 'What is the name of the caregiver?...',
                                        validationRules: {
                                            isRequired: true
                                        }
                                    },
                                    birthDate: {
                                        value: '',
                                        label: 'Birth Date',
                                        placeholder: 'What is the birth date of the caregiver?...',
                                    },
                                    gender: {
                                        value: '',
                                        label: 'Gender',
                                        placeholder: 'What is the gender of the caregiver?...',
                                    },
                                    address: {
                                        value: '',
                                        label: 'Address',
                                        placeholder: 'What is the address of the caregiver?...',
                                    },
                                }}
                                subresources    = {[
                                    {
                                        name: 'patients',
                                        singleName: 'Patient',
                                        title: 'Patients of selected caregiver',
                                        allTitle: 'All Patients',
                                        columns: pColumns,
                                        searchableFields: []
                                    }
                                ]}
                            />
                            : this.wrongLogin()
                        }
                        />

                        {/*Error*/}
                        <Route
                            exact
                            path='/error'
                            render={() => <ErrorPage/>}
                        />

                        <Route render={() =><ErrorPage/>} />
                    </Switch>
                </div>
            </div>
        )
    };
}

export default withRouter(App)
