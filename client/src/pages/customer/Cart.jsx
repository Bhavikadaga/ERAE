import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/cartContext'
import { useAuth } from '../../context/authContext'
import toast from 'react-hot-toast'

function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <p className="text-xs tracking-widest uppercase text-stone-400 mb-6">Please login to view your cart</p>
        <Link to="/login" className="border border-stone-800 text-stone-800 text-xs tracking-widest uppercase px-8 py-3 hover:bg-stone-800 hover:text-white transition-all duration-300">
          Login
        </Link>
      </div>
    )
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <p className="text-xs tracking-widest uppercase text-stone-400 mb-2">Your cart is empty</p>
        <p className="text-xs text-stone-400 mb-8">Looks like you haven't added anything yet.</p>
        <Link to="/products/all" className="border border-stone-800 text-stone-800 text-xs tracking-widest uppercase px-8 py-3 hover:bg-stone-800 hover:text-white transition-all duration-300">
          Shop Now
        </Link>
      </div>
    )
  }

  const subtotal = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const shippingCharge = subtotal >= 999 ? 0 : 99
  const total = subtotal + shippingCharge

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="text-center mb-10">
        <p className="text-xs tracking-[0.3em] uppercase text-stone-400 mb-2">EREA</p>
        <h1 className="text-2xl font-light tracking-[0.2em] uppercase text-stone-800">Your Cart</h1>
        <p className="text-xs text-stone-400 mt-2">{cart.items.length} items</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Cart Items */}
        <div className="md:col-span-2 flex flex-col gap-6">
          {cart.items.map(item => (
            <div key={item._id} className="flex gap-4 border-b border-stone-100 pb-6">
              {/* Image */}
              <Link to={`/products/${item.product._id}`}>
                <div className="w-24 h-32 bg-stone-100 overflow-hidden flex-shrink-0">
                  <img
                    src={item.product.images?.[0]?.url}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </Link>

              {/* Details */}
              <div className="flex-1">
                <p className="text-xs tracking-widest uppercase text-stone-700 font-medium">{item.product.name}</p>
                <p className="text-xs text-stone-400 mt-1">Size: {item.size}</p>
                <p className="text-sm text-stone-800 mt-2">₹{item.price}</p>

                {/* Quantity */}
                <div className="flex items-center gap-3 mt-3 border border-stone-200 w-fit">
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    className="px-3 py-1 text-stone-600 hover:bg-stone-50 text-sm"
                  >−</button>
                  <span className="text-xs text-stone-800 w-4 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    className="px-3 py-1 text-stone-600 hover:bg-stone-50 text-sm"
                  >+</button>
                </div>
              </div>

              {/* Remove */}
              <div className="flex flex-col items-end justify-between">
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="text-xs text-stone-400 hover:text-stone-700 tracking-widest uppercase"
                >
                  Remove
                </button>
                <p className="text-sm text-stone-800 font-medium">₹{item.price * item.quantity}</p>
              </div>
            </div>
          ))}

          {/* Clear Cart */}
          <button
            onClick={clearCart}
            className="text-xs tracking-widest uppercase text-stone-400 hover:text-stone-700 self-start"
          >
            Clear Cart
          </button>
        </div>

        {/* Order Summary */}
        <div className="md:col-span-1">
          <div className="border border-stone-200 p-6 sticky top-6">
            <h2 className="text-xs tracking-widest uppercase text-stone-800 font-medium mb-6">Order Summary</h2>

            <div className="flex flex-col gap-3 text-xs text-stone-500">
              <div className="flex justify-between">
                <span className="tracking-widest uppercase">Subtotal</span>
                <span className="text-stone-800">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="tracking-widest uppercase">Shipping</span>
                <span className="text-stone-800">{shippingCharge === 0 ? 'Free' : `₹${shippingCharge}`}</span>
              </div>
              {shippingCharge > 0 && (
                <p className="text-stone-400" style={{ fontSize: '10px' }}>
                  Add ₹{999 - subtotal} more for free shipping
                </p>
              )}
              <div className="border-t border-stone-200 pt-3 flex justify-between">
                <span className="tracking-widest uppercase text-stone-800 font-medium">Total</span>
                <span className="text-stone-800 font-medium">₹{total}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-3 bg-stone-800 text-white text-xs tracking-widest uppercase hover:bg-stone-700 transition-colors mt-6"
            >
              Proceed to Checkout
            </button>

            <Link
              to="/products/all"
              className="block text-center text-xs tracking-widest uppercase text-stone-400 hover:text-stone-700 mt-4"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart