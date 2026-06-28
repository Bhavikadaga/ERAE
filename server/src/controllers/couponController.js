const Coupon = require('../models/Coupon')
const asyncHandler = require('../utils/asyncHandler')

// GET api/coupons/admin/all
exports.getAllCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 })
  res.status(200).json({ success: true, coupons })
})

// POST api/coupons
exports.createCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.create(req.body)
  res.status(201).json({ success: true, coupon })
})

// PUT api/coupons/:id
exports.updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true })
  if (!coupon) {
    return res.status(404).json({ success: false, message: 'Coupon not found' })
  }
  res.status(200).json({ success: true, coupon })
})

// DELETE api/coupons/:id
exports.deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id)
  if (!coupon) {
    return res.status(404).json({ success: false, message: 'Coupon not found' })
  }
  res.status(200).json({ success: true, message: 'Coupon deleted' })
})

// POST api/coupons/apply — customer uses coupon
exports.applyCoupon = asyncHandler(async (req, res) => {
  const { code, orderAmount } = req.body

  if (!code) {
    return res.status(400).json({ success: false, message: 'Please enter a coupon code' })
  }

  const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true })

  if (!coupon) {
    return res.status(404).json({ success: false, message: 'This coupon code is not valid' })
  }
  if (coupon.expiresAt && new Date() > coupon.expiresAt) {
    return res.status(400).json({ success: false, message: 'This coupon has expired' })
  }
  if (coupon.usedCount >= coupon.maxUses) {
    return res.status(400).json({ success: false, message: 'This coupon has reached its usage limit' })
  }
  if (orderAmount < coupon.minOrderAmount) {
    return res.status(400).json({ success: false, message: `Minimum order amount for this coupon is ₹${coupon.minOrderAmount}` })
  }

  const discount = coupon.discountType === 'percentage'
    ? Math.round(orderAmount * coupon.discountValue / 100)
    : coupon.discountValue

  res.status(200).json({ success: true, discount, coupon })
})
