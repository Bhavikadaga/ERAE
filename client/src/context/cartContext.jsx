import { createContext, useContext, useState, useEffect } from 'react'
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
      console.log(err)
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
      await api.delete(`/cart/${itemId}`)
      fetchCart()
    } catch (err) {
      console.log(err)
    }
  }

  const updateQuantity = async (itemId, quantity) => {
    try {
      await api.put(`/cart/${itemId}`, {quantity})
      fetchCart()
    } catch (err) {
      console.log(err)
    }
  }

  const clearCart = async () => {
    try {
      await api.delete('/cart/clear')
      setCart(null)
    } catch (err) {
      console.log(err)
    }
  }

  const cartCount = cart?.items?.length || 0

  return (
    <CartContext.Provider value={{ cart, cartCount, fetchCart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)