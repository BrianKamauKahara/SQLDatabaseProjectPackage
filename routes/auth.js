const express = require('express')
const router = express.Router()
const { createNewUser, signInUser } = require('../db/auth-functions.js')

router.post("/sign-up", async (req, res) => {
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
        console.log(error)
        res.status(500).json({
            success: false,
            data: {
                error: error.name,
                message: error.message
            }
        })
    }
})

router.post("/sign-in", async (req, res) => {
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

module.exports = router