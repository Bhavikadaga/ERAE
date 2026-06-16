import { Routes, Route } from 'react-router-dom'
import CustomerLayout from './components/layout/CustomerLayout'
import Home from './pages/customer/Home'
import ProductList from './pages/customer/ProductList'
import ProductDetail from './pages/customer/ProductDetail'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Cart from './pages/customer/Cart'
import Checkout from './pages/customer/Checkout'
import OrderDetail from './pages/customer/orderDetail'
import Wishlist from './pages/customer/Wishlist'
import Account from './pages/customer/Account'
import Search from './pages/customer/Search'
import AdminLayout from './components/layout/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import Products from './pages/admin/Products'
import Categories from './pages/admin/Categories'
import Orders from './pages/admin/Orders'
import Customers from './pages/admin/Customers'
import Coupons from './pages/admin/Coupons'

function App() {
  return (
    <Routes>
      <Route element={<CustomerLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/all" element={<ProductList />} />
        <Route path="/products/shirts" element={<ProductList />} />
        <Route path="/products/new-arrivals" element={<ProductList />} />
        <Route path="/products/sale" element={<ProductList/>} />
        <Route path="/products/:id" element={<ProductDetail/>} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders/:id" element={<OrderDetail />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/account" element={<Account />} />
        <Route path="/search" element={<Search />} />
        <Route path="/account/orders" element={<Account />} />
      </Route>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="categories" element={<Categories />} />
        <Route path="orders" element={<Orders />} />
        <Route path="customers" element={<Customers />} />
        <Route path="coupons" element={<Coupons />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  )
}

export default App