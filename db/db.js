require('dotenv').config()
const sql = require('mssql')

const { USER, PASSWORD, SERVER, DATABASE, PORT } = process.env

const dbConfig = {
    user: USER,
    password: PASSWORD,
    server: SERVER,
    database: DATABASE,
    port: parseInt(PORT),
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
        return pool
    })
    .catch((error) => {
        console.error("DATABASE CONNECTION FAILED!",error)
    })


module.exports = { poolPromise, sql }