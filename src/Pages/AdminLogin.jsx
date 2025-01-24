import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../features/auth/authActions';
import { setAdmin } from '../features/auth/authSlice';
import '../Assets/Css/Admin/AdminLogin.scss';
import { toast } from 'sonner';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email === '' || password === '') {
      toast.error('Please fill in all fields');
    } else {
      try {
        const resultAction = await dispatch(adminLogin({ email, password }));
        console.log('Admin login response:', resultAction); // Debug log

        if (resultAction.payload && resultAction.payload.accessToken) {
          // Login successful
          console.log('Admin token received:', resultAction.payload.accessToken); // Debug log
          dispatch(setAdmin(resultAction.payload.admin));
          localStorage.setItem('admin', JSON.stringify(resultAction.payload.admin));
          localStorage.setItem('adminToken', resultAction.payload.accessToken);
          navigate('/admin');
        } else {
          // Login failed
          console.error('No token in response:', resultAction); // Debug log
          const error = resultAction.error || resultAction.payload;
          toast.error(error?.message || 'Login failed. Please try again.');
        }
      } catch (err) {
        console.error('Login error:', err);
        toast.error('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="admin-login-container">
      <h2 className="admin-login-title">Admin Login</h2>
      <form onSubmit={handleSubmit} className="admin-login-form">
        <div className="admin-login-form-group">
          <label htmlFor="email" className="admin-login-label">Email:</label>
          <input
            type="email"
            id="email"
            className="admin-login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="admin-login-form-group">
          <label htmlFor="password" className="admin-login-label">Password:</label>
          <input
            type="password"
            id="password"
            className="admin-login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        <button type="submit" className="admin-login-button">
          Login
        </button>
      </form>
    </div>
  );
}