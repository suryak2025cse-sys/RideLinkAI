import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, token } = useSelector((state) => state.auth);
  const location = useLocation();

  const isAuth = !!(user && token);

  // If not logged in, force redirect to /login
  if (!isAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If role restricted and user role does not match
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    const redirectPath = user?.role === 'Driver' ? '/driver' : '/passenger';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
}
