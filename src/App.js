import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'; 
import './App.css';
import Home from './Pages/Home.jsx';
import About from './Pages/About.jsx';
import ProductPage from './Pages/ProductPage.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Blog from './Pages/Blog.jsx';
import SignUp from './Pages/SignUp.jsx';
import Login from './Pages/Login';
import { Toaster } from 'sonner';
import ProtectedRoute from './Components/GuardRoutes/ProtectedRoute.jsx';
import ProductDetail from './Pages/ProductDetail.jsx';
import Checkout from './Pages/CheckOut.jsx';
import Cart from './Pages/Cart.jsx';
import SingleBlogPage from './Pages/SingleBlogPage';
import Profile from './Pages/Profile';
import Faq from './Pages/Faq';
import { useDispatch } from 'react-redux';
import { checkAuthStatus } from './features/auth/authActions';
import { updateCartItemCount } from './features/cart/cartSlice';
import OrderCompleted from './Pages/OrderSucess.jsx';
import Chatbot from './Components/Chatbot/Chatbot.jsx';
import AdminPanel from './Pages/AdminPanel.jsx';
import AdminLogin from './Pages/AdminLogin.jsx';
import NotFound from './Pages/NotFound.jsx';
import Offer from './Pages/Offer.jsx';
import AdminRoute from './Components/GuardRoutes/AdminRoute';
import ScrollToTop from './Components/ScrollToTop';
import axios from 'axios';
import { API_URL } from './config/api';
import Career from './Pages/Career.jsx';
import PrivacyPolicy from './Pages/PrivacyPolicy.jsx';
import TermsOfService from './Pages/TermsOfService.jsx';
import RefundPolicy from './Pages/RefundPolicy.jsx';
import SocialLinks from './Components/SocialLinks.jsx';
import SpinningWheel from './Components/SpinningWheel.jsx';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check auth status and refresh token on app load
    const initializeAuth = async () => {
      try {
        await dispatch(checkAuthStatus()).unwrap();
      } catch (error) {
        console.error('Auth check failed:', error);
      }
    };

    initializeAuth();
    
    // Initial cart count fetch
    fetchCartItemCount();
    
    // Set up an interval to fetch the cart count every 30 seconds
    const interval = setInterval(() => {
      fetchCartItemCount();
    }, 30000);

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, [dispatch]);

  const fetchCartItemCount = async () => {
    try {
      const userString = localStorage.getItem('user');
      
      // Handle guest cart count
      if (!userString) {
        const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
        const count = guestCart.reduce((sum, item) => sum + item.quantity, 0);
        dispatch(updateCartItemCount(count));
        return;
      }

      // Handle logged-in user cart count
      const user = JSON.parse(userString);
      if (!user.user || !user.user.id) return;
      const response = await axios.get(`${API_URL}/cart/${user.user.id}`);
      const cartItems = response.data.cartItems || [];
      const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
      dispatch(updateCartItemCount(count));
    } catch (error) {
      console.error("Error fetching cart item count:", error);
    }
  };

  // List of routes that don't need header padding
  const noHeaderRoutes = [
    '/login','/cart', 
    '/signup',
    '/admin-login',
    '/admin',
    '/order-completed'
  ];

  // Component to handle body class based on route
  function RouteHandler() {
    const location = useLocation();
    
    useEffect(() => {
      if (noHeaderRoutes.some(route => location.pathname.startsWith(route))) {
        document.body.classList.add('no-header');
      } else {
        document.body.classList.remove('no-header');
      }
      
      return () => {
        document.body.classList.remove('no-header');
      };
    }, [location]);

    return null;
  }

  return (
    <Router>
      <RouteHandler />
      <ScrollToTop />
      <div className="App">
      <SpinningWheel />
        <Toaster position="top-center" richColors />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/product/:slug" element={<ProductDetail/>}/>
          <Route path="/singleBlogPage" element={<SingleBlogPage/>} />
          <Route path="/faq" element={<Faq/>}/>
          <Route path="/order-success" element={<OrderCompleted/>}/>
          <Route path="/offers" element={<Offer />} />
          <Route path="/career" element={<Career />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/admin/login" element={<AdminLogin/>}/>
          <Route path="*" element={<NotFound />} />
          <Route path="/policy/privacy" element={<PrivacyPolicy/>}/>
          <Route path="/policy/terms" element={<TermsOfService/>}/>
          <Route path="/policy/refund" element={<RefundPolicy/>}/>

          {/* Public routes (redirect to home if already authenticated) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
          </Route>

          {/* Admin routes */}
          <Route element={<AdminRoute />}>
            <Route path='/admin' element={<AdminPanel/>}/>
            {/* Add other admin routes here if needed */}
          </Route>
        </Routes>
        <SocialLinks/>
        <ChatbotWrapper />
      </div>
    </Router>
  );
}

const ChatbotWrapper = () => {
  const location = useLocation();
  const noChatbotRoutes = ['/login', '/signup', '/order-success', '/admin/', '/admin/login/']
  // Check if the current route is one of the specified routes or if it's a NotFound route
  const showChatbot = !noChatbotRoutes.includes(location.pathname);

  return showChatbot ? <Chatbot /> : null;
};

export default App;