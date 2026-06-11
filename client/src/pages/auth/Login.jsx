import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../../services/authService'
import { useAuth } from '../../context/authContext'
import toast from 'react-hot-toast'

function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { setUser } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const res = await login(form)
      setUser(res.data.user)
      toast.success('Welcome back!')
      if (res.data.user.role === 'admin' || res.data.user.role === 'superadmin') {
        navigate('/admin')
      } else {
        navigate('/')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#F9F7F4' }}>
      
      {/* Left — decorative panel (desktop only) */}
      <div className="hidden md:flex flex-1 flex-col items-center justify-center"
        style={{ backgroundColor: '#E8E0D5' }}>
        <p className="text-3xl font-light tracking-[0.3em] uppercase text-stone-700">Erèa</p>
        <p className="text-xs tracking-[0.2em] uppercase text-stone-500 mt-4 text-center px-12 leading-6">
          Everyday wear, redefined.<br />Welcome back — we missed you.
        </p>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="md:hidden text-center mb-10">
            <Link to="/" className="text-2xl tracking-[0.3em] uppercase font-light text-stone-800">Erèa</Link>
          </div>

          <h2 className="text-xl font-light tracking-[0.2em] uppercase text-stone-800 mb-1">Welcome back</h2>
          <p className="text-xs tracking-widest text-stone-400 uppercase mb-8">Sign in to continue</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="text-xs tracking-widest uppercase text-stone-600 font-medium block mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full border border-stone-300 px-4 py-3 text-sm text-stone-800 outline-none focus:border-stone-600 bg-white"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="text-xs tracking-widest uppercase text-stone-600 font-medium block mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full border border-stone-300 px-4 py-3 text-sm text-stone-800 outline-none focus:border-stone-600 bg-white"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-stone-800 text-white text-xs tracking-widest uppercase hover:bg-stone-700 transition-colors disabled:opacity-50 mt-2"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-xs text-stone-400 mt-6 text-center">
            New to Erèa?{' '}
            <Link to="/register" className="text-stone-700 underline font-medium">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login