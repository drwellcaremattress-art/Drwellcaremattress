import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { user } = useAuth();

  // If there's no user, redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user is authenticated, render child routes
  return <Outlet />;
};

export default ProtectedRoute;
