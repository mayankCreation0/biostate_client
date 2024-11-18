import { toast } from '@/hooks/use-toast'
import axios, { AxiosError } from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Add request interceptor for auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Add response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError<any>) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token')
            if (window.location.pathname !== '/login') {
                window.location.href = '/login'
            }
        }

        const message = error.response?.data?.message || 'An error occurred'
        toast({
            title: 'Error',
            description: message,
            variant: 'destructive',
        })

        return Promise.reject(error)
    }
)

export default api