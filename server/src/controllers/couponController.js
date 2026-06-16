const Coupon = require('../models/Coupon')

// GET api/coupons/admin/all
exports.getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 })
    res.status(200).json({ success: true, coupons })
  }catch(err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// POST api/coupons
exports.createCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body)
    res.status(201).json({ success: true, coupon })
  }catch(err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// PUT api/coupons/:id
exports.updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' })
    res.status(200).json({ success: true, coupon })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// DELETE api/coupons/:id
exports.deleteCoupon = async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id)
    res.status(200).json({ success: true, message: 'Coupon deleted' })
  }catch(err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// POST api/coupons/apply — customer uses coupon
exports.applyCoupon = async (req, res) => {
  try {
    const { code, orderAmount } = req.body
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true })

    if (!coupon) return res.status(404).json({ success: false, message: 'Invalid coupon code' })
    if (coupon.expiresAt && new Date() > coupon.expiresAt) return res.status(400).json({ success: false, message: 'Coupon has expired' })
    if (coupon.usedCount >= coupon.maxUses) return res.status(400).json({ success: false, message: 'Coupon usage limit reached' })
    if (orderAmount < coupon.minOrderAmount) return res.status(400).json({ success: false, message: `Minimum order amount is ₹${coupon.minOrderAmount}` })

    const discount = coupon.discountType === 'percentage'
      ? Math.round(orderAmount * coupon.discountValue / 100)
      : coupon.discountValue

    res.status(200).json({ success: true, discount, coupon })
  }catch(err) {
    res.status(500).json({ success: false, message: err.message })
  }
}