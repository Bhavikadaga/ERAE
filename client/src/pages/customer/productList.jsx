import { useState, useEffect, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { getAllProducts } from '../../services/productService'

function ProductList() {
  const location = useLocation()
  const isSale = location.pathname === '/products/sale'

  const [products, setProducts] = useState([])
  const [sort, setSort] = useState('newest')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const res = await getAllProducts()
        let data = res.data.products || []
        if (isSale) {
          data = data.filter(p => p.salePrice !== null && p.salePrice !== undefined && p.salePrice > 0)
        }
        setProducts(data)
      } catch (err) {
        console.log(err.response?.data || err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [isSale])

  const sortedProducts = useMemo(() => {
    const effectivePrice = (p) => (p.salePrice !== null && p.salePrice !== undefined && p.salePrice > 0) ? p.salePrice : p.price
    if (sort === 'price-low') return [...products].sort((a, b) => effectivePrice(a) - effectivePrice(b))
    if (sort === 'price-high') return [...products].sort((a, b) => effectivePrice(b) - effectivePrice(a))
    return products
  }, [products, sort])

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      <div className="text-center mb-10">
        <p className="text-xs tracking-[0.3em] uppercase text-stone-400 mb-2">EREA</p>
        <h1 className="text-2xl font-light tracking-[0.2em] uppercase text-stone-800">
          {isSale ? 'Sale' : 'All Shirts'}
        </h1>
        <p className="text-xs text-stone-400 mt-2">{sortedProducts.length} products</p>
      </div>

      <div className="flex justify-end mb-6">
        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          className="text-xs tracking-widest uppercase border border-stone-200 px-4 py-2 text-stone-600 outline-none"
        >
          <option value="newest">Newest</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
      </div>

      {loading && (
        <div className="text-center py-20 text-xs tracking-widest uppercase text-stone-400">
          Loading...
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {sortedProducts.map(product => (
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

      {!loading && sortedProducts.length === 0 && (
        <div className="text-center py-20 text-xs tracking-widest uppercase text-stone-400">
          {isSale ? 'No items on sale right now' : 'No products found'}
        </div>
      )}
    </div>
  )
}

export default ProductList