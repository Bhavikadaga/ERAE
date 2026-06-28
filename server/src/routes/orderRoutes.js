const express = require('express')
const router = express.Router()
const {
  createOrder,
  getMyOrders,
  getOrder,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  getStats
} = require('../controllers/orderController')
const { protect, restrictTo } = require('../middleware/auth')
const validate = require('../middleware/validate')
const { orderValidator } = require('../middleware/validators')

router.use(protect)

router.post('/', orderValidator, validate, createOrder)
router.get('/my', getMyOrders)
router.get('/admin/all', restrictTo('admin', 'superadmin'), getAllOrders)
router.get('/admin/stats', restrictTo('admin', 'superadmin'), getStats)
router.get('/:id', getOrder)
router.put('/:id/cancel', cancelOrder)
router.put('/admin/:id/status', restrictTo('admin', 'superadmin'), updateOrderStatus)

module.exports = router