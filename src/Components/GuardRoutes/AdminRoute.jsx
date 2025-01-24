import React, { useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setAdmin } from '../../features/auth/adminAuthSlice';

const AdminRoute = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, admin } = useSelector((state) => state.adminAuth);

  useEffect(() => {
    // Check localStorage on mount
    const adminData = localStorage.getItem('admin');
    const adminToken = localStorage.getItem('adminToken');

    if (adminData && adminToken) {
      try {
        const parsedAdmin = JSON.parse(adminData);
        dispatch(setAdmin({ admin: parsedAdmin, accessToken: adminToken }));
      } catch (error) {
        console.error('Error parsing admin data:', error);
        navigate('/admin/login');
      }
    }
  }, [dispatch, navigate]);

  // If authenticated and we have admin data, allow access
  if (isAuthenticated && admin) {
    console.log('Admin authenticated, allowing access');
    return <Outlet />;
  }

  // If not authenticated, redirect to login
  console.log('Admin not authenticated, redirecting to login');
  return <Navigate to="/admin/login" replace />;
};

export default AdminRoute;
