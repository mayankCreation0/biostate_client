// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from '@/contexts/auth.context'
import ProtectedRoute from '@/components/ProtectedRoute'
import Layout from './components/layout/Layout'

// Pages
import Login from './Pages/Login'
import Register from './Pages/Register'
import Dashboard from './Pages/Dashboard'
// import Settings from './Pages/Settings'
// import NotFound from './Pages/NotFound'
import { ThemeProvider } from './components/ThemeProvider'
import SubstringCalculator from './Pages/SubstringCalculator'
import BinaryTreeCalculator from './Pages/BinaryTreeCalculator'
import Profile from './Pages/Profile'

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="ui-theme">
      <AuthProvider>
        <Router>
          <Routes>
            {/* Auth routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route
              element={
                <ProtectedRoute>
                  <Layout>
                    <Outlet />
                  </Layout>
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<Dashboard />} />
              <Route path="/substring" element={<SubstringCalculator />} />
              <Route path="/binary-tree" element={<BinaryTreeCalculator />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
            <Route path="*" element={<Navigate to="/login" replace />} />

            {/* Error routes */}
            {/* <Route path="/404" element={<NotFound />} /> */}
            {/* <Route path="*" element={<Navigate to="/404" replace />} /> */}
          </Routes>
          <Toaster />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}