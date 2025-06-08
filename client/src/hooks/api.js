import axios from 'axios'

// Configuration de base d'axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
})

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Erreur API:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export { api }