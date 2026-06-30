import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getFeaturedProducts } from '../../services/productService'

function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await getFeaturedProducts()
        setProducts(res.data.products || [])
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }
    fetchFeatured()
  }, [])

  return (
    <div>
      {/* Hero Banner */}
      <div style={{ backgroundColor: '#E8E0D5' }} className="w-full h-[80vh] flex items-center justify-center flex-col gap-6 px-6 text-center">
        <p className="text-xs tracking-[0.3em] uppercase text-stone-500">New Collection</p>
        <h1 className="text-4xl md:text-6xl font-light tracking-[0.2em] uppercase text-stone-800">Everyday Wear</h1>
        <p className="text-sm tracking-[0.2em] uppercase text-stone-500">Redefined</p>
        <Link to="/products/all" className="mt-4 border border-stone-800 text-stone-800 text-xs tracking-widest uppercase px-8 py-3 hover:bg-stone-800 hover:text-white transition-all duration-300">
          Shop Now
        </Link>
      </div>

      {/* Featured Products */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <p className="text-xs tracking-[0.3em] uppercase text-stone-400 mb-2">Handpicked For You</p>
          <h2 className="text-2xl font-light tracking-[0.2em] uppercase text-stone-800">Featured</h2>
        </div>

        {loading && (
          <div className="text-center py-10 text-xs tracking-widest uppercase text-stone-400">
            Loading...
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {products.map(product => (
              <Link to={`/products/${product._id}`} key={product._id} className="group">
                <div className="relative overflow-hidden bg-stone-100 aspect-[3/4]">
                  <img
                    src={product.images[0]?.url}
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
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link to="/products/all" className="border border-stone-800 text-stone-800 text-xs tracking-widest uppercase px-8 py-3 hover:bg-stone-800 hover:text-white transition-all duration-300">
            View All
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home