const jwt = require('jsonwebtoken')
const User = require('../models/User')

exports.protect = async (req, res, next) => {
  try {
    console.log('cookies:', req.cookies)
    console.log('token:', req.cookies.token)

    let token

    if (req.cookies.token) {
      token = req.cookies.token
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token found'
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    console.log('decoded:', decoded)

    req.user = await User.findById(decoded.id)
    next()
  } catch (err) {
    console.log('AUTH ERROR:', err.message)

    return res.status(401).json({
      success: false,
      message: 'Not authorized'
    })
  }
}

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to perform this action'
      })
    }
    next()
  }
}