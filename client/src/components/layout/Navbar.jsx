import { Link } from 'react-router-dom'
import { useState } from 'react'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      {/* Announcement Bar */}
      <div style={{ backgroundColor: '#A8B89C' }} className="text-white text-xs py-2 tracking-widest uppercase overflow-hidden whitespace-nowrap">
          <span className="inline-block animate-marquee">
            Free Shipping Above ₹999 &nbsp;&nbsp;|&nbsp;&nbsp; COD Available &nbsp;&nbsp;|&nbsp;&nbsp; 7 Day Easy Returns &nbsp;&nbsp;|&nbsp;&nbsp; Free Shipping Above ₹999 &nbsp;&nbsp;|&nbsp;&nbsp; COD Available &nbsp;&nbsp;|&nbsp;&nbsp; 7 Day Easy Returns
          </span>
      </div>

      {/* Main Navbar */}
      <nav className="relative bg-white border-b border-stone-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between relative">

          {/* Left  Hamburger (mobile) / Nav Links (desktop) */}
          <div className="flex items-center">
            <button className="md:hidden text-stone-600 mr-4" onClick={() => setMenuOpen(!menuOpen)}>
              <div className="space-y-1">
                <span className="block w-5 h-px bg-stone-600"></span>
                <span className="block w-5 h-px bg-stone-600"></span>
                <span className="block w-5 h-px bg-stone-600"></span>
              </div>
            </button>
            <div className="hidden md:flex items-center gap-8">
              <Link to="/products/new-arrivals" className="text-xs tracking-widest uppercase text-stone-500 hover:text-stone-800 transition-colors">New Arrivals</Link>
              <Link to="/products/shirts" className="text-xs tracking-widest uppercase text-stone-500 hover:text-stone-800 transition-colors">Shirts</Link>
              <Link to="/products/sale" className="text-xs tracking-widest uppercase text-red-400 hover:text-red-600 transition-colors">Sale</Link>
            </div>
          </div>

          {/* Center — Logo */}
          <Link to="/" className="text-xl md:text-2xl tracking-[0.2em] md:tracking-[0.3em] uppercase font-light text-stone-800">
          Erèa
          </Link>

          {/* Right  Icons */}
          <div className="flex items-center gap-4">
            <Link to="/search">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
            </Link>
            <Link to="/wishlist">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
              </svg>
            </Link>
            <Link to="/cart">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </Link>
            <Link to="/account">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>
          </div>

        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden mt-4 flex flex-col gap-4 px-2 pb-4 border-t border-stone-100 pt-4">
            <Link to="/products/new-arrivals" onClick={() => setMenuOpen(false)} className="text-xs tracking-widest uppercase text-stone-500">New Arrivals</Link>
            <Link to="/products/shirts" onClick={() => setMenuOpen(false)} className="text-xs tracking-widest uppercase text-stone-500">Shirts</Link>
            <Link to="/products/sale" onClick={() => setMenuOpen(false)} className="text-xs tracking-widest uppercase text-red-400">Sale</Link>
          </div>
        )}

      </nav>
    </>
  )
}

export default Navbar