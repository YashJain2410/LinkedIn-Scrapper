import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const uploadCSV = async (formData) => {
  const response = await axios.post(`${API_URL}/api/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

export const processManual = async (data) => {
  const response = await api.post('/manual', data)
  return response.data
}

export const getResults = async () => {
  const response = await api.get('/results')
  return response.data
}

export default api
