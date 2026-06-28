const Settings = require('../models/Settings')
const asyncHandler = require('../utils/asyncHandler')

exports.getSettings = asyncHandler(async (req, res) => {
  let settings = await Settings.findOne()
  if (!settings) settings = await Settings.create({})
  res.status(200).json({ success: true, settings })
})

exports.updateSettings = asyncHandler(async (req, res) => {
  let settings = await Settings.findOne()
  if (!settings) {
    settings = await Settings.create(req.body)
  } else {
    settings = await Settings.findByIdAndUpdate(settings._id, req.body, { new: true })
  }
  res.status(200).json({ success: true, settings })
})
