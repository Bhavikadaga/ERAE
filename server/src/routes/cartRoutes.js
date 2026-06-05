const express = require('express')
const router = express.Router()
const {
    getCart,
    addToCart,
    updateCartItems,
    removeFromCart,
    clearCart
} = require('../controllers/cartController')
const { protect } = require('../middleware/auth')

router.use(protect)

router.get('/', getCart)
router.post('/', addToCart)
router.put('/:itemId', updateCartItems)
router.delete('/clear', clearCart)
router.delete('/:itemId', removeFromCart)

module.exports = router