import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import '../Assets/Css/Header.scss';
import SocialIcon from '../Components/SocialIcon.jsx';
import '@fortawesome/fontawesome-free/css/all.min.css';
import HeaderLogo from '../Assets/Image/comix-logo.gif';
import { checkAuthStatus, logout } from '../features/auth/authActions';
import { fetchUserDetails, setUserDetails } from '../features/user/userSlice.js';
import { API_URL } from "../config/api";
import { updateCartItemCount } from '../features/cart/cartSlice';
import { 
  faHeart, 
  faShoppingCart, 
  faUserCircle,  
  faBars, 
  faTimes,
  faFire,
  faMedal,
  faHome,
  faGift,
  faComments
} from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import Chatbot from '../Components/Chatbot/Chatbot.jsx';

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profilePicture, setProfilePicture] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isSearchHovered, setIsSearchHovered] = useState(false);
  const [headerSearchTerm, setHeaderSearchTerm] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);
  const lastScrollY = useRef(0);
  const scrollThreshold = 50; // Threshold for header behavior
  const cartItemCount = useSelector((state) => state.cart.itemCount);
  const dispatch = useDispatch();
  const { user: authUser, isAuthenticated } = useSelector((state) => state.auth);
  const { user: userDetails, loading: userLoading } = useSelector((state) => state.user);
  const dropdownRef = useRef(null);
  const dropdownTimeout = useRef(null);
  const searchRef = useRef(null);
  const [recentSearches, setRecentSearches] = useState([]);
  const [recentSearchesLoading, setRecentSearchesLoading] = useState(true);
  const [currentMarqueeIndex, setCurrentMarqueeIndex] = useState(0);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const marqueeItems = [
    "🎉 Welcome to Comix - Your Beauty Destination!",
    "✨ Free Shipping on Orders Over ₹499",
    "🎁 Get 10% Off on Your First Order"
  ];

  const navigate = useNavigate();

  // Sample data for search dropdown
  const hotPicks = [
    { title: 'Lip Gloss', image: './images/lip1.jpg' },
    { title: 'Foundation', image: './images/lip2.jpg' },
    { title: 'Compact', image: './images/lip3.jpg' },
    { title: 'Palette', image: './images/lip4.jpg' },
    { title: 'Gifting', image: './images/lip5.jpg' }
  ];

  const bestSellers = [
    {
      title: 'Ace Of Face Foundation Stick',
      image: './images/blog1.jpg',
      price: '₹999'
    },
    {
      title: 'Ace Of Face Foundation Stick',
      image: './images/blog2.jpg',
      price: '₹999'
    },
    {
      title: 'Ace Of Face Foundation Stick',
      image: './images/blog3.jpg',
      price: '₹999'
    }
  ];

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setHeaderSearchTerm(value);
  };

  const handleSearchFocus = () => {
    // Only show dropdown on desktop
    if (window.innerWidth >= 768) {
      setShowSearchDropdown(true);
    }
  };

  const handleSearchBlur = () => {
    // Add a small delay before hiding dropdown to allow for clicking items
    setTimeout(() => {
      setShowSearchDropdown(false);
    }, 200);
  };

  const handleHeaderSearch = (e) => {
    e.preventDefault();
    if (headerSearchTerm.trim()) {
      const updatedSearches = [
        headerSearchTerm,
        ...recentSearches.filter(term => term !== headerSearchTerm)
      ].slice(0, 5); // Keep only last 5 searches
      localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
      setRecentSearches(updatedSearches);
      
      setIsSearchHovered(false);
      setHeaderSearchTerm(''); // Clear search input
      navigate('/product', { state: { searchTerm: headerSearchTerm } });
    }
  };

  const handleSearchTermClick = (term) => {
    setHeaderSearchTerm(''); // Clear search input
    setIsSearchHovered(false); // Hide dropdown
    navigate('/product', { state: { searchTerm: term } });
  };

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      await dispatch(checkAuthStatus());
      setIsLoading(false);
    };
    checkAuth();
  }, [dispatch]);

  useEffect(() => {
    const loadUserDetails = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser.profile_picture) {
            setProfilePicture(parsedUser.profile_picture);
          }
          
          // Set user details in Redux if not already set
          if (!userDetails) {
            dispatch(setUserDetails(parsedUser));
          }

          // Get the user ID from the stored user data
          const userId = parsedUser.id || (parsedUser.user && parsedUser.user.id);
          if (userId) {
            await dispatch(fetchUserDetails(userId));
          }
        }
      } catch (error) {
        console.error('Error loading user details:', error);
      }
    };

    if (isAuthenticated) {
      loadUserDetails();
    }
  }, [dispatch, isAuthenticated, userDetails]);

  useEffect(() => {
    if (userDetails && userDetails.profile_picture) {
      setProfilePicture(userDetails.profile_picture);
    }
  }, [userDetails]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchCartItemCount = async () => {
    try {
      const userString = localStorage.getItem('user');
      if (!userString) return;
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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    document.body.classList.toggle('sidebar-open');
  };

  useEffect(() => {
    return () => {
      // Cleanup: remove sidebar-open class when component unmounts
      document.body.classList.remove('sidebar-open');
    };
  }, []);

  const handleCartClick = () => {
    navigate('/cart');
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('user');
    setProfilePicture(null);
    setIsDropdownOpen(false);
    setTimeout(() => {
      navigate('/');
    }, 100);
  };

  const handleMouseEnter = (index) => {
    if (dropdownTimeout.current) {
      clearTimeout(dropdownTimeout.current);
    }
    setActiveDropdown(index);
  };

  const handleMouseLeaveLips = () => {
    dropdownTimeout.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 100);
  };

  const handleMouseLeaveDropdown = () => {
    if (dropdownTimeout.current) {
      clearTimeout(dropdownTimeout.current);
    }
    setActiveDropdown(null);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsHeaderScrolled(currentScrollY > scrollThreshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.body.classList.remove('header-scrolled');
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMarqueeIndex((prevIndex) => 
        prevIndex === marqueeItems.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const navLinks = [
    { 
      name: 'SKINCARE', 
      link: '/skincare',
      dropdown: [
        {
          title: 'LIPSTICKS',
          items: [
            'TRANSFER PROOF LIPSTICKS',
            'MATTE LIPSTICKS',
            'LIQUID LIPSTICKS',
            'CRAYON LIPSTICKS',
            'POWDER LIPSTICKS',
            'SATIN LIPSTICKS',
            'BULLET LIPSTICKS',
            'LIP GLOSS & LINERS'
          ]
        },
        {
          title: 'LIP CARE',
          items: [
            'LIPSTICK FIXERS & REMOVERS',
            'LIP PRIMERS & SCRUBS',
            'LIP BALMS'
          ]
        },
        {
          title: 'LIPSTICK SETS & COMBOS',
          items: [
            'LIPSTICK SETS',
            'LIPSTICK COMBOS'
          ]
        }
      ]
    },
    { name: 'HAIRCARE', link: '/haircare' },
    { name: 'BODYCARE', link: '/bodycare' },
    { name: 'ORALCARE', link: '/oralcare' },  
    { name: 'OFFERS', link: '/offers' },
    { name: 'BLOG', link: '/blog' }
  ];

  const getUserName = () => {
    if (!isAuthenticated) {
      return null;
    }

    // First check userDetails from Redux state
    if (userDetails) {
      if (userDetails.username) return userDetails.username;
      if (userDetails.user && userDetails.user.username) return userDetails.user.username;
      if (userDetails.name) return userDetails.name;
    }

    // Then check authUser from Redux state
    if (authUser) {
      if (authUser.username) return authUser.username;
      if (authUser.user && authUser.user.username) return authUser.user.username;
      if (authUser.name) return authUser.name;
    }

    // Finally check localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.username) return parsedUser.username;
        if (parsedUser.user && parsedUser.user.username) return parsedUser.user.username;
        if (parsedUser.name) return parsedUser.name;
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
      }
    }

    return 'User';
  };

  const renderUserInfo = () => {
    if (isLoading || userLoading) {
      return <div>Loading...</div>;
    }

    if (isAuthenticated) {
      const userName = getUserName();
      return (
        <div className="user-info" ref={dropdownRef}>
          <div onClick={toggleDropdown} className="user-profile-trigger">
            {profilePicture ? (
              <img src={profilePicture} alt="Profile" className="profile-icon" />
            ) : (
              <SocialIcon icon={faUserCircle} />
            )}
            <span className="user-name">&nbsp;{userName}</span>
          </div>
          {isDropdownOpen && (
            <div className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`}>
              <Link to="/profile" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>Profile</Link>
              <button className="dropdown-item" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      );
    } else {
      return (
        <span className="login-register">
          <Link to="/login" style={{ textDecoration: 'none', color: 'inherit' }}>
            <SocialIcon icon={faUserCircle} link="#"/> Login/Register
          </Link>
        </span>
      );
    }
  };

  const handleFavoritesClick = () => {
    if (isAuthenticated) {
      navigate('/profile', { state: { activeSection: 'favorites' } });
    } else {
      navigate('/login');
    }
  };

  useEffect(() => {
    const loadRecentSearches = () => {
      const searches = localStorage.getItem('recentSearches');
      if (searches) {
        setRecentSearches(JSON.parse(searches));
      }
      setRecentSearchesLoading(false);
    };
    loadRecentSearches();
  }, []);

  const clearRecentSearches = (e) => {
    e.stopPropagation(); // Prevent dropdown from closing
    localStorage.removeItem('recentSearches');
    setRecentSearches([]);
  };

  const toggleChatbot = () => {
    setIsChatbotOpen(!isChatbotOpen);
  };

  return (
    <header className={`header ${isHeaderScrolled ? 'header-scrolled' : ''}`}>
      <div className="header-top">
        <div className="marquee-container">
          <div className="marquee-item">
            {marqueeItems[currentMarqueeIndex]}
          </div>
        </div>
      </div>

      <div className="header-middle">
        <div className="logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
          <img src={HeaderLogo} alt="COMIX LOGO" className="comix-logo"/>
        </div>

        <div className="search-bar-container" ref={searchRef}>
          <form onSubmit={handleHeaderSearch} className="search-form">
            <input 
              type="text" 
              className="search-bar" 
              placeholder="Try Liquid Lipstick"
              value={headerSearchTerm}
              onChange={handleSearchChange}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
            />
            <button type="submit" className="search-button">
              <i className="fas fa-search"></i>
              <span className="search-text">Search</span>
            </button>
          </form>

          {showSearchDropdown && (
            <div className={`search-dropdown ${showSearchDropdown ? 'show' : ''}`}>
              {recentSearchesLoading ? (
                <div>Loading...</div>
              ) : (
                recentSearches.length > 0 && (
                  <div className={`search-section ${showSearchDropdown ? 'show' : ''}`}>
                    <div className="section-header">
                      <h3>Recent Searches</h3>
                      <button onClick={clearRecentSearches} className="clear-searches">
                        Clear all
                      </button>
                    </div>
                    <div className="frequently-searched">
                      {recentSearches.map((term, index) => (
                        <span key={index} className="search-term" onClick={() => handleSearchTermClick(term)}>
                          {term}
                        </span>
                      ))}
                    </div>
                  </div>
                )
              )}

              <div className={`search-section ${showSearchDropdown ? 'show' : ''}`}>
                <div className="section-header">
                  <i className="fas fa-fire social-icon"></i>
                  <h3>Hot Picks</h3>
                </div>
                <div className="hot-picks">
                  {hotPicks.map((item, index) => (
                    <div key={index} className="hot-pick-item">
                      <img src={item.image} alt={item.title} />
                      <span>{item.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`search-section ${showSearchDropdown ? 'show' : ''}`}>
                <div className="section-header">
                  <i className="fas fa-medal social-icon"></i>
                  <h3>Best Sellers</h3>
                </div>
                <div className="best-sellers">
                  {bestSellers.map((item, index) => (
                    <div key={index} className="best-seller-item">
                      <img src={item.image} alt={item.title} />
                      <div className="item-details">
                        <span className="title">{item.title}</span>
                        <span className="price">{item.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <button className="nav-toggle" onClick={toggleSidebar}>
          <SocialIcon icon={faBars} />
        </button>

        <div className="header-icons">
          {renderUserInfo()}
          <span className="icon" onClick={handleFavoritesClick} style={{ cursor: 'pointer' }}>
            <SocialIcon icon={faHeart} />
          </span>
          <span className="icon" onClick={handleCartClick} style={{ cursor: 'pointer', position: 'relative' }}>
            <SocialIcon icon={faShoppingCart} />
            {cartItemCount > 0 && (
              <span className="cart-item-count">
                {cartItemCount}
              </span>
            )}
          </span>
        </div>
      </div>

      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <img src={HeaderLogo} alt="COMIX LOGO" className="sidebar-logo" />
          <div className="sidebar-user-info">
            {isAuthenticated ? (
              <div className="user-info">
                {profilePicture ? (
                  <img src={profilePicture} alt="Profile" className="profile-icon" />
                ) : (
                  <SocialIcon icon={faUserCircle} />
                )}
                <span className="sidebar-username">&{getUserName()}</span>
              </div>
            ) : null}
          </div>
          <button className="close-sidebar" onClick={toggleSidebar}>
            <SocialIcon icon={faTimes} />
          </button>
        </div>
        <nav className="nav">
          {navLinks.map((navItem, index) => (
            <Link key={index} to={navItem.link} className="nav-link" onClick={toggleSidebar}>
              {navItem.name}
            </Link>
          ))}
          {isAuthenticated ? (
            <button className="nav-link" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <Link to="/login" className="nav-link" onClick={toggleSidebar}>
              <SocialIcon icon={faUserCircle} /> Login/Register
            </Link>
          )}
        </nav>
      </div>

      {isSidebarOpen && <div className="overlay" onClick={toggleSidebar}></div>}

      <nav className="nav desktop-nav">
        {navLinks.map((navItem, index) => (
          <div 
            key={index} 
            className="nav-item"
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeaveLips}
          >
            <Link to={navItem.link} className="nav-link">
              {navItem.name}
            </Link>
            {navItem.dropdown && activeDropdown === index && (
              <div className="dropdown" onMouseLeave={handleMouseLeaveDropdown}>
                {navItem.dropdown.map((category, catIndex) => (
                  <div key={catIndex} className="dropdown-category">
                    <h3>{category.title}</h3>
                    <ul>
                      {category.items.map((item, itemIndex) => (
                        <li key={itemIndex}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Mobile Footer Navigation */}
      <div className="mobile-footer">
        <Link to="/" className={`footer-item ${window.location.pathname === '/' ? 'active' : ''}`}>
          <SocialIcon icon={faHome} />
          <span>Home</span>
        </Link>
        <Link to="/cart" className={`footer-item ${window.location.pathname === '/cart' ? 'active' : ''}`}>
          <div className="cart-icon-container">
            <SocialIcon icon={faShoppingCart} />
            {cartItemCount > 0 && (
              <span className="cart-badge">{cartItemCount}</span>
            )}
          </div>
          <span>Cart</span>
        </Link>
        <button 
          className="footer-item" 
          onClick={toggleChatbot} 
          style={{ cursor: 'pointer' }}
        >
          <SocialIcon icon={faComments} />
          <span>Chat</span>
        </button>
        <Link 
          to={isAuthenticated ? "/profile" : "/login"} 
          className={`footer-item ${window.location.pathname === '/profile' || window.location.pathname === '/login' ? 'active' : ''}`}
        >
          {profilePicture ? (
            <img src={profilePicture} alt="Profile" className="profile-pic" />
          ) : (
            <SocialIcon icon={faUserCircle} />
          )}
          <span>Profile</span>
        </Link>
      </div>
      <Chatbot isOpen={isChatbotOpen} onClose={toggleChatbot} />
    </header>
  );
};

// Add a margin to the main content area to prevent overlap
const MainContent = styled.div`
  margin-top: 60px; // Adjust based on the height of your header
`;

export default Header;
