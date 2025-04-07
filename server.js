// Module Imports
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')

// Custom Imports (Useful)
const { getTables, getDataInAndSaveTable, connectToDB } = require('./db/db-functions.js')
const { createNewUser, signInUser } = require('./db/auth-functions.js')
const { dbConfig } = require('./db/temp.js')


// INITIALIZATION
const app = express()

// MIDDLEWARE
app.use((req, res, next) => {
    console.log(req.method, req.url)
    next()
})
app.use(cors())
app.use(express.static('./public-static'))
app.use(express.json())


// METHODS
app.get("/tables/:name/attributes", async (req, res) => {
    const tableName = req.params.name
    const attributesString = req.query.attributes

    if(!attributesString) {
        res.status(400).json({
            success: false,
            data: {
                error: "Bad Request",
                message: "No attributes selected"
            }
        })
    }

    try {
        const csvFilePath = await getDataInAndSaveTable(dbConfig, tableName, attributesString)
        res.status(200).json({ csvFilePath: csvFilePath })

    } catch (error) {
        res.status(404).json({
            success: false,
            data: {
                error: error.name,
                message: error.message
            }
        })

    }
})

app.get("/tables", async (req, res) => {
    try {
        const tableData = await getTables(dbConfig)
        res.status(200).json(tableData)
    } catch (error) {
        res.status(404).json({
            success: false,
            data: {
                error: error.name,
                message: error.message
            }
        })
    }
})

app.get("/csv/:location", async (req, res) => {
    const csvFilePath = decodeURIComponent(req.params.location)
    console.log(csvFilePath)
    res.download(csvFilePath)
})

app.post("/sign-up", async (req, res) => {
    const userDetails = req.body
    //console.log(userDetails)
    try {
        const success = await createNewUser(userDetails)
        const status = success ? 200 : 409
        res.status(status).json({
                success: true,
                data: success
        })
        
    } catch (error) {
        res.status(500).json({
            success: false,
            data: {
                error: error.name,
                message: error.message
            }
        })
    }
})

app.post("/sign-in", async (req, res) => {
    const loginDetails = req.body
    try {
        result = await signInUser(loginDetails)
        res.status(200).json({
            success: true,
            data: result
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            data: {
                error: error.name,
                message: error.message
            }
        })
    }
})

app.get('/server-page', async (req, res) => {
    res.status(200).sendFile(path.join(__dirname, 'public-static', 'server.html'));
})
// SERVER
const port = process.env.SERVER_PORT || 5000
app.listen(port, async () => {
    console.log(`Server listening on port ${port}...`)
    await connectToDB(dbConfig)
})
