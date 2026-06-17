const mongoose = require('mongoose')

const settingsSchema = new mongoose.Schema({
  accentColor: { type: String, default: '#A8B89C' },
  announcementText: { type: String, default: 'Free Shipping Above ₹999 | COD Available | 7 Day Easy Returns' },
  freeShippingAbove: { type: Number, default: 999 },
  shippingCharge: { type: Number, default: 99 }
}, { timestamps: true })

module.exports = mongoose.model('Settings', settingsSchema)