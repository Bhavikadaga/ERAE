import api from './api'

export const createProduct = (data) => api.post('/products', data)
export const updateProduct = (id, data) => api.put(`/product/${id}`, data)
export const deleteProduct = (id) => api.delete(`/products/${id}`)

export const getCategories = () => api.get('/categories')