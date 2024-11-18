import React, { createContext, useContext, useEffect, useState } from 'react'
import { authService } from '@/services/auth.service'
import { RegisterCredentials, User } from '@/services/api.types';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (credentials: RegisterCredentials) => Promise<void>;
    logout: () => void;
    uploadProfileImage: (image: File) => Promise<void>;
    updateProfile: (data: Partial<User>) => Promise<void>;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const { toast } = useToast()

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('token')
            if (token) {
                try {
                    const userData = await authService.getMe()
                    setUser(userData)
                } catch (error) {
                    localStorage.removeItem('token')
                    toast({
                        title: "Session expired",
                        description: "Please login again",
                        variant: "destructive"
                    })
                }
            }
            setLoading(false)
        }

        initAuth()
    }, [])

    const login = async (email: string, password: string) => {
        try {
            const { user, token } = await authService.login({ email, password })
            localStorage.setItem('token', token)
            setUser(user)
            toast({
                title: "Welcome back!",
                description: `Good to see you again, ${user.firstName}!`,
            })
        } catch (error: any) {
            toast({
                title: "Login failed",
                description: error.response?.data?.message || "Please check your credentials",
                variant: "destructive"
            })
            throw error
        }
    }

    const register = async (credentials: RegisterCredentials) => {
        try {
            const { user, token } = await authService.register(credentials)
            localStorage.setItem('token', token)
            setUser(user)
            toast({
                title: "Welcome!",
                description: `Your account has been created successfully, ${user.firstName}!`,
            })
        } catch (error: any) {
            toast({
                title: "Registration failed",
                description: error.response?.data?.message || "Please try again",
                variant: "destructive"
            })
            throw error
        }
    }

    const uploadProfileImage = async (image: File) => {
        try {
            const updatedUser = await authService.uploadProfileImage(image)
            setUser(updatedUser)
            toast({
                title: "Success",
                description: "Profile image updated successfully",
            })
        } catch (error: any) {
            toast({
                title: "Upload failed",
                description: error.response?.data?.message || "Failed to update profile image",
                variant: "destructive"
            })
            throw error
        }
    }

    const updateProfile = async (data: Partial<User>) => {
        try {
            const updatedUser = await authService.updateProfile(data)
            setUser(updatedUser)
            toast({
                title: "Success",
                description: "Profile updated successfully",
            })
        } catch (error: any) {
            toast({
                title: "Update failed",
                description: error.response?.data?.message || "Failed to update profile",
                variant: "destructive"
            })
            throw error
        }
    }

    const logout = () => {
        localStorage.removeItem('token')
        setUser(null)
        window.location.href = '/login'
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                register,
                logout,
                uploadProfileImage,
                updateProfile,
                isAuthenticated: !!user
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}