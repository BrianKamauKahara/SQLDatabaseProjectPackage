require('dotenv').config()
const sql = require('mssql')

const { user, password, server, database, port } = process.env

const dbConfig = {
    user: user,
    password: password,
    server: server,
    database: database,
    port: parseInt(port),
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
}

// CONNECTION POOL
const poolPromise = new sql.ConnectionPool(dbConfig)
    .connect()
    .then((pool) => {
        console.log("Connected to Pool")
    })
    .catch((error) => {
        console.error("DATABASE CONNECTION FAILED!",error)
    })


module.exports = { poolPromise, sql }