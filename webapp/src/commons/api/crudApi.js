import {HOST} from '../hosts';
import {debug} from '../defs'
import axios from 'axios'

class CrudApi{
    constructor(resourceUri) {
        this.jwtToken = window.localStorage.getItem("jwtToken")
        if (!(this.jwtToken === undefined) && !(this.jwtToken === null)) {
            this.jwtToken = JSON.parse(this.jwtToken)
        }

        this.baseApiUrl = HOST.backend_api + '/' + resourceUri
        this.client = axios.create({
            baseURL: this.baseApiUrl,
            //timeout: 1000,
            headers: {
                'accept': 'application/hal+json',
                'authorization': this.jwtToken
            }
        })
        this.specialClient = axios.create({
            baseURL: HOST.backend_api,
            //timeout: 1000,
            headers: {
                'accept': 'application/hal+json',
                'authorization': this.jwtToken
            }
        })
    }     

    async checkLogin(username, password) {
        return await this.specialClient({method: 'post', url:'/login', 
            data: {
                username: username,
                password: password
            }
        })
        .then(
            res => {
                if (debug) console.log('Checked login username, password, res: ', username, password, res)
                return res
            },
            err => {
                if (debug) console.log('Error checking login username, password, error:', username, password, err)
                return err
            }
        )
    }

    async getUserInfo(token) {
        return await this.specialClient({method: 'get', url:'/userInfo', headers: {authorization: token}})
        .then(
            res => {
                if (debug) console.log('Got user info user,res: ', res)
                return res
            },
            err => {
                if (debug) console.log('Error getting user info user, error:', err)
                return err
            }
        )
    }

    async readAll(pageSize) {
        return await this.client({params: {size: pageSize}})
        .then(
            res => {
                if (debug) {
                    console.log("Response for reading all objects res, pageSize: ", res, pageSize)
                }
                return res
            },
            err => {
                if (debug) {
                    console.log("Error reading all objects res, pageSize: ", err, pageSize)
                }
                return err
            }
        )
    }

    async read(object) {
        return await this.client({method: 'get', url: object._links.self.href})
        .then(
            res => {
                if (debug) {
                    console.log("Response for reading object: ", object , res)
                }
                return res
            },
            err => {
                if (debug) {
                    console.log("Error reading object: ", object , err)
                }
                return err
            }
        )
    }

    async readSubresources(object, subresourceName) {
        return await this.client({method: 'get', url: object._links[subresourceName].href})
        .then(
            res => {
                if (debug) {
                    console.log("Response for getting object subresources: ", object, subresourceName, res)
                }
                return res
            },
            err => {
                if (debug) {
                    console.log("Error getting object subresources: ", object, subresourceName, err)
                }
                return err
            }    
        )
    }

    async readUserSubresources(user, subresourceName) {
        return await this.client({method: 'get', url: '/' + user.id + '/' + subresourceName})
        .then(
            res => {
                if (debug) {
                    console.log("Response for getting object subresources: ", user, subresourceName, res)
                }
                return res
            },
            err => {
                if (debug) {
                    console.log("Error getting object subresources: ", user, subresourceName, err)
                }
                return err
            }    
        )
    }

    async addSubresource(object, subresource) { 
        let srLink = subresource._links.self.href.split('/')
        let srName = srLink[srLink.length - 2]
        return await this.client({method: 'post', 
            url: object._links[srName].href,
            data: {
                _links: {
                    self: {
                        href: subresource._links.self.href
                    }
                }
            }
          })
        .then(
            res => {
                if (debug) {
                    console.log("Response for adding subresource to object: ", subresource, object, res)
                }
                return res
            },
            err => {
                if (debug) {
                    console.log("Error adding subresource to object: ", subresource, object, err)
                }
                return err
            }
        )
    }

    async deleteSubresource(object, subresource) {
        let srLink = subresource._links.self.href.split('/')
        let srId = srLink[srLink.length - 1]
        let srName = srLink[srLink.length - 2]
        return await this.client({
            method: 'delete', 
            url: object._links.self.href + '/' + srName + '/' + srId
        })
        .then(
            res => {
                if (debug) {
                    console.log("Response for deleting subresource to object: ", subresource, object, res)
                }
                return res
            },
            err => {
                if (debug) {
                    console.log("Error deleting subresource to object: ", subresource, object, err)
                }
                return err
            }
        )
    }

    async delete(object) {
        return await this.client({method: 'delete', url: object._links.self.href})
        .then(
            res => {
                if (debug) {
                    console.log("Response for deleting object: ", object, res)
                }
                return res
            },
            err => {
                if (debug) {
                    console.log("Error deleting object: ", object, err)
                }
                return err
            }
        )
    }

    async create(object) {
        return await this.client({
            method: 'post', 
            data: object
          })
        .then(
            res => {
                if (debug) {
                    console.log("Response for creating object: ", object, res)
                }
                return res
            },
            err => {
                if (debug) {
                    console.log("Error creating object: ", object, err)
                }
                return err
            }
        )
    }

    async update(object) { 
        return await this.client({method: 'put', 
            url: object._links.self.href,
            data: object
          })
        .then(
            res => {
                if (debug) {
                    console.log("Response for updating object: ", object, res)
                }
                return res
            },
            err => {
                if (debug) {
                    console.log("Error updating object: ", object, err)
                }
                return err
            }
        )
    }
}

export default CrudApi