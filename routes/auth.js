const express = require('express')
const router = express.Router()
const { createNewUser, signInUser } = require('../db/auth-functions.js')

router.post("/sign-up", async (req, res) => {
    const userDetails = req.body
    try {
        const response = await createNewUser(userDetails)
        const status = response.success ? 200 : response.conflict ? 409 : 401

        if (response.success) {
            req.session.user = {
                name: userDetails.associationName,
                role: userDetails.admin ? 'admin' : 'default'
            }
        } 
        res.status(status).json({
            success: response.success,
            data: {
                conflict: response.conflict
            }
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

router.post("/sign-in", async (req, res) => {
    const loginDetails = req.body
    try {
        const result = await signInUser(loginDetails)
        const status = result.loggedIn ? 200 : 409

        if (result.loggedIn) {
            req.session.user = {
                name: loginDetails.associationName, // Needs polishing
                role: loginDetails.role
            }
            console.log(req.session)
        }
        res.status(status).json({
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