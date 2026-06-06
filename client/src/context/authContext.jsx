import { createContext, useContext, useState, useEffect } from "react";
import { getMe, logout as logoutService } from "../services/authService";

const AuthContext = createContext()

export function AuthProvider({ childern }){
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() =>{
        const fetchUser = async() =>{
            try{
                const res = await getMe()
                setUser(res.data.user)
            }catch(err){
                setUser(null)
            }finally{
                setLoading(false)
            }
        }
        fetchUser()
    }, [])

    const logout = async () =>{
        try{
            await logoutService()
            setUser(null)
        }catch(err){
            console.log(err)
        }
    }

    return(
        <AuthContext.Provider value={{ user, setUser, loading, logout }}>
            {!loading && childern}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)