import { Routes, Route } from 'react-router-dom'
import CustomerLayout from './components/layout/CustomerLayout'
import Home from './pages/customer/Home'
import ProductList from './pages/customer/ProductList'
import ProductDetail from './pages/customer/ProductDetail'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

function App() {
  return (
    <Routes>
      <Route element={<CustomerLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/all" element={<ProductList />} />
        <Route path="/products/shirts" element={<ProductList />} />
        <Route path="/products/new-arrivals" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetail/>} />
        <Route path="/cart" element={<div>Cart Page</div>} />
      </Route>
      <Route path="/admin" element={<div>Admin Dashboard</div>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  )
}

export default App