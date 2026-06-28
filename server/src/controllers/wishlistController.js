const Wishlist = require('../models/Wishlist')
const Product = require('../models/Product')
const asyncHandler = require('../utils/asyncHandler')

const WISHLIST_PRODUCT_FIELDS = 'name images price salePrice badge'
const populateWishlist = (wishlist) =>
  wishlist.populate({ path: 'products', select: WISHLIST_PRODUCT_FIELDS, strictPopulate: false })

// GET /api/wishlist
exports.getWishlist = asyncHandler(async (req, res) => {
  let wishlist = await Wishlist.findOne({ user: req.user._id })
    .populate({ path: 'products', select: WISHLIST_PRODUCT_FIELDS, strictPopulate: false })
  if (!wishlist) {
    wishlist = await Wishlist.create({
      user: req.user._id,
      products: []
    })
  }
  res.status(200).json({ success: true, wishlist })
})

// POST api/wishlist/:productId
exports.addToWishlist = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId)
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' })
  }

  let wishlist = await Wishlist.findOne({ user: req.user._id })

  if (!wishlist) {
    wishlist = await Wishlist.create({
      user: req.user._id,
      products: []
    })
  }

  const exists = wishlist.products.some(p => p.toString() === req.params.productId)

  if (!exists) {
    wishlist.products.push(req.params.productId)
    await wishlist.save()
  }
  await populateWishlist(wishlist)
  res.status(200).json({ success: true, wishlist })
})

// DELETE api/wishlist/:productId
exports.removeFromWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id })
  if (!wishlist) {
    return res.status(404).json({ success: false, message: 'Wishlist not found' })
  }

  wishlist.products.pull(req.params.productId)
  await wishlist.save()
  await populateWishlist(wishlist)

  res.status(200).json({ success: true, wishlist })
})
