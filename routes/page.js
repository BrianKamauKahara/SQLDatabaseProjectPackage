const express = require('express')
const path = require('path')
const router = express.Router()

router.use('/', express.static(path.join(__dirname, '../', 'public-static', 'home')))
router.use('/default-user-page', express.static(path.join(__dirname, '../', 'public-static', 'default-user')))
router.use('/sign-in-page', express.static(path.join(__dirname, '../', 'public-static', 'sign-in')))
router.use('/sign-up-page', express.static(path.join(__dirname, '../', 'public-static', 'sign-up')))
router.use('/admin-page', express.static(path.join(__dirname, '../', 'public-static', 'admin')))

router.get('/', async (req, res) => {
    return res.status(200).sendFile(path.join(__dirname,'../', 'public-static','home', 'home.html'));
})

router.get('/default-user-page', async (req, res) => {
    if (!req.body) {
        console.log(__dirname)
        return res.status(401).sendFile(path.join(__dirname,'../', 'public-static','error', 'error.html'))
    }
    return res.status(200).sendFile(path.join(__dirname, '../', 'public-static','default-user', 'user.html'));
})

router.get('/sign-in-page', async (req, res) => {
    return res.status(200).sendFile(path.join(__dirname,'../', 'public-static','sign-in', 'login.html'));
})

router.get('/sign-up-page', async (req, res) => {
    return res.status(200).sendFile(path.join(__dirname,'../', 'public-static','sign-up', 'sign-up.html'));
})

router.get('/admin-page', async (req, res) => {
    if (!req.body) {
        console.log(__dirname)
        return res.status(401).sendFile(path.join(__dirname,'../', 'public-static','error', 'error.html'))
    }
    return res.status(200).sendFile(path.join(__dirname,'../', 'public-static','admin', 'admin.html'));
})




module.exports = router