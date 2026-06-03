const User = require('../models/User')
const generateToken = require('../utils/generateToken')

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000
}

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' })
    }

    const user = await User.create({ name, email, password, phone })
    const token = generateToken(user._id, user.role)

    res.cookie('token', token, cookieOptions)

    res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' })
    }

    const user = await User.findOne({ email }).select('+password')
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' })
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Your account has been deactivated' })
    }

    const token = generateToken(user._id, user.role)
    res.cookie('token', token, cookieOptions)

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// POST /api/auth/logout
exports.logout = (req, res) => {
  res.cookie('token', '', { ...cookieOptions, maxAge: 0 })
  res.status(200).json({ success: true, message: 'Logged out successfully' })
}

// GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    res.status(200).json({ success: true, user })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}