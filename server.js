require('dotenv').config()

const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.static('./public-static'))
app.use(express.json())

// METHODS
app.get("/", (req, res) => {
    res.status(200).send("Aloha!")
})

// SERVER
const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`Server listening on port ${port}...`)
})
