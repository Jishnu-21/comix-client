import api from '../../utils/api';

const validateToken = async (token) => {
  if (!token) {
    throw new Error('No token provided');
  }
  try {
    const response = await api.post('/auth/validate-token', { token });
    return response.data;
  } catch (error) {
    if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }
    throw error;
  }
};

const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return {
    user: response.data.user,
    accessToken: response.data.accessToken
  };
};

const adminLogin = async (credentials) => {
  console.log('Attempting admin login:', { email: credentials.email });
  try {
    const response = await api.post('/admin/login', credentials);
    console.log('Admin login response:', response.data);

    if (!response.data.success) {
      console.error('Admin login failed:', response.data.message);
      throw new Error(response.data.message || 'Login failed');
    }
    
    // Store admin data
    const { admin, accessToken } = response.data;
    console.log('Storing admin data:', { admin, token: accessToken });
    
    localStorage.setItem('adminToken', accessToken);
    localStorage.setItem('admin', JSON.stringify(admin));
    
    return response.data;
  } catch (error) {
    console.error('Admin login error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
};

const logout = async () => {
  await api.post('/auth/logout');
};

const adminLogout = async () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('admin');
};

const signup = async (userData) => {
  const response = await api.post('/auth/signup', userData);
  return response.data;
};

const googleLogin = async (token) => {
  const response = await api.post('/auth/google', { token });
  return response.data;
};

const verifyOtp = async (otpData) => {
  const response = await api.post('/auth/verify-otp', otpData);
  return response.data;
};

const resendOtp = async (email) => {
  const response = await api.post('/auth/resend-otp', { email });
  return response.data;
};

const refreshToken = async () => {
  const response = await api.post('/auth/refresh-token');
  return response.data;
};

const sendOtp = async (userData) => {
  const response = await api.post('/auth/send-otp', userData);
  return response.data;
};

export const authService = {
  validateToken,
  login,
  adminLogin,
  logout,
  adminLogout,
  signup,
  googleLogin,
  verifyOtp,
  resendOtp,
  refreshToken,
  sendOtp
};