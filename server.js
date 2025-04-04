// Module Imports
require('dotenv').config()
const express = require('express')
const cors = require('cors')

// Custom Imports (Useful)
const { getTables, getDataInAndSaveTable } = require('./db/db-functions.js')

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
        const csvFilePath = await getDataInAndSaveTable(tableName, attributesString)
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
        const tableData = await getTables()
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

// SERVER
const port = process.env.SERVER_PORT || 5000
app.listen(port, () => {
    console.log(`Server listening on port ${port}...`)
})
