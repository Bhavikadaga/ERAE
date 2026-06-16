const express = require('express')
const router = express.Router()
const { getAllCoupons, createCoupon, updateCoupon, deleteCoupon, applyCoupon } = require('../controllers/couponController')
const { protect, restrictTo } = require('../middleware/auth')

router.get('/admin/all', protect, restrictTo('admin', 'superadmin'), getAllCoupons)
router.post('/', protect, restrictTo('admin', 'superadmin'), createCoupon)
router.put('/:id', protect, restrictTo('admin', 'superadmin'), updateCoupon)
router.delete('/:id', protect, restrictTo('admin', 'superadmin'), deleteCoupon)
router.post('/apply', protect, applyCoupon)

module.exports = router