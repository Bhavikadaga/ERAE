const cloudinary = require('../config/cloudinary')
const asyncHandler = require('../utils/asyncHandler')

exports.uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' })
  }

  const b64 = Buffer.from(req.file.buffer).toString('base64')
  const dataURI = `data:${req.file.mimetype};base64,${b64}`

  const result = await cloudinary.uploader.upload(dataURI, {
    folder: 'Eraè-products',
    resource_type: 'auto'
  })

  res.status(200).json({
    success: true,
    image: {
      url: result.secure_url,
      public_id: result.public_id
    }
  })
})
