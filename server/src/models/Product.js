const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: [true, "Product name is required"],
        trim: true
    },
    description: {
        type: String, 
        required: [true, 'Description is required']
    },
    price:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Category is required']
    },
    images: [
        {
            url: { type: String, required: true},
            public_id: { type: String, required: true}
        }
    ],
    size: [
        {
            label: {type: String, enum[ 'XS', 'S', 'M', 'L', 'XL', 'XXL']},
            stock: {type: Number, default: 0}
        }
    ],
    fabric: {
        type: String,
        enum: ['New In', 'Best Seller', 'Sale', 'Most Wanted', 'Fast Mover', null],
        default: null
    },
    tags: [String],
    isActive: {
        type: Boolean,
        default: true
    },
     isFeatured: {
        type: Boolean,
        default: false
    },
    ratings: {
        average: { type: Number, default: 0 },
        count: { type: Number, default: 0 }
    }

}, { timestamps: true })

// Index for search and filtering
productSchema.index({ name: 'text', description: 'text', tags: 'text' })
productSchema.index({ category: 1 })
productSchema.index({ price: 1 })
productSchema.index({ isActive: 1 })

module.exports = mongoose.model('Product', productSchema)