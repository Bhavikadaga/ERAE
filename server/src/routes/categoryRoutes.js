const express = require('express')
const router = express.Router()
const {
  getAllCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController')
const { protect, restrictTo } = require('../middleware/auth')

router.get('/', getAllCategories)
router.get('/:slug', getCategory)
router.post('/', protect, restrictTo('admin', 'superadmin'), createCategory)
router.put('/:id', protect, restrictTo('admin', 'superadmin'), updateCategory)
router.delete('/:id', protect, restrictTo('admin', 'superadmin'), deleteCategory)

module.exports = router