import axios from 'axios'

const request = axios.create({
  baseURL: 'http://localhost:3001/api',
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
