const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
// const mongoSanitize = require('express-mongo-sanitize')
require('dotenv').config()
const authRoutes = require('./src/routes/authRoutes')
const app = express()

app.use(helmet())
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))
app.use(express.json())
app.use(cookieParser())
// app.use(mongoSanitize({ replaceWith: '_' }))
app.use(morgan('dev'))
app.use('/api/auth', authRoutes)

app.get('/', (req, res) =>{
    res.json({ message: 'Server is running' })
})

module.exports = app