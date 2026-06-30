import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import { useAuth } from '../../context/authContext'
import { useCart } from '../../context/cartContext'
import toast from 'react-hot-toast'

function Wishlist() {
  const { user } = useAuth()
  const { addToCart } = useCart()
  const [wishlist, setWishlist] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) fetchWishlist()
    else setLoading(false)
  }, [user])

  const fetchWishlist = async () => {
    try {
      const res = await api.get('/wishlist')
      setWishlist(res.data.wishlist)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async (productId) => {
    try {
      const res = await api.delete(`/wishlist/${productId}`)
      setWishlist(res.data.wishlist)
      toast.success('Removed from wishlist')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not remove from wishlist')
    }
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <p className="text-xs tracking-widest uppercase text-stone-400 mb-6">Please login to view your wishlist</p>
        <Link to="/login" className="border border-stone-800 text-stone-800 text-xs tracking-widest uppercase px-8 py-3 hover:bg-stone-800 hover:text-white transition-all duration-300">
          Login
        </Link>
      </div>
    )
  }

  if (loading) return (
    <div className="text-center py-20 text-xs tracking-widest uppercase text-stone-400">Loading...</div>
  )

  if (!wishlist || wishlist.products.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <p className="text-xs tracking-widest uppercase text-stone-400 mb-2">Your wishlist is empty</p>
        <p className="text-xs text-stone-400 mb-8">Save your favorite items here.</p>
        <Link to="/products/all" className="border border-stone-800 text-stone-800 text-xs tracking-widest uppercase px-8 py-3 hover:bg-stone-800 hover:text-white transition-all duration-300">
          Shop Now
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="text-center mb-10">
        <p className="text-xs tracking-[0.3em] uppercase text-stone-400 mb-2">ERAÈ</p>
        <h1 className="text-2xl font-light tracking-[0.2em] uppercase text-stone-800">Wishlist</h1>
        <p className="text-xs text-stone-400 mt-2">{wishlist.products.length} items</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {wishlist.products.filter(Boolean).map(product => (
          <div key={product._id} className="group relative">
            <Link to={`/products/${product._id}`}>
              <div className="relative overflow-hidden bg-stone-100 aspect-[3/4]">
                <img
                  src={product.images?.[0]?.url}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {product.badge && (
                  <span className="absolute top-3 left-3 text-xs tracking-widest uppercase px-2 py-1"
                    style={{ backgroundColor: '#A8B89C', color: 'white' }}>
                    {product.badge}
                  </span>
                )}
              </div>
              <div className="mt-3">
                <p className="text-xs tracking-widest uppercase text-stone-700">{product.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  {product.salePrice ? (
                    <>
                      <span className="text-sm text-stone-800">₹{product.salePrice}</span>
                      <span className="text-xs text-stone-400 line-through">₹{product.price}</span>
                    </>
                  ) : (
                    <span className="text-sm text-stone-800">₹{product.price}</span>
                  )}
                </div>
              </div>
            </Link>

            <button
              onClick={() => handleRemove(product._id || product)}
              className="absolute top-3 right-3 w-7 h-7 bg-white rounded-full flex items-center justify-center text-stone-500 hover:text-red-500 shadow-sm"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Wishlist