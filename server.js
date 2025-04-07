// Module Imports
// AI
// ROLES: USER, ADMIN
/* ------ IMPORTS ------ */
// Module Imports
require('dotenv').config()
const express = require('express')
const cors = require('cors')

// Custom Imports (Useful)
const { connectToDB } = require('./db/db-functions.js')
const dbConfig = require('./db/get-admin-details.js')

// Route Imports
const dbRoutes = require('./routes/db.js');
const authRoutes = require('./routes/auth.js');
const pageRoutes = require('./routes/page.js');
const docsRoutes = require('./routes/docs.js') 


/* ------ INITIALIZATION ------ */
const app = express()

// MIDDLEWARE
app.use((req, res, next) => {
    console.log(req.method, req.url)
    next()
})
app.use(cors())
app.use(express.static('./public-static'))
app.use(express.json())


// ROUTES
app.use('/', pageRoutes)
app.use('/db', dbRoutes)
app.use('/auth', authRoutes)
app.use('/docs', docsRoutes)


// Page loads

// SERVER
const port = process.env.SERVER_PORT || 5000
app.listen(port, async () => {
    console.log(`Server listening on port ${port}...`)
    await connectToDB(dbConfig)
})
