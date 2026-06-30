import { Link, useLocation } from 'react-router-dom'

function AdminSidebar() {
  const location = useLocation()

  const links = [
    { to: '/admin', label: 'Dashboard' },
    { to: '/admin/products', label: 'Products' },
    { to: '/admin/categories', label: 'Categories' },
    { to: '/admin/orders', label: 'Orders' },
    { to: '/admin/customers', label: 'Customers' },
    { to: '/admin/coupons', label: 'Coupons' },
    { to: '/admin/reviews', label: 'Reviews' },
    { to: '/admin/settings', label: 'Settings' },
  ]

  return (
    <aside className="w-56 bg-white border-r border-stone-200 h-screen sticky top-0 flex flex-col py-8 px-4">
      <Link to="/" className="text-xl tracking-[0.3em] uppercase font-light text-stone-800 px-2 mb-10">
        Eraè
      </Link>
      <p className="text-xs tracking-widest uppercase text-stone-400 px-2 mb-4">Admin Panel</p>

      <nav className="flex flex-col gap-1">
        {links.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={`text-xs tracking-widest uppercase px-3 py-2 rounded transition-colors
              ${location.pathname === link.to ? 'bg-stone-800 text-white' : 'text-stone-600 hover:bg-stone-100'}
            `}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}

export default AdminSidebar