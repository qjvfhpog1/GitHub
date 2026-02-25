import axios from 'axios'

const request = axios.create({
  baseURL: 'http://localhost:3001/api',
  timeout: 10000
})

request.interceptors.request.use(config => {
  const token = localStorage.getItem('regionToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

request.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('regionToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default request

export const login = (data) => request.post('/login', { ...data, role: 'region_admin' })
export const getWarehouses = () => request.get('/warehouses')
export const getWarehouseAdmins = () => request.get('/warehouse-admins')
export const getRegionAdmins = () => request.get('/region-admins')
export const getStatistics = (params) => request.get('/statistics', { params })
export const getExceptions = () => request.get('/exceptions')
export const handleException = (data) => request.post('/exceptions/handle', data)
export const getRegions = () => request.get('/regions')
export const toggleWarehouseAdmin = (data) => request.post('/warehouse-admins/toggle', data)
export const createRegionAdmin = (data) => request.post('/region-admins', data)
export const updateRegionAdmin = (id, data) => request.put(`/region-admins/${id}`, data)
export const toggleRegionAdmin = (data) => request.post('/region-admins/toggle', data)
export const sendWarehouseCommand = (data) => request.post('/warehouses/command', data)
