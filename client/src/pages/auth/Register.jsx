import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../../services/authService'
import { useAuth } from '../../context/authContext'
import toast from 'react-hot-toast'

function Register() {
    const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' })
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
            const res = await register(form)
            setUser(res.data.user)
            toast.success('Welcome to Eraè!')
            navigate('/')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex" style={{ backgroundColor: '#F9F7F4' }}>
            <div className="hidden md:flex flex-1 flex-col items-center justify-center"
            style={{ backgroundColor: '#E8E0D5' }}>
            <p className="text-3xl font-light tracking-[0.3em] uppercase text-stone-700">Eraè</p>
            <p className="text-xs tracking-[0.2em] uppercase text-stone-500 mt-4 text-center px-12 leading-6">
            Join the Eraè family.<br />Discover everyday wear, redefined.</p>
            </div>

            <div className="flex-1 flex items-center justify-center px-8 py-12">
            <div className="w-full max-w-sm">
                <div className="md:hidden text-center mb-10">
                    <Link to="/" className="text-2xl tracking-[0.3em] uppercase font-light text-stone-800">Eraè</Link>
                </div>
            <h2 className="text-xl font-light tracking-[0.2em] uppercase text-stone-800 mb-1">Create Account</h2>
            <p className="text-xs tracking-widest text-stone-400 uppercase mb-8">Join us today</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <label className="text-xs tracking-widest uppercase text-stone-600 font-medium block mb-2">Full Name</label>
                    <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full border border-stone-300 px-4 py-3 text-sm text-stone-800 outline-none focus:border-stone-600 bg-white"
                    placeholder="Your Name"
                    />
                </div>

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
                    <label className="text-xs tracking-widest uppercase text-stone-600 font-medium block mb-2">Phone <span className="text-stone-400 normal-case tracking-normal">(optional)</span></label>
                    <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className="w-full border border-stone-300 px-4 py-3 text-sm text-stone-800 outline-none focus:border-stone-600 bg-white"
                        placeholder="9876543210"
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
                    minLength={6}
                    className="w-full border border-stone-300 px-4 py-3 text-sm text-stone-800 outline-none focus:border-stone-600 bg-white"
                    placeholder="••••••••"
                    />
                </div>

                <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-stone-800 text-white text-xs tracking-widest uppercase hover:bg-stone-700 transition-colors disabled:opacity-50 mt-2"
                >
                    {loading ? 'Creating account...' : 'Create Account'}
                </button>
            </form>

            <p className="text-xs text-stone-400 mt-6 text-center">
                Already have an account?{' '}
                <Link to="/login" className="text-stone-700 underline font-medium">Sign in</Link>
            </p>
        </div>
      </div>
    </div>
    )
}

export default Register