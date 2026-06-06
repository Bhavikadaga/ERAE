const express = require('express')
const router = express.Router()
const {
  createOrder,
  getMyOrders,
  getOrder,
  cancelOrder,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/orderController')
const { protect, restrictTo } = require('../middleware/auth')

router.use(protect)

router.post('/', createOrder)
router.get('/my', getMyOrders)
router.get('/admin/all', restrictTo('admin', 'superadmin'), getAllOrders)
router.get('/:id', getOrder)
router.put('/:id/cancel', cancelOrder)
router.put('/admin/:id/status', restrictTo('admin', 'superadmin'), updateOrderStatus)

module.exports = router