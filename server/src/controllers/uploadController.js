const cloudinary = require('../config/cloudinary')

// POST api/upload
exports.uploadImage = async (req, res) =>{
    try{
        if(!req.file){
            return res.status(400).json({ success: false, message: 'No file uploaded'})
        }
        
        const b64 = Buffer.from(req.file.buffer).toString('base64')
        const dataURI = `data:/${req.file.mimetype};base64,${b64}`

        const result = await cloudinary.uploader.upload(dataURI, {
            folder: 'erae-products'
        })

        res.status(200).json({
            success: true,
            image: {
                url: result.secure_url,
                public_id: result.public_id
            }
        })
    }catch(err){
        res.status(500).json({ success: false, message: err.message })
    }
}