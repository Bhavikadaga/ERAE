const Category = require('../models/Category')
const asyncHandler = require('../utils/asyncHandler')

// GET /api/categories
exports.getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort({ displayOrder: 1 })
  res.status(200).json({ success: true, categories })
})

// GET /api/categories/:slug
exports.getCategory = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug, isActive: true })
  if (!category) {
    return res.status(404).json({ success: false, message: 'Category not found' })
  }
  res.status(200).json({ success: true, category })
})

// POST /api/categories — admin only
exports.createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create(req.body)
  res.status(201).json({ success: true, category })
})

// PUT /api/categories/:id — admin only
exports.updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  )
  if (!category) {
    return res.status(404).json({ success: false, message: 'Category not found' })
  }
  res.status(200).json({ success: true, category })
})

// DELETE /api/categories/:id — admin only (soft delete)
exports.deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  )
  if (!category) {
    return res.status(404).json({ success: false, message: 'Category not found' })
  }
  res.status(200).json({ success: true, message: 'Category deleted successfully' })
})
