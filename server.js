require('dotenv').config()

const express = require('express')
const cors = require('cors')
const tables = require('./db/tables.json')
const app = express()
const { getTables } = require('./utils.js')
app.use((req, res, next) => {
    console.log(req.method, req.url)
    next()
})
app.use(cors())
app.use(express.static('./public-static'))
app.use(express.json())
// METHODS
app.get("/", (req, res) => {
    res.status(200).json({
        "message": "sent"
    })
})

app.get("/tables/:name", (req, res) => {

    res.status(200).json(tables)
})

app.get("/tables", async (req, res) => {
    try {
        const tableData = await getTables()
        res.status(200).json(tableData)
    } catch (error) {
        console.log(error)
        res.status(404).send("No")
    }
})
// SERVER
const port = process.env.SERVER_PORT || 5000
app.listen(port, () => {
    console.log(`Server listening on port ${port}...`)
})
