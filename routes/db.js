const express = require('express')
const router = express.Router()

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

module.exports = router