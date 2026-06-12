import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/authContext'
import AdminSidebar from '../../pages/admin/AdminSidebar'

function AdminLayout() {
  const { user, loading } = useAuth()

  if (loading) return null

  if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 p-8 bg-stone-50 min-h-screen">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout