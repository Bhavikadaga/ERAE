import api from './api'

export const createProduct = (data) => api.post('/products', data)
export const updateProduct = (id, data) => api.put(`/product/${id}`, data)
export const deleteProduct = (id) => api.delete(`/products/${id}`)

export const getCategories = () => api.get('/categories')
export const createCategory = (data) => api.put('/categories', data)
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data)
export const deleteCategory = (id) => api.delete(`/categories/${id}`)