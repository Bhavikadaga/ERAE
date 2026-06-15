const User = require('../models/User')

// GET api/users/admin/all
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 })
    res.status(200).json({ success: true, users })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// PUT api/users/admin/:id
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }
    res.status(200).json({ success: true, user })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}