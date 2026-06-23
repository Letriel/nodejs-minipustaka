const express = require('express')
const router = express.Router()
const AuthController = require('../controllers/AuthController')
const { redirectIfAuth } = require('../middlewares/auth')

router.get('/register', redirectIfAuth, AuthController.showRegister)
router.post('/register', redirectIfAuth, AuthController.register)
router.get('/login', redirectIfAuth, AuthController.showLogin)
router.post('/login', redirectIfAuth, AuthController.login)
router.post('/logout', AuthController.logout)

module.exports = router