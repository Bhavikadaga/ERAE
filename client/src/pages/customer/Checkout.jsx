import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/cartContext'
import { useAuth } from '../../context/authContext'
import api from '../../services/api'
import toast from 'react-hot-toast'

function Checkout() {
  const { cart, clearCart } = useCart()
  const [couponCode, setCouponCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: user?.name || '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    phone: user?.phone || ''
  })
  const [paymentMethod, setPaymentMethod] = useState('cod')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }
  const handleApplyCoupon = async () => {
  if (!couponCode) return
  try {
    const res = await api.post('/coupons/apply', { code: couponCode, orderAmount: subtotal })
    setDiscount(res.data.discount)
    toast.success(`Coupon applied! ₹${res.data.discount} off`)
  }catch(err){
    toast.error(err.response?.data?.message || 'Invalid coupon')
  }
}

  const subtotal = cart?.items?.reduce((acc, item) => acc + item.price * item.quantity, 0) || 0
  const shippingCharge = subtotal >= 999 ? 0 : 99
  const total = subtotal + shippingCharge - discount

  const handlePlaceOrder = async () => {
    if (!form.street || !form.city || !form.state || !form.pincode || !form.phone) {
      toast.error('Please fill all address fields')
      return
    }
    try {
      setLoading(true)
      const res = await api.post('/orders', {
      shippingAddress: form,
      paymentMethod,
      couponCode
    })
      toast.success('Order placed successfully!')
      navigate(`/orders/${res.data.order._id}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (!cart || cart.items.length === 0) {
    navigate('/cart')
    return null
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="text-center mb-10">
        <p className="text-xs tracking-[0.3em] uppercase text-stone-400 mb-2">EREA</p>
        <h1 className="text-2xl font-light tracking-[0.2em] uppercase text-stone-800">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* Left — Address + Payment */}
        <div className="flex flex-col gap-8">

          {/* Shipping Address */}
          <div>
            <h2 className="text-xs tracking-widest uppercase text-stone-700 font-medium mb-5">Shipping Address</h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs tracking-widest uppercase text-stone-500 block mb-2">Full Name</label>
                <input name="name" value={form.name} onChange={handleChange}
                  className="w-full border border-stone-200 px-4 py-3 text-sm outline-none focus:border-stone-400 bg-white"
                  placeholder="Full Name" />
              </div>
              <div>
                <label className="text-xs tracking-widest uppercase text-stone-500 block mb-2">Street Address</label>
                <input name="street" value={form.street} onChange={handleChange}
                  className="w-full border border-stone-200 px-4 py-3 text-sm outline-none focus:border-stone-400 bg-white"
                  placeholder="House no, Street, Area" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs tracking-widest uppercase text-stone-500 block mb-2">City</label>
                  <input name="city" value={form.city} onChange={handleChange}
                    className="w-full border border-stone-200 px-4 py-3 text-sm outline-none focus:border-stone-400 bg-white"
                    placeholder="City" />
                </div>
                <div>
                  <label className="text-xs tracking-widest uppercase text-stone-500 block mb-2">State</label>
                  <input name="state" value={form.state} onChange={handleChange}
                    className="w-full border border-stone-200 px-4 py-3 text-sm outline-none focus:border-stone-400 bg-white"
                    placeholder="State" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs tracking-widest uppercase text-stone-500 block mb-2">Pincode</label>
                  <input name="pincode" value={form.pincode} onChange={handleChange}
                    className="w-full border border-stone-200 px-4 py-3 text-sm outline-none focus:border-stone-400 bg-white"
                    placeholder="Pincode" />
                </div>
                <div>
                  <label className="text-xs tracking-widest uppercase text-stone-500 block mb-2">Phone</label>
                  <input name="phone" value={form.phone} onChange={handleChange}
                    className="w-full border border-stone-200 px-4 py-3 text-sm outline-none focus:border-stone-400 bg-white"
                    placeholder="Phone" />
                </div>
              </div>
            </div>
          </div>

          {/* Coupon */}   
          <div>
            <h2 className="text-xs tracking-widest uppercase text-stone-700 font-medium mb-5">Coupon Code</h2>
            <div className="flex gap-2">
            <input
            type="text"
            value={couponCode}
            onChange={e => setCouponCode(e.target.value.toUpperCase())}
            placeholder="Enter coupon code"
            className="flex-1 border border-stone-200 px-4 py-3 text-sm outline-none focus:border-stone-400"
            />
            <button
            type="button"
            onClick={handleApplyCoupon}
            className="px-5 py-3 bg-stone-800 text-white text-xs tracking-widest uppercase hover:bg-stone-700"
            >
              Apply
            </button>
          </div>
          {discount > 0 && (
            <p className="text-xs text-green-600 mt-2">Coupon applied! You save ₹{discount}</p>
          )}
        </div>

          {/* Payment Method */}
          <div>
            <h2 className="text-xs tracking-widest uppercase text-stone-700 font-medium mb-5">Payment Method</h2>
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-3 border border-stone-200 px-4 py-3 cursor-pointer hover:border-stone-400">
                <input type="radio" name="payment" value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="accent-stone-800" />
                <div>
                  <p className="text-xs tracking-widest uppercase text-stone-700">Cash on Delivery</p>
                  <p className="text-xs text-stone-400 mt-1">Pay when your order arrives</p>
                </div>
              </label>
              <label className="flex items-center gap-3 border border-stone-200 px-4 py-3 cursor-pointer hover:border-stone-400">
                <input type="radio" name="payment" value="stripe"
                  checked={paymentMethod === 'stripe'}
                  onChange={() => setPaymentMethod('stripe')}
                  className="accent-stone-800" />
                <div>
                  <p className="text-xs tracking-widest uppercase text-stone-700">Pay Online</p>
                  <p className="text-xs text-stone-400 mt-1">Credit / Debit card via Stripe</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right — Order Summary */}
        <div>
          <div className="border border-stone-200 p-6 sticky top-6">
            <h2 className="text-xs tracking-widest uppercase text-stone-800 font-medium mb-6">Order Summary</h2>

            <div className="flex flex-col gap-4 mb-6">
              {cart.items.map(item => (
                <div key={item._id} className="flex gap-3">
                  <div className="w-14 h-18 bg-stone-100 overflow-hidden flex-shrink-0">
                    <img src={item.product.images?.[0]?.url} alt={item.product.name}
                      className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs tracking-widest uppercase text-stone-700">{item.product.name}</p>
                    <p className="text-xs text-stone-400 mt-1">Size: {item.size} · Qty: {item.quantity}</p>
                    <p className="text-xs text-stone-800 mt-1">₹{item.price * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3 text-xs text-stone-500 border-t border-stone-200 pt-4">
              <div className="flex justify-between">
                <span className="tracking-widest uppercase">Subtotal</span>
                <span className="text-stone-800">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="tracking-widest uppercase">Shipping</span>
                <span className="text-stone-800">{shippingCharge === 0 ? 'Free' : `₹${shippingCharge}`}</span>
              </div>
              <div className="border-t border-stone-200 pt-3 flex justify-between">
                <span className="tracking-widest uppercase text-stone-800 font-medium">Total</span>
                <span className="text-stone-800 font-medium">₹{total}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="w-full py-3 bg-stone-800 text-white text-xs tracking-widest uppercase hover:bg-stone-700 transition-colors mt-6 disabled:opacity-50"
            >
              {loading ? 'Placing order...' : `Place Order · ₹${total}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout