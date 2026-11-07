import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import { AppShell } from './components/AppShell'
import { ToastProvider } from './components/Toast'
import { AccessControlPage } from './pages/AccessControlPage'
import { AdminDashboardPage } from './pages/AdminDashboardPage'
import { CreateParkingLotPage } from './pages/CreateParkingLotPage'
import { CreateReservationPage } from './pages/CreateReservationPage'
import { ForbiddenPage } from './pages/ForbiddenPage'
import { HealthPage } from './pages/HealthPage'
import { HomeRedirect } from './pages/HomeRedirect'
import { LoginPage } from './pages/LoginPage'
import { MyReservationsPage } from './pages/MyReservationsPage'
import { ParkingLotDetailPage } from './pages/ParkingLotDetailPage'
import { ParkingLotsPage } from './pages/ParkingLotsPage'
import { ProfilePage } from './pages/ProfilePage'
import { RegisterPage } from './pages/RegisterPage'
import { ReservationDetailPage } from './pages/ReservationDetailPage'
import { GuestRoute, ProtectedRoute } from './routes/ProtectedRoute'

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomeRedirect />} />

            <Route element={<GuestRoute />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/registro" element={<RegisterPage />} />
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route element={<AppShell />}>
                <Route path="/perfil" element={<ProfilePage />} />
                <Route path="/salud" element={<HealthPage />} />
                <Route path="/parqueaderos" element={<ParkingLotsPage />} />
                <Route path="/parqueaderos/:id" element={<ParkingLotDetailPage />} />
                <Route path="/403" element={<ForbiddenPage />} />
              </Route>
            </Route>

            <Route element={<ProtectedRoute roles={['ESTUDIANTE', 'PROFESOR']} />}>
              <Route element={<AppShell />}>
                <Route path="/reservas" element={<MyReservationsPage />} />
                <Route path="/reservas/nueva" element={<CreateReservationPage />} />
              </Route>
            </Route>

            <Route element={<ProtectedRoute roles={['ESTUDIANTE', 'PROFESOR', 'ADMIN']} />}>
              <Route element={<AppShell />}>
                <Route path="/reservas/:id" element={<ReservationDetailPage />} />
              </Route>
            </Route>

            <Route element={<ProtectedRoute roles={['GUARDA', 'ADMIN']} />}>
              <Route element={<AppShell />}>
                <Route path="/porteria" element={<AccessControlPage />} />
                <Route path="/parqueaderos/nuevo" element={<CreateParkingLotPage />} />
              </Route>
            </Route>

            <Route element={<ProtectedRoute roles={['ADMIN']} />}>
              <Route element={<AppShell />}>
                <Route path="/admin" element={<AdminDashboardPage />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  )
}
