import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getAllProducts } from '../../services/productService'

function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  useEffect(() => {
    const q = searchParams.get('q')
    if (q) {
      setQuery(q)
      runSearch(q)
    }
  }, [])

  const runSearch = async (q) => {
    if (!q.trim()) return
    try {
      setLoading(true)
      setSearched(true)
      const res = await getAllProducts({ search: q })
      setProducts(res.data.products || [])
    } catch (err) {
      console.log(err)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSearchParams({ q: query })
    runSearch(query)
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      <div className="text-center mb-10">
        <h1 className="text-2xl font-light tracking-[0.2em] uppercase text-stone-800">Search</h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-xl mx-auto mb-10">
        <div className="flex border border-stone-300">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search for shirts, fabrics, styles..."
            className="flex-1 px-4 py-3 text-sm outline-none bg-white text-stone-800"
          />
          <button type="submit" className="px-6 bg-stone-800 text-white text-xs tracking-widest uppercase hover:bg-stone-700 transition-colors">
            Search
          </button>
        </div>
      </form>

      {loading && (
        <div className="text-center py-10 text-xs tracking-widest uppercase text-stone-400">Searching...</div>
      )}

      {!loading && searched && products.length === 0 && (
        <div className="text-center py-10 text-xs tracking-widest uppercase text-stone-400">
          No products found for "{query}"
        </div>
      )}

      {!loading && products.length > 0 && (
        <>
          <p className="text-xs text-stone-400 mb-6 text-center">{products.length} results for "{query}"</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
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
        </>
      )}
    </div>
  )
}

export default Search