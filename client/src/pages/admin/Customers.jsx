import { useState, useEffect } from 'react'
import api from '../../services/api'
import toast from 'react-hot-toast'

function Customers() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const res = await api.get('/users/admin/all')
      setCustomers(res.data.users || [])
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleActive = async (id, isActive) => {
    try {
      await api.put(`/users/admin/${id}`, { isActive: !isActive })
      toast.success(isActive ? 'Customer banned' : 'Customer activated')
      fetchCustomers()
      setSelectedCustomer(null)
    } catch (err) {
      toast.error('Something went wrong')
    }
  }

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-light tracking-[0.2em] uppercase text-stone-800">Customers</h1>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-stone-200 px-4 py-2 text-sm outline-none text-stone-600 w-64"
        />
      </div>

      {loading ? (
        <p className="text-xs tracking-widest uppercase text-stone-400">Loading...</p>
      ) : (
        <div className="bg-white border border-stone-200 rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-200 text-left">
                <th className="p-4 text-xs tracking-widest uppercase text-stone-400">Name</th>
                <th className="p-4 text-xs tracking-widest uppercase text-stone-400">Email</th>
                <th className="p-4 text-xs tracking-widest uppercase text-stone-400">Phone</th>
                <th className="p-4 text-xs tracking-widest uppercase text-stone-400">Role</th>
                <th className="p-4 text-xs tracking-widest uppercase text-stone-400">Status</th>
                <th className="p-4 text-xs tracking-widest uppercase text-stone-400">Joined</th>
                <th className="p-4 text-xs tracking-widest uppercase text-stone-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(customer => (
                <tr key={customer._id} className="border-b border-stone-100 hover:bg-stone-50">
                  <td className="p-4 text-stone-700">{customer.name}</td>
                  <td className="p-4 text-stone-500 text-xs">{customer.email}</td>
                  <td className="p-4 text-stone-500 text-xs">{customer.phone || '-'}</td>
                  <td className="p-4">
                    <span className={`text-xs tracking-widest uppercase px-2 py-1 rounded-full ${customer.role === 'superadmin' ? 'bg-purple-100 text-purple-700' : customer.role === 'admin' ? 'bg-blue-100 text-blue-700' : 'bg-stone-100 text-stone-600'}`}>
                      {customer.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`text-xs tracking-widest uppercase px-2 py-1 rounded-full ${customer.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {customer.isActive ? 'Active' : 'Banned'}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-stone-500">{new Date(customer.createdAt).toLocaleDateString()}</td>
                  <td className="p-4">
                    <button
                      onClick={() => setSelectedCustomer(customer)}
                      className="text-xs tracking-widest uppercase text-stone-600 hover:text-stone-900"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <p className="text-center py-10 text-xs tracking-widest uppercase text-stone-400">No customers found</p>
          )}
        </div>
      )}

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded max-w-md w-full p-8">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-lg font-light tracking-[0.2em] uppercase text-stone-800">Customer Details</h2>
              <button onClick={() => setSelectedCustomer(null)} className="text-stone-400 hover:text-stone-700 text-xl">✕</button>
            </div>

            <div className="flex flex-col gap-4 mb-8">
              <div>
                <p className="text-xs tracking-widest uppercase text-stone-400 mb-1">Name</p>
                <p className="text-sm text-stone-700">{selectedCustomer.name}</p>
              </div>
              <div>
                <p className="text-xs tracking-widest uppercase text-stone-400 mb-1">Email</p>
                <p className="text-sm text-stone-700">{selectedCustomer.email}</p>
              </div>
              <div>
                <p className="text-xs tracking-widest uppercase text-stone-400 mb-1">Phone</p>
                <p className="text-sm text-stone-700">{selectedCustomer.phone || '-'}</p>
              </div>
              <div>
                <p className="text-xs tracking-widest uppercase text-stone-400 mb-1">Role</p>
                <p className="text-sm text-stone-700 capitalize">{selectedCustomer.role}</p>
              </div>
              <div>
                <p className="text-xs tracking-widest uppercase text-stone-400 mb-1">Joined</p>
                <p className="text-sm text-stone-700">{new Date(selectedCustomer.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs tracking-widest uppercase text-stone-400 mb-1">Status</p>
                <span className={`text-xs tracking-widest uppercase px-2 py-1 rounded-full ${selectedCustomer.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {selectedCustomer.isActive ? 'Active' : 'Banned'}
                </span>
              </div>
            </div>

            {selectedCustomer.role === 'customer' && (
              <button
                onClick={() => handleToggleActive(selectedCustomer._id, selectedCustomer.isActive)}
                className={`w-full py-3 text-xs tracking-widest uppercase transition-colors
                  ${selectedCustomer.isActive
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
              >
                {selectedCustomer.isActive ? 'Ban Customer' : 'Activate Customer'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Customers