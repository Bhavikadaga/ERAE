const cloudinary = require('../config/cloudinary')

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' })
    }

    // Convert buffer to base64
    const b64 = Buffer.from(req.file.buffer).toString('base64')
    const dataURI = `data:${req.file.mimetype};base64,${b64}`

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'erea-products',
      resource_type: 'auto'
    })

    res.status(200).json({
      success: true,
      image: {
        url: result.secure_url,
        public_id: result.public_id
      }
    })
  } catch (err) {
    console.log('Upload error:', err)
    res.status(500).json({ success: false, message: err.message || 'Upload failed' })
  }
}