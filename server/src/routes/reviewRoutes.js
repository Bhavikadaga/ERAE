const express = require('express')
const router = express.Router()
const { getAllReviews, getProductReviews, addReview, deleteReview } = require('../controllers/reviewController')
const { protect, restrictTo } = require('../middleware/auth')
const validate = require('../middleware/validate')
const { reviewValidator } = require('../middleware/validators')

router.get('/admin/all', protect, restrictTo('admin', 'superadmin'), getAllReviews)
router.get('/:productId', getProductReviews)
router.post('/:productId', protect, reviewValidator, validate, addReview)
router.delete('/:id', protect, deleteReview)

module.exports = router