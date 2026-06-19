import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../services/api'
import { useAuth } from '../../context/authContext'
import toast from 'react-hot-toast'

function Account() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [changingPassword, setChangingPassword] = useState(false)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders/my')
        setOrders(res.data.orders)
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return
    try {
      await api.put(`/orders/${orderId}/cancel`)
      toast.success('Order cancelled')
      const res = await api.get('/orders/my')
      setOrders(res.data.orders)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot cancel this order')
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (passwordForm.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters')
      return
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    try {
      setChangingPassword(true)
      await api.put('/auth/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      })
      toast.success('Password changed successfully')
      setShowPasswordForm(false)
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong')
    } finally {
      setChangingPassword(false)
    }
  }

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    processing: 'bg-purple-100 text-purple-700',
    shipped: 'bg-indigo-100 text-indigo-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    returned: 'bg-stone-100 text-stone-700'
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <p className="text-xs tracking-widest uppercase text-stone-400 mb-6">Please login to view your account</p>
        <Link to="/login" className="border border-stone-800 text-stone-800 text-xs tracking-widest uppercase px-8 py-3 hover:bg-stone-800 hover:text-white transition-all duration-300">
          Login
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="text-center mb-10">
        <p className="text-xs tracking-[0.3em] uppercase text-stone-400 mb-2">EREA</p>
        <h1 className="text-2xl font-light tracking-[0.2em] uppercase text-stone-800">My Account</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="flex flex-col gap-4">
          <div className="border border-stone-200 p-6">
            <p className="text-xs tracking-widest uppercase text-stone-400 mb-1">Name</p>
            <p className="text-sm text-stone-800 mb-4">{user.name}</p>

            <p className="text-xs tracking-widest uppercase text-stone-400 mb-1">Email</p>
            <p className="text-sm text-stone-800 mb-4">{user.email}</p>

            {(user.role === 'admin' || user.role === 'superadmin') && (
              <>
                <p className="text-xs tracking-widest uppercase text-stone-400 mb-1">Role</p>
                <p className="text-sm text-stone-800 mb-4 capitalize">{user.role}</p>
                <Link to="/admin"
                  className="block text-center py-2 bg-stone-800 text-white text-xs tracking-widest uppercase hover:bg-stone-700 transition-colors mb-4">
                  Go to Admin Panel
                </Link>
              </>
            )}

            <button
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              className="w-full py-2 border border-stone-300 text-stone-600 text-xs tracking-widest uppercase hover:border-stone-800 transition-colors mb-3"
            >
              Change Password
            </button>

            <button
              onClick={handleLogout}
              className="w-full py-2 border border-stone-300 text-stone-600 text-xs tracking-widest uppercase hover:border-stone-800 transition-colors"
            >
              Logout
            </button>
          </div>

          {showPasswordForm && (
            <div className="border border-stone-200 p-6">
              <h2 className="text-xs tracking-widest uppercase text-stone-700 font-medium mb-4">Change Password</h2>
              <form onSubmit={handlePasswordChange} className="flex flex-col gap-3">
                <div>
                  <label className="text-xs tracking-widest uppercase text-stone-500 block mb-2">Current Password</label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    required
                    className="w-full border border-stone-200 px-3 py-2 text-sm outline-none focus:border-stone-400"
                  />
                </div>
                <div>
                  <label className="text-xs tracking-widest uppercase text-stone-500 block mb-2">New Password</label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    required
                    className="w-full border border-stone-200 px-3 py-2 text-sm outline-none focus:border-stone-400"
                  />
                </div>
                <div>
                  <label className="text-xs tracking-widest uppercase text-stone-500 block mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    required
                    className="w-full border border-stone-200 px-3 py-2 text-sm outline-none focus:border-stone-400"
                  />
                </div>
                <button
                  type="submit"
                  disabled={changingPassword}
                  className="w-full py-2 bg-stone-800 text-white text-xs tracking-widest uppercase hover:bg-stone-700 disabled:opacity-50"
                >
                  {changingPassword ? 'Changing...' : 'Update Password'}
                </button>
              </form>
            </div>
          )}
        </div>

        <div className="md:col-span-2">
          <h2 className="text-xs tracking-widest uppercase text-stone-700 font-medium mb-5">Order History</h2>

          {loading && (
            <p className="text-xs tracking-widest uppercase text-stone-400">Loading...</p>
          )}

          {!loading && orders.length === 0 && (
            <div className="border border-stone-200 p-10 text-center">
              <p className="text-xs tracking-widest uppercase text-stone-400 mb-4">No orders yet</p>
              <Link to="/products/all" className="text-xs tracking-widest uppercase text-stone-700 underline">
                Start Shopping
              </Link>
            </div>
          )}

          <div className="flex flex-col gap-4">
            {orders.map(order => (
              <div key={order._id} className="border border-stone-200 p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-xs tracking-widest uppercase text-stone-500">Order ID</p>
                    <p className="text-xs text-stone-800 mt-1 font-mono">{order._id.slice(-8)}</p>
                  </div>
                  <span className={`text-xs tracking-widest uppercase px-3 py-1 rounded-full ${statusColors[order.orderStatus]}`}>
                    {order.orderStatus}
                  </span>
                </div>
                <div className="flex justify-between items-end">
                  <p className="text-xs text-stone-400">{order.items.length} items · {new Date(order.createdAt).toLocaleDateString()}</p>
                  <p className="text-sm text-stone-800 font-medium">₹{order.total}</p>
                </div>
                <div className="flex gap-3 mt-3">
                  <Link
                    to={`/orders/${order._id}`}
                    className="text-xs tracking-widest uppercase text-stone-600 underline hover:text-stone-900"
                  >
                    View Details
                  </Link>
                  {['pending', 'confirmed'].includes(order.orderStatus) && (
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      className="text-xs tracking-widest uppercase text-red-500 hover:text-red-700"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Account