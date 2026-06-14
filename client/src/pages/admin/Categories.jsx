import { useState, useEffect } from 'react'
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../services/adminService'
import toast from 'react-hot-toast'

const emptyForm = { name: '', slug: '', description: '', displayOrder: 0 }

function Categories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await getCategories()
      setCategories(res.data.categories || [])
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'name') {
      setForm({ ...form, name: value, slug: value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') })
    } else {
      setForm({ ...form, [name]: value })
    }
  }

  const openCreateForm = () => {
    setForm(emptyForm)
    setEditingId(null)
    setShowForm(true)
  }

  const openEditForm = (cat) => {
    setForm({ name: cat.name, slug: cat.slug, description: cat.description || '', displayOrder: cat.displayOrder || 0 })
    setEditingId(cat._id)
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      const payload = { ...form, displayOrder: Number(form.displayOrder) }
      if (editingId) {
        await updateCategory(editingId, payload)
        toast.success('Category updated')
      } else {
        await createCategory(payload)
        toast.success('Category created')
      }
      setShowForm(false)
      fetchCategories()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return
    try {
      await deleteCategory(id)
      toast.success('Category deleted')
      fetchCategories()
    } catch (err) {
      toast.error('Something went wrong')
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-light tracking-[0.2em] uppercase text-stone-800">Categories</h1>
        <button onClick={openCreateForm} className="px-5 py-2 bg-stone-800 text-white text-xs tracking-widest uppercase hover:bg-stone-700 transition-colors rounded">
          + Add Category
        </button>
      </div>

      {loading ? (
        <p className="text-xs tracking-widest uppercase text-stone-400">Loading...</p>
      ) : (
        <div className="bg-white border border-stone-200 rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-200 text-left">
                <th className="p-4 text-xs tracking-widest uppercase text-stone-400">Name</th>
                <th className="p-4 text-xs tracking-widest uppercase text-stone-400">Slug</th>
                <th className="p-4 text-xs tracking-widest uppercase text-stone-400">Order</th>
                <th className="p-4 text-xs tracking-widest uppercase text-stone-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(cat => (
                <tr key={cat._id} className="border-b border-stone-100">
                  <td className="p-4 text-stone-700">{cat.name}</td>
                  <td className="p-4 text-stone-500 text-xs font-mono">{cat.slug}</td>
                  <td className="p-4 text-stone-500">{cat.displayOrder}</td>
                  <td className="p-4">
                    <div className="flex gap-3">
                      <button onClick={() => openEditForm(cat)} className="text-xs tracking-widest uppercase text-stone-600 hover:text-stone-900">Edit</button>
                      <button onClick={() => handleDelete(cat._id)} className="text-xs tracking-widest uppercase text-red-500 hover:text-red-700">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded max-w-md w-full p-8">
            <h2 className="text-lg font-light tracking-[0.2em] uppercase text-stone-800 mb-6">
              {editingId ? 'Edit Category' : 'Add Category'}
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-xs tracking-widest uppercase text-stone-500 block mb-2">Name</label>
                <input name="name" value={form.name} onChange={handleChange} required
                  className="w-full border border-stone-200 px-4 py-2 text-sm outline-none focus:border-stone-400" />
              </div>
              <div>
                <label className="text-xs tracking-widest uppercase text-stone-500 block mb-2">Slug</label>
                <input name="slug" value={form.slug} onChange={handleChange} required
                  className="w-full border border-stone-200 px-4 py-2 text-sm outline-none focus:border-stone-400 font-mono" />
              </div>
              <div>
                <label className="text-xs tracking-widest uppercase text-stone-500 block mb-2">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={2}
                  className="w-full border border-stone-200 px-4 py-2 text-sm outline-none focus:border-stone-400" />
              </div>
              <div>
                <label className="text-xs tracking-widest uppercase text-stone-500 block mb-2">Display Order</label>
                <input type="number" name="displayOrder" value={form.displayOrder} onChange={handleChange}
                  className="w-full border border-stone-200 px-4 py-2 text-sm outline-none focus:border-stone-400" />
              </div>
              <div className="flex gap-3 mt-2">
                <button type="submit" disabled={saving}
                  className="flex-1 py-3 bg-stone-800 text-white text-xs tracking-widest uppercase hover:bg-stone-700 transition-colors disabled:opacity-50">
                  {saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 py-3 border border-stone-300 text-stone-600 text-xs tracking-widest uppercase hover:border-stone-800 transition-colors">
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

export default Categories