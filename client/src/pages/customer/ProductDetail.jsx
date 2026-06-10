import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getProduct } from '../../services/productService'
import { useCart } from '../../context/cartContext'
import toast from 'react-hot-toast'

function ProductDetail() {
    const { id } = useParams()
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [selectedSize, setSelectedSize] = useState(null)
    const [quantity, setQuantity] = useState(1)
    const [selectedImage, setSelectedImage] = useState(0)
    const { addToCart } = useCart()

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await getProduct(id)
                setProduct(res.data.product)
            }catch (err) {
                console.log(err)
            } finally {
                setLoading(false)
            }
        }
        fetchProduct()
    }, [id])

    const handleAddToCart = async () => {
        if (!selectedSize) {
            toast.error('Please select a size')
            return
        }
        const result = await addToCart(product._id, selectedSize, quantity)
        if (result.success) {
            toast.success('Added to cart')
        } else {
            toast.error(result.message || 'Something went wrong')
        }
    }

    if (loading) return (
        <div className="text-center py-20 text-xs tracking-widest uppercase text-stone-400">
          Loading...
        </div>
    )

    if (!product) return (
        <div className="text-center py-20 text-xs tracking-widest uppercase text-stone-400">
          Product not found
        </div>
    )

    return (
        <div className="max-w-7xl mx-auto px-6 py-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

            {/* Images */}
            <div>
                <div className="aspect-[3/4] overflow-hidden bg-stone-100">
                    <img
                    src={product.images[selectedImage]?.url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    />
            </div>
            {product.images.length > 1 && (
                <div className="flex gap-2 mt-3">
                    {product.images.map((img, i) => (
                      <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`w-16 h-20 overflow-hidden border-2 ${selectedImage === i ? 'border-stone-800' : 'border-transparent'}`}
                      >
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                </div>
            )}
        </div>

        {/* Details */}
        <div className="flex flex-col gap-6">
            {product.badge && (
              <span className="text-xs tracking-widest uppercase px-2 py-1 self-start"
                style={{ backgroundColor: '#A8B89C', color: 'white' }}>
                {product.badge}
              </span>
            )}

            <div>
                <h1 className="text-2xl font-light tracking-[0.15em] uppercase text-stone-800">{product.name}</h1>
                {product.category && (
                <p className="text-xs tracking-widest uppercase text-stone-400 mt-1">{product.category.name}</p>
                )}
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              {product.salePrice ? (
                <>
                  <span className="text-xl text-stone-800">₹{product.salePrice}</span>
                  <span className="text-sm text-stone-400 line-through">₹{product.price}</span>
                  <span className="text-xs text-green-600">
                  {Math.round((product.price - product.salePrice) / product.price * 100)}% off
                  </span>
                </>
              ) : (
                <span className="text-xl text-stone-800">₹{product.price}</span>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-stone-500 leading-relaxed">{product.description}</p>

            {/* Fabric */}
            {product.fabric && (
            <p className="text-xs tracking-widest uppercase text-stone-400">
              Fabric: <span className="text-stone-600">{product.fabric}</span>
            </p>
            )}

            {/* Sizes */}
            <div>
              <p className="text-xs tracking-widest uppercase text-stone-500 mb-3">Select Size</p>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map(size => (
                  <button
                  key={size.label}
                  onClick={() => size.stock > 0 && setSelectedSize(size.label)}
                  className={`w-12 h-12 border text-xs tracking-widest uppercase transition-all
                    ${selectedSize === size.label ? 'border-stone-800 bg-stone-800 text-white' : 'border-stone-300 text-stone-600'}
                    ${size.stock === 0 ? 'opacity-30 cursor-not-allowed line-through' : 'hover:border-stone-800 cursor-pointer'}
                  `}
                  >
                  {size.label}
                  </button>
                ))}
              </div>
            </div>

          {/* Quantity */}
          <div>
            <p className="text-xs tracking-widest uppercase text-stone-500 mb-3">Quantity</p>
            <div className="flex items-center gap-4 border border-stone-200 w-fit">
              <button
                onClick={() => quantity > 1 && setQuantity(q => q - 1)}
                className="px-4 py-2 text-stone-600 hover:bg-stone-50"
              >−</button>
              <span className="text-sm text-stone-800 w-6 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(q => q + 1)}
                className="px-4 py-2 text-stone-600 hover:bg-stone-50"
              >+</button>
            </div>
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            className="w-full py-4 bg-stone-800 text-white text-xs tracking-widest uppercase hover:bg-stone-700 transition-colors"
          >
            Add to Cart
          </button>

          {/* Wishlist */}
          <button className="w-full py-4 border border-stone-300 text-stone-600 text-xs tracking-widest uppercase hover:border-stone-800 transition-colors">
            Add to Wishlist
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail