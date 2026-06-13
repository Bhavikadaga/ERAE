import { useState, useEffect } from 'react'
import { getAllProducts } from '../../services/productService'
import { createProduct, updateProduct, deleteProduct, getCategories } from '../../services/adminService'
import { uploadImage } from '../../services/uploadService'
import toast from 'react-hot-toast'

const emptyForm = {
  name: '',
  description: '',
  price: '',
  salePrice: '',
  fabric: '',
  badge: '',
  category: '',
  isFeatured: false,
  sizes: [
    { label: 'XS', stock: 0 },
    { label: 'S', stock: 0 },
    { label: 'M', stock: 0 },
    { label: 'L', stock: 0 },
    { label: 'XL', stock: 0 }
  ],
  images: []
}

function Products() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await getAllProducts({ limit: 100 })
      setProducts(res.data.products || [])
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await getCategories()
      setCategories(res.data.categories || [])
    } catch (err) {
      console.log(err)
    }
  }

  const openCreateForm = () => {
    setForm(emptyForm)
    setEditingId(null)
    setShowForm(true)
  }

  const openEditForm = (product) => {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      salePrice: product.salePrice || '',
      fabric: product.fabric || '',
      badge: product.badge || '',
      category: product.category?._id || '',
      isFeatured: product.isFeatured,
      sizes: product.sizes.length ? product.sizes : emptyForm.sizes,
      images: product.images || []
    })
    setEditingId(product._id)
    setShowForm(true)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
  }

  const handleSizeChange = (index, field, value) => {
    const newSizes = [...form.sizes]
    newSizes[index][field] = field === 'stock' ? Number(value) : value
    setForm({ ...form, sizes: newSizes })
  }

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    setUploading(true)
    try {
      for (const file of files) {
        const res = await uploadImage(file)
        setForm(prev => ({ ...prev, images: [...prev.images, res.data.image] }))
      }
      toast.success('Image(s) uploaded')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index) => {
    setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (form.images.length === 0) {
      toast.error('Please upload at least one image')
      return
    }
    if (!form.category) {
      toast.error('Please select a category')
      return
    }

    const payload = {
      ...form,
      price: Number(form.price),
      salePrice: form.salePrice ? Number(form.salePrice) : null,
      badge: form.badge || null
    }

    try {
      setSaving(true)
      if (editingId) {
        await updateProduct(editingId, payload)
        toast.success('Product updated')
      } else {
        await createProduct(payload)
        toast.success('Product created')
      }
      setShowForm(false)
      fetchProducts()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return
    try {
      await deleteProduct(id)
      toast.success('Product deleted')
      fetchProducts()
    } catch (err) {
      toast.error('Something went wrong')
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-light tracking-[0.2em] uppercase text-stone-800">Products</h1>
        <button
          onClick={openCreateForm}
          className="px-5 py-2 bg-stone-800 text-white text-xs tracking-widest uppercase hover:bg-stone-700 transition-colors rounded"
        >
          + Add Product
        </button>
      </div>

      {/* Product Table */}
      {loading ? (
        <p className="text-xs tracking-widest uppercase text-stone-400">Loading...</p>
      ) : (
        <div className="bg-white border border-stone-200 rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-200 text-left">
                <th className="p-4 text-xs tracking-widest uppercase text-stone-400">Image</th>
                <th className="p-4 text-xs tracking-widest uppercase text-stone-400">Name</th>
                <th className="p-4 text-xs tracking-widest uppercase text-stone-400">Category</th>
                <th className="p-4 text-xs tracking-widest uppercase text-stone-400">Price</th>
                <th className="p-4 text-xs tracking-widest uppercase text-stone-400">Stock</th>
                <th className="p-4 text-xs tracking-widest uppercase text-stone-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => {
                const totalStock = product.sizes?.reduce((acc, s) => acc + s.stock, 0) || 0
                return (
                  <tr key={product._id} className="border-b border-stone-100">
                    <td className="p-4">
                      <img src={product.images[0]?.url} alt={product.name} className="w-12 h-16 object-cover rounded" />
                    </td>
                    <td className="p-4 text-stone-700">{product.name}</td>
                    <td className="p-4 text-stone-500 text-xs">{product.category?.name}</td>
                    <td className="p-4 text-stone-700">
                      ₹{product.salePrice || product.price}
                      {product.salePrice && <span className="text-stone-400 line-through ml-1 text-xs">₹{product.price}</span>}
                    </td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded ${totalStock === 0 ? 'bg-red-100 text-red-700' : totalStock < 10 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                        {totalStock} units
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-3">
                        <button onClick={() => openEditForm(product)} className="text-xs tracking-widest uppercase text-stone-600 hover:text-stone-900">Edit</button>
                        <button onClick={() => handleDelete(product._id)} className="text-xs tracking-widest uppercase text-red-500 hover:text-red-700">Delete</button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
            <h2 className="text-lg font-light tracking-[0.2em] uppercase text-stone-800 mb-6">
              {editingId ? 'Edit Product' : 'Add Product'}
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

              <div>
                <label className="text-xs tracking-widest uppercase text-stone-500 block mb-2">Name</label>
                <input name="name" value={form.name} onChange={handleChange} required
                  className="w-full border border-stone-200 px-4 py-2 text-sm outline-none focus:border-stone-400" />
              </div>

              <div>
                <label className="text-xs tracking-widest uppercase text-stone-500 block mb-2">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} required rows={3}
                  className="w-full border border-stone-200 px-4 py-2 text-sm outline-none focus:border-stone-400" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs tracking-widest uppercase text-stone-500 block mb-2">Price</label>
                  <input type="number" name="price" value={form.price} onChange={handleChange} required
                    className="w-full border border-stone-200 px-4 py-2 text-sm outline-none focus:border-stone-400" />
                </div>
                <div>
                  <label className="text-xs tracking-widest uppercase text-stone-500 block mb-2">Sale Price (optional)</label>
                  <input type="number" name="salePrice" value={form.salePrice} onChange={handleChange}
                    className="w-full border border-stone-200 px-4 py-2 text-sm outline-none focus:border-stone-400" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs tracking-widest uppercase text-stone-500 block mb-2">Category</label>
                  <select name="category" value={form.category} onChange={handleChange} required
                    className="w-full border border-stone-200 px-4 py-2 text-sm outline-none focus:border-stone-400">
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs tracking-widest uppercase text-stone-500 block mb-2">Badge</label>
                  <select name="badge" value={form.badge} onChange={handleChange}
                    className="w-full border border-stone-200 px-4 py-2 text-sm outline-none focus:border-stone-400">
                    <option value="">None</option>
                    <option value="New In">New In</option>
                    <option value="Best Seller">Best Seller</option>
                    <option value="Sale">Sale</option>
                    <option value="Most Wanted">Most Wanted</option>
                    <option value="Fast Mover">Fast Mover</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs tracking-widest uppercase text-stone-500 block mb-2">Fabric</label>
                <input name="fabric" value={form.fabric} onChange={handleChange}
                  className="w-full border border-stone-200 px-4 py-2 text-sm outline-none focus:border-stone-400" />
              </div>

              {/* Sizes */}
              <div>
                <label className="text-xs tracking-widest uppercase text-stone-500 block mb-2">Sizes & Stock</label>
                <div className="grid grid-cols-5 gap-2">
                  {form.sizes.map((size, i) => (
                    <div key={size.label}>
                      <p className="text-xs text-stone-500 mb-1 text-center">{size.label}</p>
                      <input
                        type="number"
                        value={size.stock}
                        onChange={(e) => handleSizeChange(i, 'stock', e.target.value)}
                        className="w-full border border-stone-200 px-2 py-2 text-sm text-center outline-none focus:border-stone-400"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Images */}
              <div>
                <label className="text-xs tracking-widest uppercase text-stone-500 block mb-2">Product Images</label>
                <div className="flex gap-3 flex-wrap mb-3">
                  {form.images.map((img, i) => (
                    <div key={i} className="relative w-20 h-24">
                      <img src={img.url} alt="" className="w-full h-full object-cover rounded" />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
                      >✕</button>
                    </div>
                  ))}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="text-xs text-stone-500"
                />
                {uploading && <p className="text-xs text-stone-400 mt-2">Uploading...</p>}
              </div>

              <label className="flex items-center gap-2">
                <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} className="accent-stone-800" />
                <span className="text-xs tracking-widest uppercase text-stone-600">Featured Product</span>
              </label>

              <div className="flex gap-3 mt-4">
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="flex-1 py-3 bg-stone-800 text-white text-xs tracking-widest uppercase hover:bg-stone-700 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingId ? 'Update Product' : 'Create Product'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-3 border border-stone-300 text-stone-600 text-xs tracking-widest uppercase hover:border-stone-800 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Products