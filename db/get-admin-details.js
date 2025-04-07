require('dotenv').config()
const { USER, PASSWORD, SERVER, DATABASE, PORT } = process.env

const adminDetails = {
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

module.exports = adminDetails