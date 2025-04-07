const express = require('express')
const router = express.Router()

router.get("/csv/:location", async (req, res) => {
    const csvFilePath = decodeURIComponent(req.params.location)
    console.log(csvFilePath)
    res.download(csvFilePath)
})

module.exports = router