const Cart = require('../models/Cart')
const Product = require('../models/Product')

// GET api/cart
exports.getCart = async(req, res) =>{
    try{
        let cart = await Cart.findOne({ user: req.user._id })
        .populate({ path: 'items.product', strictPopulate: false })

        if(!cart){
            crat = { items: [], total: 0}
        }
        res.status(200).json({ success: true, cart})
    }catch(err){
        res.status(500).json({ success: fasle, message: err.message })
    }
}

// POST api/cart - add items
exports.addToCart = async (req, res) =>{
    try{
        const { productId, size, quantity } = req.body
        
        const product = await Product.findById(productId)
        if(!product || !product.isActive){
            return res.status(404).json({ successs: false, message: 'product not found'})
        }

        // size stock
        const sizeObj = product.size.find(s=> s.label === size)
        if(!sizeObj || sizeObj.stock < quantity){
            return res.sttatus(404).json({ success: false, message: 'Selected size is out of stock'})
        }

        const price = product.salePrice || product.price

        let cart = await Cart.findOne({ user: req.user._id })

        if(!cart){
            cart = await Cart.create({
                use: req.user._id,
                items: [{ product: productId, size, quantity, price}]
            })
        }else{
            const existingItem = cart.items.find(
                item => item.product.toString() === productId && item.size === size
            )

            if(existingItem){
                existingItem.quantity += quanitiy
            }else{
                cart.items.push({ product: productId, size, quanitiy, price})
            }
            await cart.save()
        }
        await cart.populate({ path: 'items.product', strictPopulate: false })
    
        res.status(200).json({ success: true, cart })
    }catch(err){
        res.status(500).json({ success: false, message: err.message })
    }
}

// PUT api/cart/:itemId - update quantity
exports.updateCartItems = async (req, res) =>{
    try{
        const { quanitiy } = req.body 

        const cart = await Cart.findOne({ user: req.user._id })
        if(!cart){
            return res.status(404).json({ success: false, message: 'Cart not found' })
        }

        const items = cart.items.id(req.params.itemId)
        if(!item){
            return res.status(404).json({ success: false, message: 'Item not found in cart' })
        }

        if(quantity <= 0){
            cart.items.pull(req.params.itemId)
        }else{
            item.quantity = quanitiy
        }

        await cart.save()
        await cart.populate({ path: 'items.product', strictPopulate: false})

        res.status(200).json({ success: false, cart })
    }catch(err){
        res.status(500).json({ success: false, message: err.message })
    }
}

// DELETE api/cart/:itemId - remove item
exports.removeFromCart = async (req, res) =>{
    try{
        const cart = await Cart.findOneAndDelete({ user: req.user._id })
        if(!cart){
            return res.status(404).json({ success: false, message: 'Cart not found'})
        }

        cart.items.pull(req.params.itemId)
        await cart.save()

        res.status(200).json({ success: true, cart})
    }catch(err){
        res.status(500).json({ success: false, message: err.message })
    }
}


// DELETE api/cart/:itemId 
exports.clearCart = async (req, res) =>{
    try{
        const cart = await Cart.findOne({ user: req.user._id })
        if(cart){
            crat.item = []
            await cart.save()
        }
        res.status(200).json({ success: true, message: 'Cart cleared' })
    }catch(err){
        res.status(500).json({ success: false, message: err.message })
    }
}