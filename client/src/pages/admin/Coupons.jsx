import { useState, useEffect } from "react";
import api from '../../services/api'
import toast from 'react-hot-toast'

const emptyForm = {
    code: '',
    discountType: 'percentage',
    discountValue: '',
    minOrderAmount: '',
    maxUses: '',
    expiresAt: ''
}

function Coupons() {
    const [coupons, setCoupons] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState(emptyForm)
    const [saving, setSaving] = useState(false)

    useEffect(() =>{
        fetchCoupons()
    }, [])

    const fetchCoupons = async() =>{
        try{
            setLoading(true)
            const res = await api.get('/coupons/admin/all')
            setCoupons(res.data.coupons || [])
        }catch(err){
            console.log(err)
        }finally{
            setLoading(false)
        }
    }

    const handleChange = (e) =>{
        setForm({ ...form, [e.target.name]: e.target.value })
    }
    
    const handleSubmit = async (e) => {
      e.preventDefault()
      try {
       setSaving(true)
       const payload = {
         ...form,
         discountValue: Number(form.discountValue),
         minOrderAmount: Number(form.minOrderAmount),
         maxUses: Number(form.maxUses)
        }
      const res = await api.post('/coupons', payload)
      toast.success('Coupon created')
      setShowForm(false)
      setForm(emptyForm)
      fetchCoupons()
      }catch (err) {
        console.log('error', err)
        toast.error(err.response?.data?.message || 'Something went wrong')
      }finally {
        setSaving(false)
      }
    }

    const handleDelete = async (id) =>{
        if(!window.confirm('Delete this coupon?')) return
        try{
            await api.delete(`/coupon/${id}`)
            toast.success('Coupon deleted')
            fetchCoupons()
        }catch(err){
            toast.error('Something went wrong')
        }
    }

    const handleToggle  = async (id, isActive) =>{
        try{
            await api.put(`/coupons/${id}`, {isActive})
            toast.success(isActive ? 'Coupon deactivated' : 'Coupon activated')
            fetchCoupons()
        }catch(err){
            toast.error('Something went wrong')
        }
    }

    return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-light tracking-[0.2em] uppercase text-stone-800">Coupons</h1>
        <button onClick={() => setShowForm(true)}
          className="px-5 py-2 bg-stone-800 text-white text-xs tracking-widest uppercase hover:bg-stone-700 transition-colors rounded">
          + Add Coupon
        </button>
      </div>

      {loading ? (
        <p className="text-xs tracking-widest uppercase text-stone-400">Loading...</p>
      ) : (
        <div className="bg-white border border-stone-200 rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-200 text-left">
                <th className="p-4 text-xs tracking-widest uppercase text-stone-400">Code</th>
                <th className="p-4 text-xs tracking-widest uppercase text-stone-400">Discount</th>
                <th className="p-4 text-xs tracking-widest uppercase text-stone-400">Min Order</th>
                <th className="p-4 text-xs tracking-widest uppercase text-stone-400">Uses</th>
                <th className="p-4 text-xs tracking-widest uppercase text-stone-400">Expires</th>
                <th className="p-4 text-xs tracking-widest uppercase text-stone-400">Status</th>
                <th className="p-4 text-xs tracking-widest uppercase text-stone-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map(coupon => (
                <tr key={coupon._id} className="border-b border-stone-100">
                  <td className="p-4 font-mono text-stone-700">{coupon.code}</td>
                  <td className="p-4 text-stone-700">
                    {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}
                  </td>
                  <td className="p-4 text-stone-500">₹{coupon.minOrderAmount}</td>
                  <td className="p-4 text-stone-500">{coupon.usedCount}/{coupon.maxUses}</td>
                  <td className="p-4 text-xs text-stone-500">
                    {coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString() : 'No expiry'}
                  </td>
                  <td className="p-4">
                    <span className={`text-xs tracking-widest uppercase px-2 py-1 rounded-full ${coupon.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {coupon.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-3">
                      <button onClick={() => handleToggle(coupon._id, coupon.isActive)}
                        className="text-xs tracking-widest uppercase text-stone-600 hover:text-stone-900">
                        {coupon.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button onClick={() => handleDelete(coupon._id)}
                        className="text-xs tracking-widest uppercase text-red-500 hover:text-red-700">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {coupons.length === 0 && (
            <p className="text-center py-10 text-xs tracking-widest uppercase text-stone-400">No coupons yet</p>
          )}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded max-w-md w-full p-8">
            <h2 className="text-lg font-light tracking-[0.2em] uppercase text-stone-800 mb-6">Add Coupon</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-xs tracking-widest uppercase text-stone-500 block mb-2">Coupon Code</label>
                <input name="code" value={form.code} onChange={handleChange} required
                  placeholder="e.g. SAVE20"
                  className="w-full border border-stone-200 px-4 py-2 text-sm outline-none focus:border-stone-400 uppercase font-mono" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs tracking-widest uppercase text-stone-500 block mb-2">Discount Type</label>
                  <select name="discountType" value={form.discountType} onChange={handleChange}
                    className="w-full border border-stone-200 px-4 py-2 text-sm outline-none focus:border-stone-400">
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs tracking-widest uppercase text-stone-500 block mb-2">
                    {form.discountType === 'percentage' ? 'Percentage (%)' : 'Amount (₹)'}
                  </label>
                  <input type="number" name="discountValue" value={form.discountValue} onChange={handleChange} required
                    className="w-full border border-stone-200 px-4 py-2 text-sm outline-none focus:border-stone-400" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs tracking-widest uppercase text-stone-500 block mb-2">Min Order (₹)</label>
                  <input type="number" name="minOrderAmount" value={form.minOrderAmount} onChange={handleChange}
                    className="w-full border border-stone-200 px-4 py-2 text-sm outline-none focus:border-stone-400" />
                </div>
                <div>
                  <label className="text-xs tracking-widest uppercase text-stone-500 block mb-2">Max Uses</label>
                  <input type="number" name="maxUses" value={form.maxUses} onChange={handleChange}
                    className="w-full border border-stone-200 px-4 py-2 text-sm outline-none focus:border-stone-400" />
                </div>
              </div>
              <div>
                <label className="text-xs tracking-widest uppercase text-stone-500 block mb-2">Expiry Date (optional)</label>
                <input type="date" name="expiresAt" value={form.expiresAt} onChange={handleChange}
                  className="w-full border border-stone-200 px-4 py-2 text-sm outline-none focus:border-stone-400" />
              </div>
              <div className="flex gap-3 mt-2">
                <button type="submit" disabled={saving}
                  className="flex-1 py-3 bg-stone-800 text-white text-xs tracking-widest uppercase hover:bg-stone-700 transition-colors disabled:opacity-50">
                  {saving ? 'Creating...' : 'Create Coupon'}
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

export default Coupons