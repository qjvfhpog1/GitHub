import axios from 'axios'

const request = axios.create({
  baseURL: 'https://nanyang-backend-production.up.railway.app/api',
  timeout: 10000
})

request.interceptors.request.use(config => {
  const token = localStorage.getItem('adminToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

request.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default request

export const login = (data) => request.post('/login', { ...data, role: 'admin' })
export const getWarehouses = () => request.get('/warehouses')
export const getMerchants = () => request.get('/merchants')
export const getWarehouseAdmins = () => request.get('/warehouse-admins')
export const getRegionAdmins = () => request.get('/region-admins')
export const getRegions = () => request.get('/regions')
export const getFeeConfig = () => request.get('/fee-config')
export const getStatistics = () => request.get('/statistics')
export const createMerchant = (data) => request.post('/merchants', data)
export const updateMerchant = (id, data) => request.put(`/merchants/${id}`, data)
export const createWarehouse = (data) => request.post('/warehouses', data)
export const updateWarehouse = (id, data) => request.put(`/warehouses/${id}`, data)
export const createRegion = (data) => request.post('/regions', data)
export const updateRegion = (id, data) => request.put(`/regions/${id}`, data)
export const createRegionAdmin = (data) => request.post('/region-admins', data)
export const updateRegionAdmin = (id, data) => request.put(`/region-admins/${id}`, data)
export const createWarehouseAdmin = (data) => request.post('/warehouse-admins', data)
export const updateWarehouseAdmin = (id, data) => request.put(`/warehouse-admins/${id}`, data)
export const createFeeConfig = (data) => request.post('/fee-config', data)
export const updateFeeConfig = (id, data) => request.put(`/fee-config/${id}`, data)
export const deleteMerchant = (id) => request.delete(`/merchants/${id}`)
export const deleteWarehouse = (id) => request.delete(`/warehouses/${id}`)
export const deleteRegion = (id) => request.delete(`/regions/${id}`)
export const deleteWarehouseAdmin = (id) => request.delete(`/warehouse-admins/${id}`)
export const deleteRegionAdmin = (id) => request.delete(`/region-admins/${id}`)
export const deleteFeeConfig = (id) => request.delete(`/fee-config/${id}`)
