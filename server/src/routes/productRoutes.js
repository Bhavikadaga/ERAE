const express = require('express')
const router = express.Router()
const { getAllProducts, 
        getProduct,
        getFeaturedProducts, 
        createProduct,
        updateProduct,
        deleteProduct
    } = require('../controllers/productController')
const { protect, restrictTo } = require('../middleware/auth')

router.get('/featured', getFeaturedProducts)
router.get('/', getAllProducts)
router.get('/:id', getProduct)
router.post('/', protect, restrictTo('admin', 'superadmin'), createProduct)
router.put('/:id', protect, restrictTo('admin', 'superadmin'), updateProduct)
router.delete('/:id', protect, restrictTo('admin', 'superadmin'), deleteProduct)

module.exports = router