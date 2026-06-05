const mongoose = require('mongoose')

const chartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            size: {
                type: String,
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1,
                default: 1
            },
            price: {
                type: Number,
                required: true
            }
        }
    ]
}, { timestamps: true })

chartSchema.virtual('total').get( function() {
    return this.items.reduce((acc, item) => acc + item.price * item.quantity, 0)
})

// virtual fileds in api response
chartSchema.set('toJSON', { virtuals: true})

module.exports = mongoose.model('Cart', chartSchema)