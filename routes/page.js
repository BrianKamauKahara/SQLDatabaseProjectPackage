const express = require('express')
const path = require('path')
const router = express.Router()
const ps = '../public-static'

router.use('/', express.static(path.join(__dirname, ps, 'home')))
router.use('/default-user-page', express.static(path.join(__dirname, ps, 'default-user')))
router.use('/sign-in-page', express.static(path.join(__dirname, ps, 'sign-in')))
router.use(['/sign-up-page', '/sign-up-admin'], express.static(path.join(__dirname, ps, 'sign-up')))
router.use('/admin-page', express.static(path.join(__dirname, ps, 'admin')))

router.get('/', async (req, res) => {
    return res.status(200).sendFile(path.join(__dirname,ps,'home', 'home.html'));
})

router.get('/default-user-page', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).sendFile(path.join(__dirname,ps,'error', 'error.html'))
    }
    return res.status(200).sendFile(path.join(__dirname, ps,'default-user', 'user.html'));
})

router.get('/sign-in-page', async (req, res) => {
    return res.status(200).sendFile(path.join(__dirname,ps,'sign-in', 'login.html'));
})

router.get('/sign-up-admin', async (req, res) => {
    return res.status(200).sendFile(path.join(__dirname,ps,'sign-up', 'sign-up-admin.html'));
})

router.get('/sign-up-page', async (req, res) => {
    return res.status(200).sendFile(path.join(__dirname,ps,'sign-up', 'sign-up.html'));
})

router.get('/admin-page', async (req, res) => {
    if (!req.session.user) {
        console.log(__dirname)
        return res.status(401).sendFile(path.join(__dirname,ps,'error', 'error.html'))
    }
    return res.status(200).sendFile(path.join(__dirname,ps,'admin', 'admin.html'));
})




module.exports = router