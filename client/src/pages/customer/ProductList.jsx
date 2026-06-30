import { useState, useEffect, useMemo } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { getAllProducts } from '../../services/productService'
import { useSettings } from '../../context/settingContext'

function ProductList() {
  const location = useLocation()
  const { slug } = useParams()
  const { settings } = useSettings()

  const isSale = location.pathname === '/products/sale'
  const isNewArrivals = location.pathname === '/products/new-arrivals'
  const isCategory = location.pathname.startsWith('/products/category/')

  const [products, setProducts] = useState([])
  const [sort, setSort] = useState('newest')
  const [loading, setLoading] = useState(true)
  const [pageTitle, setPageTitle] = useState('All Products')  

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const res = await getAllProducts({ limit: 100 })
        let data = res.data.products || []

        if (isSale) {
          data = data.filter(p => p.salePrice !== null && p.salePrice !== undefined && p.salePrice > 0)
          setPageTitle('Sale')
        } else if (isNewArrivals) {
          const thirtyDaysAgo = new Date()
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
          data = data.filter(p => new Date(p.createdAt) > thirtyDaysAgo)
          setPageTitle('New Arrivals')
        } else if (isCategory && slug) {
          data = data.filter(p => p.category?.slug === slug)
          setPageTitle(slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' '))
        } else {
          setPageTitle('All Products')
        }

        setProducts(data)
      } catch (err) {
        console.log(err.response?.data || err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [isSale, isNewArrivals, isCategory, slug])

  const sortedProducts = useMemo(() => {
    const effectivePrice = (p) => (p.salePrice !== null && p.salePrice !== undefined && p.salePrice > 0) ? p.salePrice : p.price
    if (sort === 'price-low') return [...products].sort((a, b) => effectivePrice(a) - effectivePrice(b))
    if (sort === 'price-high') return [...products].sort((a, b) => effectivePrice(b) - effectivePrice(a))
    return [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }, [products, sort])

  const emptyMessage = () => {
    if (isSale) return 'No items on sale right now'
    if (isNewArrivals) return 'No new arrivals yet — check back soon'
    if (isCategory) return `${pageTitle} collection coming soon — stay tuned`
    return 'No products found'
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="text-center mb-10">
        <p className="text-xs tracking-[0.3em] uppercase text-stone-400 mb-2">ERAÈ</p>
        <h1 className="text-2xl font-light tracking-[0.2em] uppercase text-stone-800">{pageTitle}</h1>
        <p className="text-xs text-stone-400 mt-2">{sortedProducts.length} products</p>
      </div>

      <div className="flex justify-end mb-6">
        <select value={sort} onChange={e => setSort(e.target.value)}
          className="text-xs tracking-widest uppercase border border-stone-200 px-4 py-2 text-stone-600 outline-none">
          <option value="newest">Newest</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
      </div>

      {loading && (
        <div className="text-center py-20 text-xs tracking-widest uppercase text-stone-400">Loading...</div>
      )}

      {!loading && sortedProducts.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {sortedProducts.map(product => (
            <Link to={`/products/${product._id}`} key={product._id} className="group">
              <div className="relative overflow-hidden bg-stone-100 aspect-[3/4]">
                <img src={product.images[0]?.url} alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                {product.badge && (
                  <span className="absolute top-3 left-3 text-xs tracking-widest uppercase px-2 py-1"
                    style={{ backgroundColor: settings?.accentColor || '#A8B89C', color: 'white' }}>
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
        <div className="text-center py-20">
          <p className="text-xs tracking-widest uppercase text-stone-400 mb-2">{emptyMessage()}</p>
          <Link to="/products/all" className="text-xs tracking-widest uppercase text-stone-600 underline mt-4 inline-block">
            Browse All Products
          </Link>
        </div>
      )}
    </div>
  )
}

export default ProductList