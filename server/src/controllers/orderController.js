const Order = require('../models/Order')
const Cart = require('../models/Cart')
const Coupon = require('../models/Coupon')
const Product = require('../models/Product')
const User = require('../models/User')
const asyncHandler = require('../utils/asyncHandler')

// POST api/orders
exports.createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod, couponCode, discount = 0 } = req.body

  const cart = await Cart.findOne({ user: req.user._id })
    .populate({ path: 'items.product', select: 'name images', strictPopulate: false })

  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ success: false, message: 'Your cart is empty' })
  }

  if (couponCode) {
    const claimed = await Coupon.findOneAndUpdate(
      {
        code: couponCode.toUpperCase(),
        isActive: true,
        $expr: { $lt: ['$usedCount', '$maxUses'] }
      },
      { $inc: { usedCount: 1 } },
      { new: true }
    )
    if (!claimed) {
      return res.status(400).json({ success: false, message: 'This coupon is no longer available' })
    }
  }

  const items = cart.items.map(item => ({
    product: item.product._id,
    name: item.product.name,
    image: item.product.images[0]?.url || '',
    size: item.size,
    quantity: item.quantity,
    price: item.price
  }))

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const shippingCharge = subtotal >= 999 ? 0 : 99
  const total = subtotal + shippingCharge - discount

  const order = await Order.create({
    user: req.user._id,
    items,
    shippingAddress,
    paymentMethod,
    subtotal,
    shippingCharge,
    discount,
    total,
    couponCode,
    statusHistory: [{ status: 'pending', note: 'Order placed' }]
  })

  cart.items = []
  await cart.save()

  res.status(201).json({ success: true, order })
})

// GET api/orders/my
exports.getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 })
  res.status(200).json({ success: true, orders })
})

// GET api/orders/:id
exports.getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' })
  }

  if (order.user.toString() !== req.user._id.toString() && req.user.role === 'customer') {
    return res.status(403).json({ success: false, message: 'You can only view your own orders' })
  }

  res.status(200).json({ success: true, order })
})

// PUT api/orders/:id/cancel
exports.cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' })
  }

  if (order.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: 'You can only cancel your own orders' })
  }

  if (!['pending', 'confirmed'].includes(order.orderStatus)) {
    return res.status(400).json({
      success: false,
      message: `Order cannot be cancelled — current status is "${order.orderStatus}"`
    })
  }

  order.orderStatus = 'cancelled'
  order.cancelledAt = Date.now()
  order.statusHistory.push({ status: 'cancelled', note: 'Cancelled by customer' })
  await order.save()

  res.status(200).json({ success: true, order })
})

// GET api/orders/admin/all
exports.getAllOrders = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query
  let filter = {}
  if (status) filter.orderStatus = status

  const skip = (Number(page) - 1) * Number(limit)

  const orders = await Order.find(filter)
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit))

  const total = await Order.countDocuments(filter)

  res.status(200).json({
    success: true,
    orders,
    pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) }
  })
})

// PUT api/orders/admin/:id/status
exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderStatus, note } = req.body

  const order = await Order.findById(req.params.id)
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' })
  }

  order.orderStatus = orderStatus
  order.statusHistory.push({ status: orderStatus, note: note || '' })

  if (orderStatus === 'delivered') order.deliveredAt = Date.now()
  if (orderStatus === 'cancelled') order.cancelledAt = Date.now()

  await order.save()
  await order.populate('user', 'name email')

  res.status(200).json({ success: true, order })
})

// GET api/orders/admin/stats
exports.getStats = asyncHandler(async (req, res) => {
  const [recentOrders, totalOrders, totalProducts, totalCustomers] = await Promise.all([
    Order.find().populate('user', 'name').sort({ createdAt: -1 }).limit(5),
    Order.countDocuments(),
    Product.countDocuments({ isActive: true }),
    User.countDocuments({ role: 'customer' })
  ])

  const revenue = recentOrders.reduce((acc, o) => acc + (o.total || 0), 0)

  res.status(200).json({
    success: true,
    stats: {
      totalOrders,
      totalProducts,
      totalCustomers,
      revenue
    },
    recentOrders
  })
})
