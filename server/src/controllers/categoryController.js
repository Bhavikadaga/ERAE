const Category = require('../models/Category')

// GET /api/categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ displayOrder: 1 })
    res.status(200).json({ success: true, categories })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// GET /api/categories/:slug
exports.getCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug, isActive: true })
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' })
    }
    res.status(200).json({ success: true, category })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// POST /api/categories — admin only
exports.createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body)
    res.status(201).json({ success: true, category })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// PUT /api/categories/:id — admin only
exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' })
    }
    res.status(200).json({ success: true, category })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// DELETE /api/categories/:id — admin only (soft delete)
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    )
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' })
    }
    res.status(200).json({ success: true, message: 'Category deleted successfully' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}