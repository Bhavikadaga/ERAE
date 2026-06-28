const User = require('../models/User')
const generateToken = require('../utils/generateToken')
const asyncHandler = require('../utils/asyncHandler')

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000
}

const safeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role
})

// POST /api/auth/register
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body

  const existingUser = await User.findOne({ email })
  if (existingUser) {
    return res.status(409).json({ success: false, message: 'An account with this email already exists' })
  }

  const user = await User.create({ name, email, password, phone })
  const token = generateToken(user._id, user.role)

  res.cookie('token', token, cookieOptions)
  res.status(201).json({ success: true, user: safeUser(user) })
})

// POST /api/auth/login
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email and password' })
  }

  const user = await User.findOne({ email }).select('+password')
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ success: false, message: 'Incorrect email or password' })
  }

  if (user.isActive === false) {
    return res.status(403).json({ success: false, message: 'Your account has been deactivated' })
  }

  const token = generateToken(user._id, user.role)
  res.cookie('token', token, cookieOptions)
  res.status(200).json({ success: true, user: safeUser(user) })
})

// POST /api/auth/logout
exports.logout = (req, res) => {
  res.cookie('token', '', { ...cookieOptions, maxAge: 0 })
  res.status(200).json({ success: true, message: 'Logged out successfully' })
}

// GET /api/auth/me
exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' })
  }
  res.status(200).json({ success: true, user })
})

// PUT api/auth/change-password
exports.changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ success: false, message: 'Please provide current and new password' })
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' })
  }

  const user = await User.findById(req.user._id).select('+password')
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' })
  }

  const isMatch = await user.comparePassword(currentPassword)
  if (!isMatch) {
    return res.status(400).json({ success: false, message: 'Current password is incorrect' })
  }

  user.password = newPassword
  await user.save()

  res.status(200).json({ success: true, message: 'Password changed successfully' })
})
