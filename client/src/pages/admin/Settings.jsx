import { useState, useEffect } from 'react'
import api from '../../services/api'
import toast from 'react-hot-toast'
import { useSettings } from "../../context/settingContext";

function Settings() {
  const [form, setForm] = useState({
    accentColor: '#A8B89C',
    announcementText: 'Free Shipping Above ₹999 | COD Available | 7 Day Easy Returns',
    freeShippingAbove: 999,
    shippingCharge: 99
  })
  const [saving, setSaving] = useState(false)
  const { setSettings } = useSettings()

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings')
        setForm(res.data.settings)
      } catch (err) {
        console.log(err)
      }
    }
    fetchSettings()
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const res = await api.put('/settings', form)
      setSettings(res.data.settings)
      toast.success('Settings saved — changes applied live')
    } catch (err) {
      toast.error('Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-light tracking-[0.2em] uppercase text-stone-800 mb-8">Settings</h1>

      <div className="bg-white border border-stone-200 rounded p-6 flex flex-col gap-6">

        <div>
          <h2 className="text-xs tracking-widest uppercase text-stone-700 font-medium mb-4">Brand Accent Color</h2>
          <div className="flex items-center gap-4">
            <input type="color" name="accentColor" value={form.accentColor} onChange={handleChange}
              className="w-12 h-10 border border-stone-200 cursor-pointer rounded" />
            <div>
              <p className="text-sm text-stone-700">{form.accentColor}</p>
              <p className="text-xs text-stone-400 mt-1">Used for badges, announcement bar and accents</p>
            </div>
            <div className="w-24 h-10 rounded" style={{ backgroundColor: form.accentColor }}></div>
          </div>
        </div>

        <div>
          <h2 className="text-xs tracking-widest uppercase text-stone-700 font-medium mb-4">Announcement Bar Text</h2>
          <input type="text" name="announcementText" value={form.announcementText} onChange={handleChange}
            className="w-full border border-stone-200 px-4 py-3 text-sm outline-none focus:border-stone-400" />
          <p className="text-xs text-stone-400 mt-2">Use | to separate multiple messages</p>
        </div>

        <div>
          <h2 className="text-xs tracking-widest uppercase text-stone-700 font-medium mb-4">Store Info</h2>
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-xs tracking-widest uppercase text-stone-500 block mb-2">Free Shipping Above (₹)</label>
              <input type="number" name="freeShippingAbove" value={form.freeShippingAbove} onChange={handleChange}
                className="w-full border border-stone-200 px-4 py-3 text-sm outline-none focus:border-stone-400" />
            </div>
            <div>
              <label className="text-xs tracking-widest uppercase text-stone-500 block mb-2">Shipping Charge (₹)</label>
              <input type="number" name="shippingCharge" value={form.shippingCharge} onChange={handleChange}
                className="w-full border border-stone-200 px-4 py-3 text-sm outline-none focus:border-stone-400" />
            </div>
          </div>
        </div>

        <button onClick={handleSave} disabled={saving}
          className="self-start px-8 py-3 bg-stone-800 text-white text-xs tracking-widest uppercase hover:bg-stone-700 transition-colors disabled:opacity-50">
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  )
}

export default Settings