import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faSearch, faShoppingCart, faHome, faComments, faUserCircle, faGift, faSignOutAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import './MobileHeader.scss'; // Create a separate SCSS file for styles
import { API_URL } from '../config/api';
import { useNavigate } from 'react-router-dom';
import ChatbotModal from './Chatbot/ChatbotModal';

const MobileHeader = ({ cartItemCount, onMenuClick, marqueeText, onLogout, categories }) => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [bestSellers, setBestSellers] = useState([]);
  const [hotPicks, setHotPicks] = useState([
    { title: 'Hair Care', image: '/images/lip1.jpg' },
    { title: 'Oral Care', image: '/images/lip2.jpg' },
    { title: 'Skin Care', image: '/images/lip3.jpg' },
    { title: 'Body Care', image: '/images/lip4.jpg' },
  ]);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const response = await fetch(`${API_URL}/products/`);
        const data = await response.json();
        if (data.success) {
          // Take only the first 3 products as best sellers
          const topProducts = data.products.slice(0, 3);
          setBestSellers(topProducts);
        } else {
          console.error('Failed to fetch best sellers:', data.message);
        }
      } catch (error) {
        console.error('Error fetching best sellers:', error);
      }
    };

    fetchBestSellers();
  }, []);

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isSidebarOpen]);

  const handleSearchToggle = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSearch = () => {
    // Add your search logic here
    if (searchTerm.trim()) {
      window.location.href = "/product";
    }
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <header className="mobile-header">
      <div className="header-top">
        <div className="marquee-container">
          <div className="marquee-item">{marqueeText}</div>
        </div>
      </div>
      <div className="header-content">
        <button className="menu-button" onClick={toggleSidebar}>
          <FontAwesomeIcon icon={faBars} />
        </button>
        <Link to="/" className="logo">
          <img src={require('../Assets/Image/logo/Mask group.png')} alt="Logo" />
        </Link>
        <button className="search-button" onClick={handleSearchToggle}>
          <FontAwesomeIcon icon={isSearchVisible ? faTimes : faSearch} />
        </button>
        <Link to="/cart" className="cart-button">
          <FontAwesomeIcon icon={faShoppingCart} />
          {cartItemCount > 0 && (
            <span className="cart-item-count">{cartItemCount}</span>
          )}
        </Link>
      </div>
      {isSearchVisible && (
        <div className="search-dropdown">
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
              <h3>Hot Picks 🔥</h3>
              <div className="picks-grid">
                {hotPicks.map((item, index) => (
                  <div key={index} className="pick-item">
                    <div className="image-container">
                      <img src={item.image} alt={item.title} />
                    </div>
                    <span>{item.title}</span>
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
        <button className="close-button" onClick={toggleSidebar}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <nav className="sidebar-nav">
          {categories.map((category) => (
            <Link to={`/category/${category.slug}`} className="sidebar-item" onClick={toggleSidebar} key={category._id}>
              <FontAwesomeIcon icon={faGift} /> {category.name}
            </Link>
          ))}
          <button className="sidebar-item" onClick={onLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} /> Logout
          </button>
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
          <FontAwesomeIcon icon={faUserCircle} />
          Profile
        </Link>
      </div>
      <ChatbotModal isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />
    </header>
  );
};

export default MobileHeader; 