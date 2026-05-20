import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import AuthLayout from './components/layout/AuthLayout';
import { OrganizerRoute, ProtectedRoute } from './components/layout/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import EventRegister from './pages/EventRegister';
import CreateEvent from './pages/CreateEvent';
import EditEvent from './pages/EditEvent';
import OrganizerEvent from './pages/OrganizerEvent';
import Settings from './pages/Settings';
import Dashboard from './pages/Dashboard';
import Activity from './pages/Activity';

import 'react-datepicker/dist/react-datepicker.css';

function HomeRedirect() {
  const { isAuthenticated } = useAuth();
  return <Navigate to={isAuthenticated ? '/dashboard' : '/'} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
      </Route>

      <Route element={<Layout />}>
        <Route index element={<Landing />} />

        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="activity"
          element={
            <ProtectedRoute>
              <Activity />
            </ProtectedRoute>
          }
        />
        <Route
          path="events"
          element={
            <ProtectedRoute>
              <Events />
            </ProtectedRoute>
          }
        />
        <Route
          path="events/:id"
          element={
            <ProtectedRoute>
              <EventDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="events/:id/register"
          element={
            <ProtectedRoute>
              <EventRegister />
            </ProtectedRoute>
          }
        />
        <Route
          path="events/new"
          element={
            <ProtectedRoute>
              <OrganizerRoute>
                <CreateEvent />
              </OrganizerRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="organizer/events/:id"
          element={
            <ProtectedRoute>
              <OrganizerRoute>
                <OrganizerEvent />
              </OrganizerRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="organizer/events/:id/edit"
          element={
            <ProtectedRoute>
              <OrganizerRoute>
                <EditEvent />
              </OrganizerRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route path="home" element={<HomeRedirect />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
