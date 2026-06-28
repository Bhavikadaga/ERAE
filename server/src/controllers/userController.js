const User = require('../models/User')
const asyncHandler = require('../utils/asyncHandler')

// GET api/users/admin/all
exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 })
  res.status(200).json({ success: true, users })
})

// PUT api/users/admin/:id
exports.updateUser = asyncHandler(async (req, res) => {
  const updates = {}
  const allowed = ['name', 'phone', 'isActive']
  for (const key of allowed) {
    if (req.body[key] !== undefined) updates[key] = req.body[key]
  }

  if (req.body.role !== undefined) {
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({ success: false, message: 'Only superadmins can change user roles' })
    }
    updates.role = req.body.role
  }

  if (req.body.password !== undefined) {
    return res.status(400).json({ success: false, message: 'Passwords cannot be changed from this endpoint' })
  }

  const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true })
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' })
  }
  res.status(200).json({ success: true, user })
})
