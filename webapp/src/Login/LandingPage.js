import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import CrudApi from '../commons/api/crudApi';
import React from "react";
import {debug} from '../commons/defs'
import { withRouter } from 'react-router'

class LandingPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            username: "",
            password: "",
            message: ""
        }
        this.api = new CrudApi("")
        this.login = this.login.bind(this)
        this.onSuccesfulLogin = props.onSuccesfulLogin
    }

    onChange = (e) =>
        this.setState({ [e.target.name]: e.target.value });

    login() {
        this.api.checkLogin(this.state.username, this.state.password)
        .then(res => {
                this.setState({message: "Succesful login"})
                if (debug) console.log("Logged in", res)
                window.localStorage.setItem("jwtToken", JSON.stringify(res.headers.authorization))
                this.api.getUserInfo(res.headers.authorization)
                .then(
                    res => {
                        if (!(res.data === undefined)) {
                            res.data = res.data.replace('\"medicationPlans\"', '\"medicationPlans\" : \"this\"')
                            res.data = res.data.replace('\"patients\"', '\"patients\" : \"this\"')
                            res.data = res.data.replace('\"careGivers\"', '\"careGivers\" : \"this\"')

                            window.localStorage.setItem("loggedInUser", res.data)
                        }
                        this.onSuccesfulLogin()
                        this.props.history.push('/home')
                    },
                    err => this.setState({message: "Error"})
                )
        },
            err => this.setState({message: "Invalid login"})
        )
    }

    render(){
        return (
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}>
                <div>
                    <h1>Log in</h1>
                    <form>
                        <div className="form-group">
                            <label>Username:</label>
                            <input placeholder="Username" name="username" className="form-control" value={this.state.username} onChange={this.onChange}/>
                        </div>

                        <div className="form-group">
                            <label>Password:</label>
                            <input type="password" placeholder="Password" name="password" className="form-control" value={this.state.password} onChange={this.onChange}/>
                        </div>
                    </form>  

                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}>
                        <button className="btn btn-success" onClick={this.login}>Log in</button>
                    </div>

                    <Box mt={5}>
                    <Typography variant="body2" align="center">
                        {this.state.message}
                    </Typography>
                    </Box>
                    <Box mt={5}>
                    <Typography variant="body2" color="textSecondary" align="center">
                        {'Medical'}
                    </Typography>
                    </Box>
                </div>
            </div>
        )
    }
}

export default withRouter(LandingPage);
