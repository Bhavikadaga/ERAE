import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const SettingsContext = createContext()

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({
    accentColor: '#A8B89C',
    announcementText: 'Free Shipping Above ₹999 | COD Available | 7 Day Easy Returns',
    freeShippingAbove: 999,
    shippingCharge: 99
  })

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings')
        setSettings(res.data.settings)
      } catch (err) {
        console.log(err)
      }
    }
    fetchSettings()
  }, [])

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => useContext(SettingsContext)