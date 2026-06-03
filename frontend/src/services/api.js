import axios from 'axios'

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000' })

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('fintrack_token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

export const authAPI = {
  register:    d  => api.post('/api/auth/register', d),
  login: d => {
    
    const form = new URLSearchParams()
    form.append('username', d.email)   
    form.append('password', d.password)
    return api.post('/api/auth/login', form, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
  },
  loginGoogle: d  => api.post('/api/auth/google', d), 
  getMe:       () => api.get('/api/auth/me'),
  updateMe:    d  => api.put('/api/auth/me', d),
}
export const transactionAPI = {
  getAll: month => api.get(`/api/transactions?month=${month}`),
  create: d     => api.post('/api/transactions', d),
  update: (id,d)=> api.put(`/api/transactions/${id}`, d),
  remove: id    => api.delete(`/api/transactions/${id}`),
}
export const predictionAPI = {
  get: month => api.get(`/api/predict/${month}`),
}
export default api