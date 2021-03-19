import React from "react";
import {
    Button,
    CardHeader
} from 'reactstrap';
import { JSONRPCClient } from "json-rpc-2.0";

import { HOST } from '../commons/hosts'
import { Card } from "@material-ui/core";

class PillDispenser extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            medicationPlans: [],
            currentTime: new Date(),
            downloadTime: new Date((Math.floor(Math.floor(new Date().getTime() / 1000) / (24 * 60 * 60)) * 24 * 60 * 60 - 2 * 60 * 60) * 1000),
            debug: true,
            debugCheckbox: true,
            patient: {},
            medList: []
        }
        setInterval(() => {
            this.setState({
                currentTime: new Date(this.state.currentTime.getTime() + 1000)
            })


        }, 1000)

        //not taken
        setInterval(() => {
            let md = this.state.medList
            if (!(md === undefined) && !(md[0] === undefined) && md[0].takeTime + md[0].takeOffset < this.state.currentTime.getTime()) {
                while (!(md[0] === undefined) && md[0].takeTime + md[0].takeOffset < this.state.currentTime.getTime()) {
                    let mpi = md[0]
                    mpi.meds.forEach((med, index) => {
                        this.medicationNotTaken(med.id)
                    })
                    md.shift()
                }
                console.log(md)
                this.setState({ medList: md })
            }
        }, 1000)

        this.onChange = this.onChange.bind(this)
        this.incrementTimer = this.incrementTimer.bind(this)
        this.getMedicationPlans = this.getMedicationPlans.bind(this)
        this.medicationNotTaken = this.medicationNotTaken.bind(this)
        this.medicationTaken = this.medicationTaken.bind(this)
        this.onTake = this.onTake.bind(this)

        let user = JSON.parse(window.localStorage.getItem("loggedInUser"))

        if (!(user === null)) {
            this.state.patient = user
        }
    }

    componentDidUpdate() {
        if (this.state.currentTime >= this.state.downloadTime) {
            console.log("GOT PLANS")
            this.getMedicationPlans()
            this.setState({ downloadTime: new Date(this.state.downloadTime.getTime() + 24 * 60 * 60 * 1000) })
        }
    }

    onChange = (e) => {
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({ [name]: value });
    }

    incrementTimer(millis) {
        this.setState({
            currentTime: new Date(this.state.currentTime.getTime() + millis)
        })
    }

    getMedicationPlans() {
        const client = new JSONRPCClient((jsonRPCRequest) =>
            fetch(HOST.backend_api + "/rpc", {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify(jsonRPCRequest),
            }).then((response) => {
                if (response.status === 200) {
                    return response
                        .json()
                        .then((jsonRPCResponse) => client.receive(jsonRPCResponse));
                } else if (jsonRPCRequest.id !== undefined) {
                    return Promise.reject(new Error(response.statusText));
                }
            })
        );

        client
            .request("getMedicationPlans", [this.state.patient.id])
            .then((result) => {
                let medList = []
                result.forEach((medPlan, index) => {
                    if (!(medPlan.medicationPlanItems === undefined)) {
                        medPlan.medicationPlanItems.forEach((medPlanItem, index) => {
                            let meds = medPlanItem.medications
                            var takeTime = medPlan.treatmentStart
                            while (takeTime <= medPlan.treatmentEnd) {
                                medList.push({
                                    meds: meds,
                                    takeTime: takeTime * 1000,
                                    takeOffset: medPlanItem.ingestOffset * 1000
                                })
                                takeTime = takeTime + medPlanItem.ingestInterval
                            }
                        })
                    }
                })

                medList.sort((a, b) => a.takeTime - b.takeTime)


                let md = medList
                if (!(md === undefined) && !(md[0] === undefined) && md[0].takeTime < this.state.currentTime.getTime()) {
                    while (!(md[0] === undefined) && md[0].takeTime < this.state.currentTime.getTime()) {
                        md.shift()
                    }
                }

                this.setState({ medicationPlans: result, medList: md })
            });
    }

    medicationTaken(medId) {
        const client = new JSONRPCClient((jsonRPCRequest) =>
            fetch(HOST.backend_api + "/rpc", {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify(jsonRPCRequest),
            }).then((response) => {
                if (response.status === 200) {
                    return response
                        .json()
                        .then((jsonRPCResponse) => client.receive(jsonRPCResponse));
                } else if (jsonRPCRequest.id !== undefined) {
                    return Promise.reject(new Error(response.statusText));
                }
            })
        );

        client
            .request("medicationTaken", [this.state.patient.id, medId])
            .then((result) => this.setState({ medicationPlans: result }));
    }

    medicationNotTaken(medId) {
        const client = new JSONRPCClient((jsonRPCRequest) =>
            fetch(HOST.backend_api + "/rpc", {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify(jsonRPCRequest),
            }).then((response) => {
                if (response.status === 200) {
                    return response
                        .json()
                        .then((jsonRPCResponse) => client.receive(jsonRPCResponse));
                } else if (jsonRPCRequest.id !== undefined) {
                    return Promise.reject(new Error(response.statusText));
                }
            })
        );

        client
            .request("medicationNotTaken", [this.state.patient.id, medId])
            .then((result) => this.setState({ medicationPlans: result }));
    }

    onTake(mpi) {
        let md = this.state.medList

        const index = md.indexOf(mpi);
        if (index > -1) {
            md.splice(index, 1);
        }

        mpi.meds.forEach((med, index) => {
            this.medicationTaken(med.id)
        })

        this.setState({medList: md})
    }

    ShouldRenderButton(mpi) {
        if (this.state.currentTime >= mpi.takeTime - mpi.takeOffset && this.state.currentTime <= mpi.takeTime + mpi.takeOffset) {
            return <Button color="primary" onClick={() => this.onTake(mpi)}>Taken</Button>
        }
        return <div></div>
    }

    render() {
        return (
            <div style={{
                justifyContent: "center",
                alignItems: "center"
            }}>
                <CardHeader>
                    CurrentTime: {this.state.currentTime.toLocaleString('en-GB')}
                </CardHeader>

                {
                    this.state.debug ?
                        <div>
                            <CardHeader>
                                Debug
                                <input type="checkbox" name='debugCheckbox' checked={this.state.debugCheckbox} onChange={this.onChange} />
                            </CardHeader>
                            {
                                this.state.debugCheckbox ?
                                    <div>
                                        <CardHeader>
                                            <Button color="primary" onClick={() => this.incrementTimer(60 * 1000)}>Increment Current Time by 1 minute </Button>
                                        </CardHeader>
                                        <CardHeader>
                                            <Button color="primary" onClick={() => this.incrementTimer(60 * 60 * 1000)}>Increment Current Time by 1 hour </Button>
                                        </CardHeader>
                                        <CardHeader>
                                            <Button color="primary" onClick={this.getMedicationPlans}>Download now </Button>
                                        </CardHeader>
                                    </div>
                                    : <div />
                            }
                        </div>
                        : <div />
                }

                <CardHeader>
                    {
                        this.state.medList.map((mpi, index) => {
                            if (mpi.takeTime === this.state.medList[0].takeTime || this.state.currentTime >= mpi.takeTime - mpi.takeOffset && this.state.currentTime <= mpi.takeTime + mpi.takeOffset) {
                                return (<div>
                                    <Card key={index}>
                                        Take in the interval {new Date(mpi.takeTime - mpi.takeOffset).toLocaleString('en-GB')} - {new Date(mpi.takeTime + mpi.takeOffset).toLocaleString('en-GB')}
                                        <br />
                                        The following medicine:
                                        <br />
                                        {
                                            mpi.meds.map((med, index) => <div key={index}>
                                                Medicine name: {med.name}
                                                <br />
                                                Dosage: {med.dosage}
                                            </div>)
                                        }
                                        {this.ShouldRenderButton(mpi)}
                                    </Card>
                                    <br />
                                </div>)
                            } else {
                                return <div />
                            }
                        })
                    }
                </CardHeader>
            </div>
        )
    }
}

export default PillDispenser;
