const Wishlist = require('../models/Wishlist')
const Product = require('../models/Product')
const { StrictMode } = require('react')

// GET /api/wishlist
exports.getWishlist = async(req, res) =>{
    try{
        let wishlist = await Wishlist.findOne({user: req.user._id})
        .populate({ path: 'products', StrictPopulate: false })
        if(!wishlist){
            wishlist = await Wishlist.create({
                user: req.user._id,
                products: []
            })
        }
        res.status(200).json({ success: true, wishlist })
    }catch(err){
        res.status(500).json({ success: false, message: err.message })
    }
}

// POST api/wishlist/:productId
exports.addToWishlist = async (req, res) =>{
    try{
        const product = await Product.findById(req.params.productId)

        if(!product){
            res.status(404).json({ success: false, message: 'Product not found' })
        }

        let wishlist = await Wishlist.findOne({ user: req.user._id })

        if(!wishlist){
            wishlist = await Wishlist.create({
                user: req.user._id,
                products: []
            })
        }

        const exists = wishlist.products.includes(req.params.productId)

        if(!exists){
            wishlist.products.push(req.params.productId)
            await wishlist.save()
        }
        res.status(200).json({ success: true, wishlist})
    }catch(err){
        res.status(500).json({ success: false, message: err.message })
    }
}

// DELETE api/wishlist/:productId
exports.removeFromWishlist = async (req, res) =>{
    try{
        const wishlist = await Wishlist.findOne({ user: req.user._id })
        if(!wishlist){
            return res.status(404).json({ success: false, message: 'Wishlist not found'})
        }

        wishlist.products.pull(req.params.productId)
        await wishlist.save()

        res.status(200).json({ success: true, wishlist })
    }catch(err){
        res.status(500).json({ success: false, message: err.message })
    }
}