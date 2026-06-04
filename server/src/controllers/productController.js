const Product = require('../models/Product')

// GET  api/products
exports.getAllProducts = async (req, res) =>{
    try{
        const { category, sort, minPrice, maxPrice, search, page = 1, limit = 12 } = req.query
        
        let filter= { isActive: true }

        // Search
        if(search){
            filter.$text = { $search: search }
        }

        if(category){
            filter.category = category
        }

        if(minPrice || maxPrice){
            filter.price = {}
            if(minPrice) query.page.$gte = Number(minPrice)
            if(maxPrice) query.price.$lte  = Number(maxPrice)
        }

        // Sorting
        let sortOption = { createdAt: -1 }
        if(sort === 'price-low') sortOption = {price: 1}
        if(sort === 'price-high') sortOption = { price: -1}
        if(sort === 'newest') sortOption = { createdAt: -1}

        const skip = (Number(page) - 1) * Number(limit)

        const products = await Product.find(filter)
           .populate('category', 'name slug')
           .sort(sortOption)
           .skip(skip)
           .limit(Number(limit))

        const total = await Product.countDocuments(filter)

        res.status(200).json({
            success: true,
            products,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / Number(limit)),
                limit: Number(limit)
            }
        })
    }catch(err){
        res.status(500).json({ success: false, message: err.message })
    }
}

// GET api/products/:id
exports.getProduct = async (req, res) =>{
    try{
        const product = await Product.findById(req.params.id).populate('category', 'name slug')

        if(!product || !product.isActive){
            return res.status(404).json({ success: false, message: 'Product not found' })
        }
        res.status(200).json({ success: true, product })
    }catch(err){
        res.status(500).json({ success: false, message: err.message })
    }
}

// GET api/products/featured
exports.getFeaturedProducts = async (req, res) =>{
    try{
        const products = await Products.find({ isActive: true, isFeatured: true })
            .populate('category', 'name slug')
            .limit(8)

        res.status(200).json({ success: true, products })
    }catch(err){
        res.status(500).json({ success: false, message: err.message })
    }
}

// POST api/products - Admin only
exports.createProduct = async (req, res) =>{
    try{
        const product = await Product.create(req.body)
        res.status(201).json({ success: true, product })
    }catch(err){
        res.status(500).json({ success: false, message: err.message })
    }
}

// PUT api/products/:id - Admin only
exports.updateProduct = async(req, res) =>{
    try{
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )
        
        if(!product){
            return res.status(404).json({ success: false, message: 'Product not found'})
        }

        res.status(200).json({ success: true, product})
    }catch(err){
        res.status(500).json({ success: false, message: err.message })
    }
}

// DELETE api/product/:id - admin 
exports.deleteProduct = async (req, res) =>{
    try{
        const product = await Product.findByIdAndUpdate(
        req.params.id,
        { isActive: false },
        { new: true }
    )

    if(!product){
        return res.status(404).json({ success: false, message: 'Product not found'})
    }

    res.status(200).json({ success: true, message: 'Productt deleted successfully'})
    }catch(err){
        res.status(500).json({ success: false, message: err.message })
    }
}