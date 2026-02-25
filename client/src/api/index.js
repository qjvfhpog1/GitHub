import axios from 'axios'
import { Toast, Notify } from 'vant'

const request = axios.create({
  baseURL: '/api',
  timeout: 10000
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    const res = response.data
    if (res.success) {
      return res
    } else {
      Toast(res.message || '请求失败')
      return Promise.reject(new Error(res.message))
    }
  },
  error => {
    if (error.response) {
      if (error.response.status === 401) {
        Toast('登录已过期，请重新登录')
        localStorage.removeItem('token')
        window.location.href = '/login'
      } else {
        Toast(error.response.data?.message || '网络错误')
      }
    } else {
      Toast('网络连接失败')
    }
    return Promise.reject(error)
  }
)

export default request

// API方法
export const login = (data) => request.post('/login', data)
export const getWarehouses = () => request.get('/warehouses')
export const getForecasts = (params) => request.get('/forecasts', { params })
export const createForecast = (data) => request.post('/forecasts', data)
export const getInventory = (params) => request.get('/inventory', { params })
export const getOrders = (params) => request.get('/orders', { params })
export const createOrder = (data) => request.post('/orders', data)
export const getRecharges = (params) => request.get('/recharges', { params })
export const createRecharge = (data) => request.post('/recharges', data)
export const getBills = (params) => request.get('/bills', { params })
export const getMessages = (params) => request.get('/messages', { params })
export const getFeeConfig = () => request.get('/fee-config')
export const getLogistics = (params) => request.get('/logistics', { params })
export const getStatistics = (params) => request.get('/statistics', { params })
