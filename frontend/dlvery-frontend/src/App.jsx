import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import { SnackbarProvider } from 'notistack'
import { AuthProvider } from './context/AuthContext'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import OAuthCallback from './components/auth/OAuthCallback'
import Dashboard from './components/dashboard/Dashboard'
import NotFound from './components/common/NotFound'
import Unauthorized from './components/common/Unauthorized'
import ProtectedRoute from './components/common/ProtectedRoute'
import MainLayout from './components/layout/MainLayout'
import ProductList from './components/inventory/ProductList'
import ProductForm from './components/inventory/ProductForm'
import InventoryManagement from './components/inventory/InventoryManagement'
import Profile from './components/profile/Profile'
import Reports from './components/reports/Reports'
import Deliveries from './components/delivery/Deliveries'
import DeliveryDetails from './components/delivery/DeliveryDetails'
import DeliveryAgentDashboard from './components/delivery/DeliveryAgentDashboard'
import CompletedDeliveries from './components/delivery/CompletedDeliveries'
import './App.css'

function App() {
  const theme = createTheme({
    palette: {
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#dc004e',
      },
    },
  });

  return (
    <AuthProvider>
      <Router>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <SnackbarProvider maxSnack={3}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/oauth/callback/google" element={<OAuthCallback />} />
              <Route path="/unauthorized" element={<Unauthorized />} />

              <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/reports" element={<Reports />} />
                  
                  {/* Inventory Team routes */}
                  <Route 
                    element={<ProtectedRoute allowedRoles={['INVTEAM']} />}
                  >
                    <Route path="/inventory" element={<InventoryManagement />} />
                    <Route path="/inventory/products" element={<ProductList />} />
                    <Route path="/inventory/products/add" element={<ProductForm />} />
                    <Route path="/inventory/products/edit/:id" element={<ProductForm />} />
                    <Route path="/inventory/deliveries" element={<Deliveries />} />
                    <Route path="/inventory/deliveries/:id" element={<DeliveryDetails />} />
                    <Route path="/inventory/add" element={<ProtectedRoute element={ProductForm} />} />
                    <Route path="/inventory/edit/:id" element={<ProtectedRoute element={ProductForm} />} />
                    {/* Add more inventory routes as needed */}
                  </Route>
                  
                  {/* Delivery Team routes */}
                  <Route 
                    element={<ProtectedRoute allowedRoles={['DLTEAM']} />}
                  >
                    <Route path="/delivery" element={<DeliveryAgentDashboard />} />
                    <Route path="/delivery/dashboard" element={<DeliveryAgentDashboard />} />
                    <Route path="/delivery/details/:id" element={<DeliveryDetails />} />
                    <Route path="/delivery/assignments" element={<div>Delivery Assignments</div>} />
                    <Route path="/delivery/history" element={<div>Delivery History</div>} />
                    <Route path="/deliveries" element={<ProtectedRoute element={Deliveries} />} />
                    <Route path="/deliveries/completed" element={<ProtectedRoute element={CompletedDeliveries} />} />
                    {/* Add more delivery routes as needed */}
                  </Route>
                </Route>
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </SnackbarProvider>
        </ThemeProvider>
      </Router>
    </AuthProvider>
  )
}

export default App
