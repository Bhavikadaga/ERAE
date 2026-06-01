import { useState } from 'react'
import { Link } from 'react-router-dom'
import mockProducts from '../../data/mockProducts'

function ProductList() {
  const [sort, setSort] = useState('newest')

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      
      {/* Page Header */}
      <div className="text-center mb-10">
        <p className="text-xs tracking-[0.3em] uppercase text-stone-400 mb-2">EREA</p>
        <h1 className="text-2xl font-light tracking-[0.2em] uppercase text-stone-800">All Shirts</h1>
        <p className="text-xs text-stone-400 mt-2">{mockProducts.length} products</p>
      </div>

      {/* Sort Bar */}
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

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {mockProducts.map(product => (
          <Link to={`/products/${product._id}`} key={product._id} className="group">
            <div className="relative overflow-hidden bg-stone-100 aspect-[3/4]">
              <img
                src={product.image}
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
    </div>
  )
}

export default ProductList