const express = require('express')
const router = express.Router()
const { 
    getTables,
    getDataInAndSaveTable,
    getDataFromCustomQuery
} = require('../db/db-functions.js')
const dbConfig = require('../db/get-admin-details.js')

router.get("/tables/:name/attributes", async (req, res) => {
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
        if (csvFilePath) {
            res.status(200).json({ csvFilePath: csvFilePath })
        } else {
            res.status(400).json({ // Cleaning up for in case table is empty
                success: false,
                data: {
                    error: "Bad Request",
                    message: "No attributes selected"
                }
            })
        }

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

router.get("/tables", async (req, res) => {
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

router.post("/custom", async(req, res) => {
    /* if(!req.session.user === 'admin') {
        return res.status(401).json({
            success: false,
            data: {
                error: "Unauthorized Request",
                message: "Only Executable by admins"
            }
        })
    } */
    const query = req.body.query
    try {
        const csvFilePath = await getDataFromCustomQuery(dbConfig, query)
        return res.status(200).json({
            success: true,
            data: {
                csvFilePath: csvFilePath
        }})
    } catch (error) {
        return res.status(404).json({
            success: false,
            data: {
                error: error.name,
                message: error.message,
                all: error.all
            }
        })
    }
})

module.exports = router