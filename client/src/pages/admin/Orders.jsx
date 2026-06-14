import { useState, useEffect } from 'react'
import api from '../../services/api'
import toast from 'react-hot-toast'

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  returned: 'bg-stone-100 text-stone-700'
}

const statusOptions = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned']

function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [filterStatus, setFilterStatus] = useState('')
  const [updatingStatus, setUpdatingStatus] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [filterStatus])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const res = await api.get(`/orders/admin/all${filterStatus ? `?status=${filterStatus}` : ''}`)
      setOrders(res.data.orders)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (orderId, orderStatus) => {
    try {
      setUpdatingStatus(true)
      await api.put(`/orders/admin/${orderId}/status`, { orderStatus })
      toast.success('Order status updated')
      fetchOrders()
      setSelectedOrder(prev => prev ? { ...prev, orderStatus } : null)
    } catch (err) {
      toast.error('Something went wrong')
    } finally {
      setUpdatingStatus(false)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-light tracking-[0.2em] uppercase text-stone-800">Orders</h1>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="border border-stone-200 px-4 py-2 text-xs tracking-widest uppercase outline-none text-stone-600"
        >
          <option value="">All Orders</option>
          {statusOptions.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-xs tracking-widest uppercase text-stone-400">Loading...</p>
      ) : (
        <div className="bg-white border border-stone-200 rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-200 text-left">
                <th className="p-4 text-xs tracking-widest uppercase text-stone-400">Order ID</th>
                <th className="p-4 text-xs tracking-widest uppercase text-stone-400">Customer</th>
                <th className="p-4 text-xs tracking-widest uppercase text-stone-400">Date</th>
                <th className="p-4 text-xs tracking-widest uppercase text-stone-400">Total</th>
                <th className="p-4 text-xs tracking-widest uppercase text-stone-400">Payment</th>
                <th className="p-4 text-xs tracking-widest uppercase text-stone-400">Status</th>
                <th className="p-4 text-xs tracking-widest uppercase text-stone-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id} className="border-b border-stone-100 hover:bg-stone-50">
                  <td className="p-4 text-xs font-mono text-stone-600">{order._id.slice(-8)}</td>
                  <td className="p-4 text-stone-700">{order.user?.name}</td>
                  <td className="p-4 text-xs text-stone-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 text-stone-700 font-medium">₹{order.total}</td>
                  <td className="p-4 text-xs uppercase text-stone-500">{order.paymentMethod}</td>
                  <td className="p-4">
                    <span className={`text-xs tracking-widest uppercase px-2 py-1 rounded-full ${statusColors[order.orderStatus]}`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-xs tracking-widest uppercase text-stone-600 hover:text-stone-900"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {orders.length === 0 && (
            <p className="text-center py-10 text-xs tracking-widest uppercase text-stone-400">No orders found</p>
          )}
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-lg font-light tracking-[0.2em] uppercase text-stone-800">Order Details</h2>
                <p className="text-xs font-mono text-stone-400 mt-1">{selectedOrder._id}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-stone-400 hover:text-stone-700 text-xl">✕</button>
            </div>

            {/* Customer Info */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-xs tracking-widest uppercase text-stone-400 mb-2">Customer</p>
                <p className="text-sm text-stone-700">{selectedOrder.user?.name}</p>
                <p className="text-xs text-stone-500">{selectedOrder.user?.email}</p>
              </div>
              <div>
                <p className="text-xs tracking-widest uppercase text-stone-400 mb-2">Shipping Address</p>
                <p className="text-sm text-stone-700">{selectedOrder.shippingAddress.name}</p>
                <p className="text-xs text-stone-500">{selectedOrder.shippingAddress.street}</p>
                <p className="text-xs text-stone-500">{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}</p>
                <p className="text-xs text-stone-500">{selectedOrder.shippingAddress.phone}</p>
              </div>
            </div>

            {/* Items */}
            <div className="mb-6">
              <p className="text-xs tracking-widest uppercase text-stone-400 mb-3">Items</p>
              <div className="flex flex-col gap-3">
                {selectedOrder.items.map((item, i) => (
                  <div key={i} className="flex justify-between items-center border-b border-stone-100 pb-3">
                    <div>
                      <p className="text-sm text-stone-700">{item.name}</p>
                      <p className="text-xs text-stone-400">Size: {item.size} · Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm text-stone-800">₹{item.price * item.quantity}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="flex flex-col gap-2 text-xs mb-6 border-t border-stone-100 pt-4">
              <div className="flex justify-between text-stone-500">
                <span className="tracking-widest uppercase">Subtotal</span>
                <span>₹{selectedOrder.subtotal}</span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span className="tracking-widest uppercase">Shipping</span>
                <span>{selectedOrder.shippingCharge === 0 ? 'Free' : `₹${selectedOrder.shippingCharge}`}</span>
              </div>
              <div className="flex justify-between text-stone-800 font-medium">
                <span className="tracking-widest uppercase">Total</span>
                <span>₹{selectedOrder.total}</span>
              </div>
            </div>

            {/* Update Status */}
            <div>
              <p className="text-xs tracking-widest uppercase text-stone-400 mb-3">Update Status</p>
              <div className="flex gap-2 flex-wrap">
                {statusOptions.map(status => (
                  <button
                    key={status}
                    onClick={() => handleStatusUpdate(selectedOrder._id, status)}
                    disabled={updatingStatus || selectedOrder.orderStatus === status}
                    className={`text-xs tracking-widest uppercase px-3 py-2 rounded border transition-colors disabled:opacity-40
                      ${selectedOrder.orderStatus === status
                        ? 'bg-stone-800 text-white border-stone-800'
                        : 'border-stone-300 text-stone-600 hover:border-stone-800'
                      }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Orders