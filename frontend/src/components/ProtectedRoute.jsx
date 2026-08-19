import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="full-page-loading">
        <LoadingSpinner message="Verifying session..." />
      </div>
    );
  }

  if (!user) {
    // Redirect to login page if user is not authenticated
    return <Navigate to="/login" replace />;
  }

  // Render children (or nested Outlet routes) if authenticated
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
