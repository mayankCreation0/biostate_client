import api from './api'
import { AuthResponse, LoginCredentials, RegisterCredentials, User } from './api.types'

export const authService = {
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const { data } = await api.post<AuthResponse>('/api/auth/login', credentials)
        console.log("Auth response", data.data)
        return data.data
    },

    register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
        const { data } = await api.post<AuthResponse>('/api/auth/register', credentials)
        return data.data
    },

    getMe: async (): Promise<User> => {
        const { data } = await api.get<User>('/api/auth/me')
        return data
    },

    uploadProfileImage: async (image: File): Promise<User> => {
        const formData = new FormData()
        formData.append('image', image)
        const { data } = await api.post<User>('/api/auth/upload-profile-image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        return data
    },

    updateProfile: async (userData: Partial<User>): Promise<User> => {
        const { data } = await api.patch<User>('/api/auth/profile', userData)
        return data
    },

    // Add location tracking
    updateLocation: async (location: { country?: string; city?: string }): Promise<User> => {
        const { data } = await api.patch<User>('/api/auth/location', location)
        return data
    },

    // Update password
    updatePassword: async (oldPassword: string, newPassword: string): Promise<void> => {
        await api.patch('/api/auth/password', { oldPassword, newPassword })
    },

    // Request password reset
    requestPasswordReset: async (email: string): Promise<void> => {
        await api.post('/api/auth/forgot-password', { email })
    },

    // Reset password with token
    resetPassword: async (token: string, newPassword: string): Promise<void> => {
        await api.post('/api/auth/reset-password', { token, newPassword })
    }
}