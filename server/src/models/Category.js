const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category name is required'],
        trim: true,
        unique: true
    },
    slug: {
        type: String,
        required: [true, 'Slug is required'],
        unique: true,
        lowercase: true
    },
    description: {
        type: String,
        trim: true
    },
    image: {
        url: { type: String },
        public_id: { type: String }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    displayOrder:{
        type: Number,
        default: 0
    }
}, { timestamps: true })

categorySchema.index({ slug: 1 })
categorySchema.index({ isActive: 1 })

module.exports = mongoose.model('Category', categorySchema)