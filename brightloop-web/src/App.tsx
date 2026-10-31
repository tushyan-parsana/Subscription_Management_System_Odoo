import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'

import MainLayout from './components/layout/MainLayout'

// Dashboard pages
import Dashboard from './pages/dashboard/Dashboard'
import Analytics from './pages/dashboard/Analytics'

// Authentication pages
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

// Management pages
import Products from './pages/management/Products'
import Plans from './pages/management/Plans'
import Customers from './pages/management/Customers'
import Subscriptions from './pages/management/Subscriptions'
import Invoices from './pages/management/Invoices'
import Payments from './pages/management/Payments'

// Settings page
import Settings from './pages/settings/Settings'

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Default route */}
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
          }
        />

        <Route
          path="/analytics"
          element={
            <MainLayout>
              <Analytics />
            </MainLayout>
          }
        />

        {/* Management */}
        <Route
          path="/products"
          element={
            <MainLayout>
              <Products />
            </MainLayout>
          }
        />

        <Route
          path="/plans"
          element={
            <MainLayout>
              <Plans />
            </MainLayout>
          }
        />

        <Route
          path="/customers"
          element={
            <MainLayout>
              <Customers />
            </MainLayout>
          }
        />

        <Route
          path="/subscriptions"
          element={
            <MainLayout>
              <Subscriptions />
            </MainLayout>
          }
        />

        <Route
          path="/invoices"
          element={
            <MainLayout>
              <Invoices />
            </MainLayout>
          }
        />

        <Route
          path="/payments"
          element={
            <MainLayout>
              <Payments />
            </MainLayout>
          }
        />

        {/* Settings */}
        <Route
          path="/settings"
          element={
            <MainLayout>
              <Settings />
            </MainLayout>
          }
        />

        {/* Unknown routes */}
        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>
    </BrowserRouter>
  )
}

export default App