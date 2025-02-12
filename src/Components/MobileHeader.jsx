import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faSearch, faShoppingCart, faHome, faComments, faUserCircle, faGift, faSignOutAlt, faTimes, faHeart } from '@fortawesome/free-solid-svg-icons';
import '../Assets/Css/MobileHeader.scss';
import { API_URL } from '../config/api';
import { useNavigate } from 'react-router-dom';
import ChatbotModal from './Chatbot/ChatbotModal';
import axios from 'axios';
const MobileHeader = ({ cartItemCount, onMenuClick, marqueeText, onLogout }) => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [bestSellers, setBestSellers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [hotPicks, setHotPicks] = useState([
    { title: 'Hair Care', image: '/images/lip1.jpg' },
    { title: 'Oral Care', image: '/images/lip2.jpg' },
    { title: 'Skin Care', image: '/images/lip3.jpg' },
    { title: 'Body Care', image: '/images/lip4.jpg' },
  ]);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { label: 'SHOP All', path: '/shop-all' },
    { label: 'ROUTINE', path: '/routine' },
    { label: 'SHOP BY CONCERN', path: '/shop-by-concern' },
    { label: 'NEW LAUNCHES', path: '/new-launches', badge: 'NEW' },
    { label: 'GIFT KIT', path: '/gift-kit' },
    { label: 'ABOUT US', path: '/about-us' },
    { label: 'CONTACT US', path: '/contact-us' },
  ];

  // Fetch best sellers
  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const response = await fetch(`${API_URL}/products/`);
        const data = await response.json();
        if (data.success) {
          const topProducts = data.products.slice(0, 4);
          setBestSellers(topProducts);
        }
      } catch (error) {
        console.error('Error fetching best sellers:', error);
      }
    };
    fetchBestSellers();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_URL}/categories`);
        setCategories(response.data.categories || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Handle body overflow for sidebar
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
      // Add class to mobile-fixed-bottom
      const mobileFixedBottom = document.querySelector('.mobile-fixed-bottom');
      if (mobileFixedBottom) {
        mobileFixedBottom.classList.add('hidden');
      }
    } else {
      document.body.style.overflow = 'auto';
      // Remove class from mobile-fixed-bottom
      const mobileFixedBottom = document.querySelector('.mobile-fixed-bottom');
      if (mobileFixedBottom) {
        mobileFixedBottom.classList.remove('hidden');
      }
    }
  }, [isSidebarOpen]);

  // Handle body overflow and scrolling for chatbot modal
  useEffect(() => {
    if (isChatbotOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    }
  }, [isChatbotOpen]);

  // Add useEffect to handle mobile-fixed-bottom visibility when search is open
  useEffect(() => {
    const mobileFixedBottom = document.querySelector('.mobile-fixed-bottom');
    if (mobileFixedBottom) {
      if (isSearchVisible) {
        mobileFixedBottom.classList.add('hidden');
      } else {
        mobileFixedBottom.classList.remove('hidden');
      }
    }
  }, [isSearchVisible]);

  const handleSearchToggle = () => setIsSearchVisible(!isSearchVisible);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate("/product", { state: { searchTerm } });
    }
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <>
     <header className={`mobile-header ${isChatbotOpen ? 'chatbot-open' : ''}`}>
        <div className="header-top">
          <div className="marquee-container">
            <div className="marquee-item">{marqueeText}</div>
          </div>
        </div>
        
        {/* Updated Header Content */}
        <div className="header-content">
          <div className="nav-group left">
            <button className="menu-button" onClick={toggleSidebar}>
              <FontAwesomeIcon icon={faBars} />
            </button>
            <button className="search-button" onClick={handleSearchToggle}>
              <FontAwesomeIcon icon={isSearchVisible ? faTimes : faSearch} />
            </button>
          </div>
         
          <div className="nav-group center">
            <Link to="/" className="mobile-logo">
              <img src={require('../Assets/Image/comix-logo.gif')} alt="Logo" />
            </Link>
          </div>

          <div className="nav-group right"> 
            <Link to="/profile" className="profile-button">
              <FontAwesomeIcon icon={faUserCircle} />
            </Link>
            <Link to="/cart" className="cart-button">
              <FontAwesomeIcon icon={faShoppingCart} />
              {cartItemCount > 0 && <span className="cart-item-count">{cartItemCount}</span>}
            </Link>
          </div>
        </div>

      {isSearchVisible && (
      <div className="search-dropdown open">
          <div className="search-header">
            <div className="search-logo">
              <img src={require('../Assets/Image/logo/Mask group.png')} alt="Logo" />
            </div>
            <button className="close-search" onClick={handleSearchToggle}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          <div className="search-bar">
            <div className="search-input-wrapper">
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
              <input
                type="text"
                placeholder="Search for products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleSearchKeyPress}
              />
            </div>
          </div>
          
          <div className="search-content">
            <div className="section hot-picks">
              <h3>CATEGORIES</h3>
              <div className="sellers-grid">
                {hotPicks.map((item, index) => (
                  <div key={index} className="seller-item">
                    <div className="image-container">
                      <img src={item.image} alt={item.title} />
                    </div>
                    <span className='category-title'>{item.title}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="section best-sellers">
              <h3>Best Sellers ⭐</h3>
              <div className="sellers-grid">
                {bestSellers.map((item, index) => (
                  <div key={item.id} className="seller-item" onClick={() => navigate(`/product/${item.slug}`)}>
                    <div className="image-container">
                      <img src={item.image_urls[0]} alt={item.name} />
                    </div>
                    <div className="seller-info">
                      <span className="title">{item.name}</span>
                      <span className="price">₹{item.variants[0].price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <img src={require('../Assets/Image/logo/Mask group.png')} alt="Logo" className="sidebar-logo" />
          <button className="close-button" onClick={toggleSidebar}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <nav className="sidebar-nav">
        <Link to="/" className="sidebar-item" onClick={toggleSidebar}>
              HOME
            </Link>
            {categories.map((category) => (
              <Link 
                key={category._id} 
                to={`/product`} 
                className="sidebar-item" 
                onClick={toggleSidebar}
              >
                {category.name.toUpperCase()}
              </Link>
            ))}
            <Link to="/offers" className="sidebar-item" onClick={toggleSidebar}>
              OFFERS
            </Link>
            <Link to="/blog" className="sidebar-item" onClick={toggleSidebar}>
              BLOGS
            </Link>
        </nav>
      </div>
      <div className="mobile-footer">
        <Link to="/" className="footer-item">
          <FontAwesomeIcon icon={faHome} />
          Home
        </Link>
        <button className="footer-item" onClick={() => setIsChatbotOpen(true)}>
          <FontAwesomeIcon icon={faComments} />
          Chatbot
        </button>
        <Link to="/offers" className="footer-item">
          <FontAwesomeIcon icon={faGift} />
          Offers
        </Link>
        <Link to="/profile" className="footer-item">
          <FontAwesomeIcon icon={faHeart} />
          Favorites
        </Link>
      </div>
    </header>
    {isChatbotOpen && (
        <div className="chatbot-modal-overlay">
          <ChatbotModal 
            isOpen={isChatbotOpen} 
            onClose={() => setIsChatbotOpen(false)} 
          />
        </div>
      )}
    </>
  );
};

export default MobileHeader; 