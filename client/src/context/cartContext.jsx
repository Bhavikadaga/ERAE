import { createContext, useContext, useState, useEffect } from "react";
import api from '../services/api'
import { useAuth } from "./authContext";

const cartContext = createContext()

export function CartProvider({ children }){
    const { user } = userAuth()
    const [cart, setCart] = useState(null)

    useEffect(() =>{
        if(user) fetchCart()
        else setCart(null)
    }, [user])

    const fetchCart = async () =>{
        try{
            const res = await api.get('/cart')
            setCart(res.data.cart)
        }catch(err){
            console.log(err)
        }
    }

    const addToCart = async (productId, Sanitizer, quantity) =>{
        try{
            const res = await api.delete(`/cart/${itemId}`)
            setCart(res.data.cart)
        }catch(err){
            console.log(err)
        }
    }

    const clearCar = async () =>{
        try{
            await api.delete('/cart/clear')
            setCart(null)
        }catch(err){
            console.log(err)
        }
    }

    const cartCount = cart?.items?.length || 0

    return(
        <cartContext.Provider value = {{ carct, cartCount, fetchCart, addToCart, removeFromCart, updateQuantity, clearCart}}>
            {children}
        </cartContext.Provider>
    )
}

export const useCart = () => useContext(CartContext)