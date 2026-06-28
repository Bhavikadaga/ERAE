const Product = require('../models/Product')
const asyncHandler = require('../utils/asyncHandler')

// GET  api/products
exports.getAllProducts = asyncHandler(async (req, res) => {
  const { category, sort, minPrice, maxPrice, search, page = 1, limit = 12 } = req.query

  let filter = { isActive: true }

  if (search) {
    filter.$text = { $search: search }
  }

  if (category) {
    filter.category = category
  }

  if (minPrice || maxPrice) {
    filter.price = {}
    if (minPrice) filter.price.$gte = Number(minPrice)
    if (maxPrice) filter.price.$lte = Number(maxPrice)
  }

  let sortOption = { createdAt: -1 }
  if (sort === 'price-low') sortOption = { salePrice: 1, price: 1 }
  if (sort === 'price-high') sortOption = { salePrice: -1, price: -1 }
  if (sort === 'newest') sortOption = { createdAt: -1 }

  const skip = (Number(page) - 1) * Number(limit)

  const products = await Product.find(filter)
    .populate({ path: 'category', strictPopulate: false })
    .sort(sortOption)
    .skip(skip)
    .limit(Number(limit))

  const total = await Product.countDocuments(filter)

  res.status(200).json({
    success: true,
    products,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      limit: Number(limit)
    }
  })
})

// GET api/products/:id
exports.getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate({ path: 'category', strictPopulate: false })

  if (!product || !product.isActive) {
    return res.status(404).json({ success: false, message: 'Product not found' })
  }
  res.status(200).json({ success: true, product })
})

// GET api/products/featured
exports.getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isActive: true, isFeatured: true })
    .populate({ path: 'category', strictPopulate: false })
    .limit(8)

  res.status(200).json({ success: true, products })
})

// POST api/products - Admin only
exports.createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body)
  res.status(201).json({ success: true, product })
})

// PUT api/products/:id - Admin only
exports.updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  )

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' })
  }

  res.status(200).json({ success: true, product })
})

// DELETE api/product/:id - admin
exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  )

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' })
  }

  res.status(200).json({ success: true, message: 'Product deleted successfully' })
})
