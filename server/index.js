const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
require('dotenv').config()
const authRoutes = require('./src/routes/authRoutes')
const productRoutes = require('./src/routes/productRoutes')
const categoryRoutes = require('./src/routes/categoryRoutes')
const cartRoutes = require('./src/routes/cartRoutes')
const wishlistRoutes = require('./src/routes/wishlistRoutes')
const orderRoutes = require('./src/routes/orderRoutes')
const reviewRoutes = require('./src/routes/reviewRoutes')
const uploadRoutes = require('./src/routes/uploadRoutes')
const userRoutes = require('./src/routes/userRoutes')
const couponRoutes = require('./src/routes/couponRoutes')
const settingsRoutes = require('./src/routes/settingsRoutes')
const app = express()
const connectDB = require('./src/config/db')
connectDB();

app.use(helmet())
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'))
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/wishlist', wishlistRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/users', userRoutes)
app.use('/api/coupons', couponRoutes)
app.use('/api/settings', settingsRoutes)

app.get('/', (req, res) =>{
    res.json({ message: 'Server is running' })
})

app.use((err, req, res, next) => {
    console.error(err)

    if (err.name === 'ValidationError') {
        const firstField = Object.values(err.errors)[0]
        return res.status(400).json({
            success: false,
            message: firstField?.message || 'Validation failed'
        })
    }

    if (err.name === 'CastError') {
        return res.status(400).json({
            success: false,
            message: `Invalid ${err.path || 'id'}`
        })
    }

    if (err.code === 11000) {
        const field = Object.keys(err.keyValue || {})[0] || 'field'
        return res.status(409).json({
            success: false,
            message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
        })
    }

    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            message: 'Session is invalid or has expired'
        })
    }

    res.status(err.statusCode || 500).json({
        success: false,
        message: err.expose ? err.message : 'Something went wrong'
    })
})

module.exports = app