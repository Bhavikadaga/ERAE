import { Routes, Route } from 'react-router-dom'
import CustomerLayout from './components/layout/CustomerLayout'
import Home from './pages/customer/Home'
import ProductList from './pages/customer/ProductList'
import ProductDetail from './pages/customer/ProductDetail'

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
        <Route path="/login" element={<div>Login Page</div>} />
      </Route>
      <Route path="/admin" element={<div>Admin Dashboard</div>} />
    </Routes>
  )
}

export default App