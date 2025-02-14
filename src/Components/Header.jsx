import React, { useState, useRef, useEffect, } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import '../Assets/Css/Header.scss';
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
  faHome,
  faComments
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';
import Chatbot from '../Components/Chatbot/Chatbot.jsx';
import MobileHeader from './MobileHeader'; // Import the new MobileHeader

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
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoryProducts, setCategoryProducts] = useState({});

  const [bestSellers, setBestSellers] = useState([]);
  const marqueeItems = [
    "🎉 Welcome to Commix - Your Beauty Destination!",
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
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

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

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const userString = localStorage.getItem('user');
        if (!userString) {
          // For guest users, get cart count from local storage
          const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
          const count = guestCart.reduce((sum, item) => sum + item.quantity, 0);
          dispatch(updateCartItemCount(count));
          return;
        }

        // For logged-in users
        const user = JSON.parse(userString);
        const userId = user._id || user.id || (user.user && (user.user._id || user.user.id));
        
        if (!userId) {
          console.error('No user ID found:', user);
          return;
        }

        const response = await axios.get(`${API_URL}/cart/count/${userId}`);
        if (response.data.success) {
          dispatch(updateCartItemCount(response.data.count));
        } else {
          console.error('Failed to fetch cart count:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching cart count:', error);
      }
    };

    fetchCartCount();
  }, [dispatch, isAuthenticated]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    // Toggle body scroll
    if (!isSidebarOpen) {
      document.body.classList.add('sidebar-open');
    } else {
      document.body.classList.remove('sidebar-open');
    }
  };

  useEffect(() => {
    return () => {
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
      if (window.innerWidth <= 767) {  // Only apply on mobile
        setIsHeaderScrolled(window.scrollY > 10);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMarqueeIndex((prevIndex) => 
        prevIndex === marqueeItems.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
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

  useEffect(() => {
    const fetchProductsForSubcategories = async () => {
      try {
        const productsData = {};
        for (const category of categories) {
          for (const subcategory of category.subcategories) {
            const response = await axios.get(`${API_URL}/products/subcategory/${subcategory._id}`);
            if (response.data.success) {
              productsData[subcategory._id] = response.data.products;
            }
          }
        }
        setCategoryProducts(productsData);
      } catch (error) {
        console.error('Error fetching subcategory products:', error);
      }
    };

    if (categories.length > 0) {
      fetchProductsForSubcategories();
    }
  }, [categories]);

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
              <FontAwesomeIcon icon={faUserCircle} />
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
            <FontAwesomeIcon icon={faUserCircle} /> Login/Register
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

  useEffect(() => {
    const checkFooterVisibility = () => {
      const footer = document.querySelector('footer');
      if (footer) {
        const footerRect = footer.getBoundingClientRect();
        const isVisible = footerRect.top <= window.innerHeight;
        setIsFooterVisible(isVisible);
      }
    };

    window.addEventListener('scroll', checkFooterVisibility);
    // Initial check
    checkFooterVisibility();

    return () => window.removeEventListener('scroll', checkFooterVisibility);
  }, []);

  const handleMenuClick = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSearchClick = () => {
    // Implement search functionality
  };

  const handleLongPress = (e, dropdownId) => {
    e.preventDefault();
    setActiveDropdown(dropdownId);
    setIsDropdownOpen(true);
  };

  const handleTouchStart = (e, dropdownId) => {
    dropdownTimeout.current = setTimeout(() => handleLongPress(e, dropdownId), 500);
  };

  const handleTouchEnd = () => {
    clearTimeout(dropdownTimeout.current);
  };

  const HeaderSkeleton = () => (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo skeleton */}
          <div className="animate-pulse">
            <div className="h-8 w-24 bg-gray-200 rounded"></div>
          </div>

          {/* Search bar skeleton */}
          <div className="hidden md:flex flex-1 mx-8 animate-pulse">
            <div className="h-10 w-full max-w-xl bg-gray-200 rounded-lg"></div>
          </div>

          {/* Navigation items skeleton */}
          <div className="hidden md:flex items-center space-x-6 animate-pulse">
            <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
            <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
            <div className="h-8 w-20 bg-gray-200 rounded"></div>
          </div>

          {/* Mobile menu button skeleton */}
          <div className="md:hidden animate-pulse">
            <div className="h-8 w-8 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </header>
  );

  if (isLoading) {
    return <HeaderSkeleton />;
  }

  return (
    <>
      <MobileHeader 
        cartItemCount={cartItemCount} 
        onMenuClick={handleMenuClick} 
        onSearchClick={handleSearchClick} 
        marqueeText={marqueeItems[currentMarqueeIndex]}
        onLogout={handleLogout}
        categories={categories}
      />
      <header className={`header ${!isHeaderVisible ? 'hidden' : ''} ${isHeaderScrolled ? 'scrolled' : ''}`}>
        <div className="desktop-header">
          <div className="header-top">
            <div className="marquee-container">
              <div className="marquee-item">
                🎉 Welcome to Commix - Your Beauty Destination!
              </div>
              <div className="marquee-item">
               🎉 Free Shipping on Orders Over ₹499 🎁 Get 10% Off on Your First Order
              </div>
              <div className="marquee-item">
               🎁 Get 10% Off on Your First Order
              </div>
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
                placeholder="Search...."
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
                  <div key={item.id} className="best-seller-item" onClick={() => navigate(`/product/${item.slug}`)}>
                        <img src={item.image_urls[0]} alt={item.image_urls[1]} />
                        <div className="item-details">
                          <span className="title">{item.name}</span>
                          <span className="price">Rs:{item.variants[0].price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <button className="nav-toggle" onClick={toggleSidebar}>
            <FontAwesomeIcon icon={faBars} />
          </button>

          <div className="header-icons">
            {renderUserInfo()}
            <span className="icon" onClick={handleFavoritesClick} style={{ cursor: 'pointer' }}>
              <FontAwesomeIcon icon={faHeart} />
            </span>
            <span className="icon" onClick={handleCartClick} style={{ cursor: 'pointer', position: 'relative' }}>
              <FontAwesomeIcon icon={faShoppingCart} />
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
            <button className="sidebar-close-button" onClick={toggleSidebar}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          <nav className="nav">
            <Link to="/" className="nav-link" onClick={toggleSidebar}>
              HOME
            </Link>
            {categories.map((category) => (
              <Link 
                key={category._id} 
                to="/product"
                state={{ selectedCategory: category._id }}
                className="nav-link"
                onClick={() => {
                  console.log("Clicked category (mobile):", category._id); // Debug log
                  localStorage.setItem('lastSelectedCategory', category._id); // Store category ID
                  toggleSidebar();
                }}
              >
                {category.name.toUpperCase()}
              </Link>
            ))}
            <Link to="/offers" className="nav-link" onClick={toggleSidebar}>
              OFFERS
            </Link>
            <Link to="/blog" className="nav-link" onClick={toggleSidebar}>
              BLOGS
            </Link>
            {isAuthenticated ? (
              <button className="nav-link" onClick={handleLogout}>
                Logout
              </button>
            ) : (
              <Link to="/login" className="nav-link" onClick={toggleSidebar}>
                <FontAwesomeIcon icon={faUserCircle} /> Login/Register
              </Link>
            )}
          </nav>
        </div>

        {isSidebarOpen && <div className="overlay" onClick={toggleSidebar}></div>}

        {/* Desktop Navigation */}
        <nav className="nav desktop-nav">
          {categories.map((category, index) => (
            <div 
              key={category._id} 
              className="nav-item"
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeaveLips}
            >
<Link 
  to="/product"
  state={{ selectedCategory: category._id }} // Pass as state
  onClick={() => localStorage.setItem('lastSelectedCategory', category._id)}
>
  {category.name.toUpperCase()}
</Link>
              {category.subcategories && category.subcategories.length > 0 && activeDropdown === index && (
                <div className="dropdown" onMouseLeave={handleMouseLeaveDropdown}>
                  {category.subcategories.map((subcategory) => (
                    <div key={subcategory._id} className="dropdown-category">
                      <h3>{subcategory.name.toUpperCase()}</h3>
                      <ul>
                        {categoryProducts[subcategory._id]?.map((product) => (
                          <li key={product._id}>
                            <Link to={`/product/${product.slug}`}>
                             <h5>{product.name}</h5>
                            </Link>
                          </li>
                        ))}
                        {(!categoryProducts[subcategory._id] || categoryProducts[subcategory._id].length === 0) && (
                          <li>
                            <h5>No products available</h5>
                          </li>
                        )}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="nav-item">
            <Link to="/offers" className="nav-link">
              OFFERS
            </Link>
          </div>
          <div className="nav-item">
            <Link to="/blog" className="nav-link">
              BLOGS
            </Link>
          </div>
        </nav>

        {/* Mobile Footer Navigation */}
        <div className={`mobile-footer ${isFooterVisible ? 'hidden' : ''}`}>
          <Link to="/" className={`footer-item ${window.location.pathname === '/' ? 'active' : ''}`}>
            <FontAwesomeIcon icon={faHome} />
            <span>Home</span>
          </Link>
          <Link to="/cart" className={`footer-item ${window.location.pathname === '/cart' ? 'active' : ''}`}>
            <div className="cart-icon-container">
              <FontAwesomeIcon icon={faShoppingCart} />
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
            <FontAwesomeIcon icon={faComments} />
            <span>Chat</span>
          </button>
          <Link 
            to={isAuthenticated ? "/profile" : "/login"} 
            className={`footer-item ${window.location.pathname === '/profile' || window.location.pathname === '/login' ? 'active' : ''}`}
          >
            {profilePicture ? (
              <img src={profilePicture} alt="Profile" className="profile-pic" />
            ) : (
              <FontAwesomeIcon icon={faUserCircle} />
            )}
            <span>Profile</span>
          </Link>
        </div>
        <Chatbot isOpen={isChatbotOpen} onClose={toggleChatbot} />
      </header>
    </>
  );
};

// Add a margin to the main content area to prevent overlap
const MainContent = styled.div`
  margin-top: 60px; // Adjust based on the height of your header
`;

export default Header;