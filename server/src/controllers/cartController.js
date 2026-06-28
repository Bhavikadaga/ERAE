const Cart = require('../models/Cart')
const Product = require('../models/Product')
const asyncHandler = require('../utils/asyncHandler')

const CART_PRODUCT_FIELDS = 'name images'
const populateCart = (cart) =>
  cart.populate({ path: 'items.product', select: CART_PRODUCT_FIELDS, strictPopulate: false })

// GET api/cart
exports.getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id })
    .populate({ path: 'items.product', select: CART_PRODUCT_FIELDS, strictPopulate: false })

  if (!cart) {
    cart = { items: [], total: 0 }
  }
  res.status(200).json({ success: true, cart })
})

// POST api/cart - add items
exports.addToCart = asyncHandler(async (req, res) => {
  const { productId, size, quantity } = req.body

  if (!productId || !size || !quantity) {
    return res.status(400).json({ success: false, message: 'Product, size and quantity are required' })
  }

  const product = await Product.findById(productId)
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' })
  }
  if (!product.isActive) {
    return res.status(400).json({ success: false, message: 'This product is no longer available' })
  }

  const sizeObj = product.sizes.find(s => s.label === size)
  if (!sizeObj) {
    return res.status(400).json({ success: false, message: `Size ${size} is not available for this product` })
  }
  if (sizeObj.stock < quantity) {
    return res.status(400).json({
      success: false,
      message: sizeObj.stock === 0
        ? `Size ${size} is out of stock`
        : `Only ${sizeObj.stock} item${sizeObj.stock === 1 ? '' : 's'} left in size ${size}`
    })
  }

  const price = product.salePrice || product.price

  let cart = await Cart.findOne({ user: req.user._id })

  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      items: [{ product: productId, size, quantity, price }]
    })
  } else {
    const existingItem = cart.items.find(
      item => item.product.toString() === productId && item.size === size
    )

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cart.items.push({ product: productId, size, quantity, price })
    }
    await cart.save()
  }
  await populateCart(cart)

  res.status(200).json({ success: true, cart })
})

// PUT api/cart/:itemId - update quantity
exports.updateCartItems = asyncHandler(async (req, res) => {
  const { quantity } = req.body

  const cart = await Cart.findOne({ user: req.user._id })
  if (!cart) {
    return res.status(404).json({ success: false, message: 'Cart not found' })
  }

  const item = cart.items.id(req.params.itemId)
  if (!item) {
    return res.status(404).json({ success: false, message: 'Item not found in cart' })
  }

  if (quantity <= 0) {
    cart.items.pull(req.params.itemId)
  } else {
    item.quantity = quantity
  }

  await cart.save()
  await populateCart(cart)

  res.status(200).json({ success: true, cart })
})

// DELETE api/cart/:itemId - remove item
exports.removeFromCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id })
  if (!cart) {
    return res.status(404).json({ success: false, message: 'Cart not found' })
  }

  cart.items.pull(req.params.itemId)
  await cart.save()
  await populateCart(cart)

  res.status(200).json({ success: true, cart })
})


// DELETE api/cart/clear
exports.clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id })
  if (cart) {
    cart.items = []
    await cart.save()
  }
  res.status(200).json({ success: true, message: 'Cart cleared' })
})
