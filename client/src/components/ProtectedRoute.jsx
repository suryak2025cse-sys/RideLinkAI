import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, token } = useSelector((state) => state.auth);
  const location = useLocation();

  // If not logged in, redirect to /login
  if (!token && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If role restricted and user does not match
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    // Redirect drivers to /driver and passengers to /passenger
    const redirectPath = user?.role === 'Driver' ? '/driver' : '/passenger';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
}
