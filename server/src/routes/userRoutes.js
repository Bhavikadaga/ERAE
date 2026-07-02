const express = require('express')
const router = express.Router()
const { getAllUsers, updateUser } = require('../controllers/userController')
const { protect, restrictTo } = require('../middleware/auth')
const { getAllUsers, updateUser, updateUserRole } = require('../controllers/userController')

router.get('/admin/all', protect, restrictTo('admin', 'superadmin'), getAllUsers)
router.put('/admin/:id', protect, restrictTo('admin', 'superadmin'), updateUser)
router.put('/admin/:id/role', protect, restrictTo('superadmin'), updateUserRole)
module.exports = router