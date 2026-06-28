import { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import api from '../services/api'
import { useAuth } from './authContext'

const CartContext = createContext()

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [cart, setCart] = useState(null)

  useEffect(() => {
    if (user) fetchCart()
    else setCart(null)
  }, [user])

  const fetchCart = async () => {
    try {
      const res = await api.get('/cart')
      setCart(res.data.cart)
    } catch (err) {
      console.error(err)
    }
  }

  const addToCart = async (productId, size, quantity) => {
    try {
      const res = await api.post('/cart', { productId, size, quantity })
      setCart(res.data.cart)
      return { success: true }
    } catch (err) {
      return { success: false, message: err.response?.data?.message }
    }
  }

  const removeFromCart = async (itemId) => {
    try {
      const res = await api.delete(`/cart/${itemId}`)
      setCart(res.data.cart)
      return { success: true }
    } catch (err) {
      const message = err.response?.data?.message || 'Could not remove item from cart'
      toast.error(message)
      return { success: false, message }
    }
  }

  const updateQuantity = async (itemId, quantity) => {
    try {
      const res = await api.put(`/cart/${itemId}`, { quantity })
      setCart(res.data.cart)
      return { success: true }
    } catch (err) {
      const message = err.response?.data?.message || 'Could not update quantity'
      toast.error(message)
      return { success: false, message }
    }
  }

  const clearCart = async () => {
    try {
      await api.delete('/cart/clear')
      setCart(null)
      return { success: true }
    } catch (err) {
      const message = err.response?.data?.message || 'Could not clear cart'
      toast.error(message)
      return { success: false, message }
    }
  }

  const resetCart = () => setCart(null)

  const cartCount = cart?.items?.length || 0

  return (
    <CartContext.Provider value={{ cart, cartCount, fetchCart, addToCart, removeFromCart, updateQuantity, clearCart, resetCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
