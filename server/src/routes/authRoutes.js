const express = require('express')
const router = express.Router()
const { register, login, logout, getMe } = require('../controllers/authController')
const { protect } = require('../middleware/auth')
const validate = require('../middleware/validate')
const { registerValidator, loginValidator } = require('../middleware/validators')

router.post('/register', register, validate, register)
router.post('/login', loginValidator, validate, login)
router.post('/logout', logout)
router.get('/me', protect, getMe)

module.exports = router 
