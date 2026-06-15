const express = require('express')
const router = express.Router()
const { getAllUsers, updateUser } = require('../controllers/userController')
const { protect, restrictTo } = require('../middleware/auth')

router.get('/admin/all', protect, restrictTo('admin', 'superadmin'), getAllUsers)
router.put('/admin/:id', protect, restrictTo('admin', 'superadmin'), updateUser)

module.exports = router