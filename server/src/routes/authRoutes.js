const express = require('express')
const router = express.Router()
const { register, login, logout, getMe, changePassword } = require('../controllers/authController')
const { protect } = require('../middleware/auth')
const validate = require('../middleware/validate')
const { registerValidator, loginValidator } = require('../middleware/validators')

router.post('/register', registerValidator, validate, register)
router.post('/login', loginValidator, validate, login)
router.post('/logout', logout)
router.get('/me', protect, getMe)
router.put('/change-password', protect, changePassword)

module.exports = router 
