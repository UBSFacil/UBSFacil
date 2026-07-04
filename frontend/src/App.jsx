import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import Home from './pages/Home'
import Medicamentos from './pages/Medicamentos'
import Unidades from './pages/Unidades'
import Sobre from './pages/Sobre'
import Contato from './pages/Contato'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/"             element={<Home />} />
        <Route path="/medicamentos" element={<Medicamentos />} />
        <Route path="/unidades"     element={<Unidades />} />
        <Route path="/sobre"        element={<Sobre />} />
        <Route path="/contato"      element={<Contato />} />
        <Route path="/login"        element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <AnimatedRoutes />
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  )
}
