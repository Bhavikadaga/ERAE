import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../../context/authContext'
import { useCart } from '../../context/cartContext'
import { useSettings } from '../../context/settingContext'
import api from '../../services/api'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [categories, setCategories] = useState([])

  const { user, logout } = useAuth()
  const { cartCount } = useCart()
  const { settings } = useSettings()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories')
        setCategories(res.data.categories || [])
      } catch (err) {
        console.log(err)
      }
    }

    fetchCategories()
  }, [])

  return (
    <>
      {/* Announcement Bar */}
      <div
        style={{ backgroundColor: settings.accentColor }}
        className="text-white text-xs py-2 tracking-widest uppercase overflow-hidden whitespace-nowrap"
      >
        <span className="inline-block animate-marquee">
          {settings.announcementText}
          &nbsp;&nbsp;|&nbsp;&nbsp;
          {settings.announcementText}
        </span>
      </div>

      {/* Main Navbar */}
      <nav className="relative bg-white border-b border-stone-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between relative">

          {/* Left — Nav Links (desktop) */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/products/new-arrivals"
              className="text-xs tracking-widest uppercase text-stone-500 hover:text-stone-800 transition-colors"
            >
              New Arrivals
            </Link>

            {/* Categories Dropdown */}
            <div className="relative group">
              <button className="text-xs tracking-widest uppercase text-stone-500 hover:text-stone-800 transition-colors flex items-center gap-1">
                Categories
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown */}
              <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-stone-200 shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                {categories.map(cat => (
                  <Link
                    key={cat._id}
                    to={`/products/category/${cat.slug}`}
                    className="block px-4 py-3 text-xs tracking-widest uppercase text-stone-500 hover:bg-stone-50 hover:text-stone-800 border-b border-stone-100 last:border-0"
                  >
                    {cat.name}
                  </Link>
                ))}

                {categories.length === 0 && (
                  <p className="px-4 py-3 text-xs text-stone-400">
                    No categories
                  </p>
                )}
              </div>
            </div>

            <Link
              to="/products/sale"
              className="text-xs tracking-widest uppercase text-red-400 hover:text-red-600 transition-colors"
            >
              Sale
            </Link>
          </div>

          {/* Center — Logo */}
          <Link
            to="/"
            className="absolute left-1/2 -translate-x-1/2 text-xl md:text-2xl tracking-[0.2em] md:tracking-[0.3em] uppercase font-light text-stone-800"
          >
            Erèa
          </Link>

          {/* Right — Icons */}
          <div className="flex items-center gap-4">
            <Link to="/search" className="hidden md:block">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 md:h-5 md:w-5 text-stone-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                />
              </svg>
            </Link>

            <Link to="/wishlist">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 md:h-5 md:w-5 text-stone-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z"
                />
              </svg>
            </Link>

            <Link to="/cart" className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 md:h-5 md:w-5 text-stone-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>

              {cartCount > 0 && (
                <span
                  className="absolute -top-2 -right-2 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: settings.accentColor,
                    fontSize: '10px'
                  }}
                >
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <Link to="/account">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 md:h-5 md:w-5 text-stone-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </Link>
            ) : (
              <Link to="/login">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 md:h-5 md:w-5 text-stone-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden mt-4 flex flex-col gap-4 px-2 pb-4 border-t border-stone-100 pt-4">
            <Link
              to="/products/new-arrivals"
              onClick={() => setMenuOpen(false)}
              className="text-xs tracking-widest uppercase text-stone-500"
            >
              New Arrivals
            </Link>

            {categories.map(cat => (
              <Link
                key={cat._id}
                to={`/products/category/${cat.slug}`}
                onClick={() => setMenuOpen(false)}
                className="text-xs tracking-widest uppercase text-stone-500"
              >
                {cat.name}
              </Link>
            ))}

            <Link
              to="/products/sale"
              onClick={() => setMenuOpen(false)}
              className="text-xs tracking-widest uppercase text-red-400"
            >
              Sale
            </Link>

            <Link
              to="/search"
              onClick={() => setMenuOpen(false)}
              className="text-xs tracking-widest uppercase text-stone-500"
            >
              Search
            </Link>

            {user && (
              <button
                onClick={() => {
                  logout()
                  setMenuOpen(false)
                }}
                className="text-xs tracking-widest uppercase text-stone-500 text-left"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </nav>
    </>
  )
}

export default Navbar