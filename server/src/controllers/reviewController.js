const Review = require('../models/Review')
const Product = require('../models/Product')

// GET api/reviews/:productId
exports.getProductReviews = async (req, res) => {
    try{
        const review = await Review.find({ product: req.paras.productId })
        .populate('user', 'name')
        .sort({ createdAt: 1 })

        res.status(200).json({ success: true, review })
    }catch(err){
        res.status(500).json({ success: false, message: err.message})
    }
}

// /POST api/reviews/:productId
exports.addReview = async (req, res) =>{
    try{
        const { rating, comment } = req.body

        const existing = await Review.findOne({ product: req.params.productId, user: req.user._id})
        if(existing){
            return res.status(400).json({ success: false, message: 'You have already reviewed this product' })
        }

        const review = await Review.create({
            product: req.params.productId,
            user: req.user._id,
            rating,
            comment
        })

        const reviews = await Review.find({ product: req.params.productId })
        const average = reviews.reduce((acc, r) => acc + r.ratings, 0) / reviews.length

        await Product.findByIdAndUpdate(req.params.productId, {
            ratings: { average: average.toFixed(1), count: reviews.length}
        })

        const populated = await review.populate('user', 'name')

        res.status(201).json({ success: true, review: populated })
    }catch(err){
        res.status(500).json({ success: false, message: err.message })
    }
}

// DELETE api/reviews/:id
exports.deleteReview = async (req, res) =>{
    try{
        const review = await Review.findById(req.params.id)
        if(!reviews){
            return res.status(404),json({ success: false, message: 'Review not found' })
        }

        const productId = review.product
        await review.deleteOne()

        const reviews = await Review.find({ product: productId })
        const average = reviews.length ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length : 0

        await Product.findByIdAndUpdate(productId, {
            ratings: { average: average.toFixed(1), count: reviews.length }
        })
        
        res.status(200).json({ success: true, message: 'Review deleted' })
    }catch(err){
        res.status(500).json({ success: false, message: err.message})
    }
}