const mongoose = require('mongoose')
const Review = require('../models/Review')
const Product = require('../models/Product')
const asyncHandler = require('../utils/asyncHandler')

const recomputeRatings = async (productId) => {
  const stats = await Review.aggregate([
    { $match: { product: new mongoose.Types.ObjectId(productId) } },
    { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } }
  ])
  const { avg = 0, count = 0 } = stats[0] || {}
  await Product.findByIdAndUpdate(productId, {
    ratings: { average: avg.toFixed(1), count }
  })
}

// GET api/reviews/admin/all
exports.getAllReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find()
    .populate('user', 'name')
    .populate('product', 'name')
    .sort({ createdAt: -1 })
  res.status(200).json({ success: true, reviews })
})

// GET api/reviews/:productId
exports.getProductReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId })
    .populate('user', 'name')
    .sort({ createdAt: -1 })
  res.status(200).json({ success: true, reviews })
})

// POST api/reviews/:productId
exports.addReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body

  const product = await Product.findById(req.params.productId)
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' })
  }

  const existing = await Review.findOne({ product: req.params.productId, user: req.user._id })
  if (existing) {
    return res.status(409).json({ success: false, message: 'You have already reviewed this product' })
  }

  try {
    const review = await Review.create({
      product: req.params.productId,
      user: req.user._id,
      rating,
      comment
    })

    await recomputeRatings(req.params.productId)

    const populated = await review.populate('user', 'name')
    res.status(201).json({ success: true, review: populated })
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: 'You have already reviewed this product' })
    }
    throw err
  }
})

// DELETE api/reviews/:id
exports.deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id)
  if (!review) {
    return res.status(404).json({ success: false, message: 'Review not found' })
  }

  const isOwner = review.user.toString() === req.user._id.toString()
  const isAdmin = req.user.role === 'admin' || req.user.role === 'superadmin'
  if (!isOwner && !isAdmin) {
    return res.status(403).json({ success: false, message: 'You can only delete your own reviews' })
  }

  const productId = review.product
  await review.deleteOne()

  await recomputeRatings(productId)

  res.status(200).json({ success: true, message: 'Review deleted' })
})
