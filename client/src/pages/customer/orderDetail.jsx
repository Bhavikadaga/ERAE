import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../../services/api'

function OrderDetail() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${id}`)
        setOrder(res.data.order)
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }
    fetchOrder()
  }, [id])

  if (loading) return (
    <div className="text-center py-20 text-xs tracking-widest uppercase text-stone-400">Loading...</div>
  )

  if (!order) return (
    <div className="text-center py-20 text-xs tracking-widest uppercase text-stone-400">Order not found</div>
  )

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    processing: 'bg-purple-100 text-purple-700',
    shipped: 'bg-indigo-100 text-indigo-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    returned: 'bg-stone-100 text-stone-700'
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="text-center mb-10">
        <p className="text-xs tracking-[0.3em] uppercase text-stone-400 mb-2">ERAÈ</p>
        <h1 className="text-2xl font-light tracking-[0.2em] uppercase text-stone-800">Order Confirmed</h1>
        <p className="text-xs text-stone-400 mt-2">Thank you for your order!</p>
      </div>

      <div className="border border-stone-200 p-6 mb-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-xs tracking-widest uppercase text-stone-500">Order ID</p>
            <p className="text-xs text-stone-800 mt-1 font-mono">{order._id}</p>
          </div>
          <span className={`text-xs tracking-widest uppercase px-3 py-1 rounded-full ${statusColors[order.orderStatus]}`}>
            {order.orderStatus}
          </span>
        </div>

        <div className="flex flex-col gap-4 mb-6">
          {order.items.map((item, i) => (
            <div key={i} className="flex gap-4 border-b border-stone-100 pb-4">
              <div className="flex-1">
                <p className="text-xs tracking-widest uppercase text-stone-700">{item.name}</p>
                <p className="text-xs text-stone-400 mt-1">Size: {item.size} · Qty: {item.quantity}</p>
              </div>
              <p className="text-xs text-stone-800">₹{item.price * item.quantity}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2 text-xs">
          <div className="flex justify-between text-stone-500">
            <span className="tracking-widest uppercase">Subtotal</span>
            <span>₹{order.subtotal}</span>
          </div>
          <div className="flex justify-between text-stone-500">
            <span className="tracking-widest uppercase">Shipping</span>
            <span>{order.shippingCharge === 0 ? 'Free' : `₹${order.shippingCharge}`}</span>
          </div>
          <div className="flex justify-between text-stone-800 font-medium border-t border-stone-200 pt-2 mt-1">
            <span className="tracking-widest uppercase">Total</span>
            <span>₹{order.total}</span>
          </div>
        </div>
      </div>

      <div className="border border-stone-200 p-6 mb-6">
        <h2 className="text-xs tracking-widest uppercase text-stone-700 font-medium mb-4">Shipping Address</h2>
        <p className="text-sm text-stone-600">{order.shippingAddress.name}</p>
        <p className="text-sm text-stone-500">{order.shippingAddress.street}</p>
        <p className="text-sm text-stone-500">{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
        <p className="text-sm text-stone-500">{order.shippingAddress.phone}</p>
      </div>

      <div className="flex gap-4">
        <Link to="/account/orders" className="flex-1 text-center py-3 border border-stone-800 text-stone-800 text-xs tracking-widest uppercase hover:bg-stone-800 hover:text-white transition-all">
          My Orders
        </Link>
        <Link to="/products/all" className="flex-1 text-center py-3 bg-stone-800 text-white text-xs tracking-widest uppercase hover:bg-stone-700 transition-all">
          Continue Shopping
        </Link>
      </div>

      {order.orderStatus === 'delivered' && (
      <div className="border border-stone-200 p-6 mt-6">
        <h2 className="text-xs tracking-widest uppercase text-stone-700 font-medium mb-4">Leave a Review</h2>
        <p className="text-xs text-stone-400 mb-4">You can review the products from your order on their product pages.</p>
        {order.items.map((item, i) => (
        <Link
        key={i}
        to={`/products/${item.product}`}
        className="block text-xs tracking-widest uppercase text-stone-600 hover:text-stone-900 underline mb-2"
        >
        Review: {item.name}
        </Link>
      ))}
    </div>
  )}
  </div>
  )
}

export default OrderDetail