const Order = require('../models/Order')
const Cart = require('../models/Cart')

// POST api/orders
exports.createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod, couponCode, discount = 0 } = req.body

    const cart = await Cart.findOne({ user: req.user._id })
      .populate({ path: 'items.product', strictPopulate: false })

    if (!cart || cart.items.length === 0) {
        return res.status(400).json({ success: false, message: 'Cart is empty' })
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

    if (couponCode) {
      await require('../models/Coupon').findOneAndUpdate(
      { code: couponCode.toUpperCase() },
      { $inc: { usedCount: 1 } }
    )
  }

    cart.items = []
    await cart.save()

    res.status(201).json({ success: true, order })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// GET api/orders/my
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })

    res.status(200).json({ success: true, orders })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// GET api/orders/:id
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' })
    }

    if (order.user.toString() !== req.user._id.toString() && req.user.role === 'customer') {
      return res.status(403).json({ success: false, message: 'Not authorized' })
    }

    res.status(200).json({ success: true, order })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// PUT api/orders/:id/cancel
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' })
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' })
    }

    if (!['pending', 'confirmed'].includes(order.orderStatus)) {
      return res.status(400).json({ success: false, message: 'Order cannot be cancelled at this stage' })
    }

    order.orderStatus = 'cancelled'
    order.cancelledAt = Date.now()
    order.statusHistory.push({ status: 'cancelled', note: 'Cancelled by customer' })
    await order.save()

    res.status(200).json({ success: true, order })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// GET api/orders/admin/all
exports.getAllOrders = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// PUT api/orders/admin/:id/status
exports.updateOrderStatus = async (req, res) => {
  try {
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

    res.status(200).json({ success: true, order })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}