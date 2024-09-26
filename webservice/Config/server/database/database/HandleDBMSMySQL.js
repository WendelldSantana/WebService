 const { query } = require('express')
const fs = require('fs')
const { connect } = require('http2')
 const mysql = require('mysql')

 class HandleDBMSMySQL{
    constructor(host=null, database=null, user=null, password=null){
        let envfile = JSON.parse(fs.readFileSync('./Config/server/env.json', 'utf-8', 'r'))

        if(envfile){
            this._host = (typeof host  !=='string' || host === null) ? envfile.host : host
            this._database = (typeof database  !=='string' || database === null) ? envfile.database : database
            this._user = (typeof user  !=='string' || user === null) ? envfile.user : user
            this._password = (typeof password  !=='string' || password === null) ? envfile.password : password

            this.connect()
        }

        function connect(){
            this.connection = mysql.createConnection({
                host: this._host,
                database: this._database,
                user: this._user,
                password: this._password
            });
        }
        
        function query(sql, args){
            return new Promise((resolve, reject) => {
                this.connection.query(sql, args, (err, results, fields)=>{
                    if(err){
                        reject(err)
                    } else{
                         resultsJSON = {'metadata':{}, 'data': {}},
                         resultsJSON.metadata = fields.map((r) => Object.assign({}, r)),
                         resultsJSON.data = results.map((r) => Object.assign({}, r)),
                         resolve(resultsJSON)
                    }
                })
            })
        }
    }
 }

 function close(){
    return new Promise((resolve, reject) => {
        this.connection.end(err =>{
            if(err){
                reject(err)
            } else {
                resolve()
            }
        })
    })
 }

 module.exports = HandleDBMSMySQL