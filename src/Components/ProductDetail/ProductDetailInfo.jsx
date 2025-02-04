import React, { useState, useEffect, forwardRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShare, faStar } from '@fortawesome/free-solid-svg-icons';
import { FaHeart } from "react-icons/fa";
import axios from 'axios';
import { API_URL } from '../../config/api';
import { useDispatch } from 'react-redux';
import { updateCartItemCount } from '../../features/cart/cartSlice';
import { addToGuestCart } from '../../services/guestCartService';
import '../../Assets/Css/ProductDetail/ProductDetailInfo.scss';
import { useNavigate } from 'react-router-dom';
import CartNotification from '../Cart/CartNotification';

const ProductDetailInfo = forwardRef(({ product, isMobile }, ref) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [offers, setOffers] = useState([]);
  const [showAllOffers, setShowAllOffers] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [expandedOffers, setExpandedOffers] = useState({});
  const [deviceType, setDeviceType] = useState('desktop');
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    fetchOffers();
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      checkIfFavorite(user.user.id, product._id);
    }
    // Set initial variant
    if (product.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
    }

    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setDeviceType('mobile');
      } else if (width >= 768 && width < 1024) {
        setDeviceType('tablet');
      } else if (width >= 1024 && width < 1366) {
        setDeviceType('ipadPro');
      } else {
        setDeviceType('desktop');
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [product._id]);

  const checkIfFavorite = async (userId, productId) => {
    try {
      const response = await axios.get(`${API_URL}/favorites/check`, {
        params: { user_id: userId, product_id: productId }
      });
      setIsFavorite(response.data.isFavorite);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const fetchOffers = async () => {
    try {
      const response = await axios.get(`${API_URL}/offers`);
      setOffers(response.data.offers);
    } catch (error) {
      console.error('Error fetching offers:', error);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name}`,
        url: window.location.href
      })
      .then(() => console.log('Shared successfully!'))
      .catch((error) => console.log('Error sharing:', error));
    } else {
      // Fallback for browsers that don't support native sharing
      navigator.clipboard.writeText(window.location.href)
        .then(() => console.log('Link copied to clipboard!'))
        .catch(() => console.log('Failed to copy link'));
    }
  };

  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);
  };

  const handleAddToBag = async () => {
    if (!selectedVariant) {
      console.log('Please select a variant');
      return;
    }

    try {
      setIsAddingToCart(true);

      if (selectedVariant.stock_quantity < 1) {
        console.log('Selected variant is out of stock');
        return;
      }

      const userString = localStorage.getItem('user');
      
      if (!userString) {
        const updatedCart = addToGuestCart(
          product,
          selectedVariant,
          1
        );
        
        const newCount = updatedCart.reduce((sum, item) => sum + item.quantity, 0);
        dispatch(updateCartItemCount(newCount));
        
        showCartSuccessNotification();
        setShowNotification(true);
        return;
      }

      const user = JSON.parse(userString);
      const response = await axios.post(`${API_URL}/cart/add`, {
        user_id: user.user.id,
        product_id: product._id,
        variant_name: selectedVariant.name,
        quantity: 1
      });

      if (response.data.cartItem) {
        console.log('Added to cart successfully!');
        showCartSuccessNotification();
        setShowNotification(true);
        const newCount = await fetchCartItemCount(user.user.id);
        dispatch(updateCartItemCount(newCount));
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      console.log('Failed to add to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const fetchCartItemCount = async (userId) => {
    try {
      const userString = localStorage.getItem('user');
      
      if (!userString) {
        // For guest users, get cart from localStorage
        const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
        return guestCart.reduce((sum, item) => sum + item.quantity, 0);
      }

      // For logged-in users, get cart from API
      const response = await axios.get(`${API_URL}/cart/${userId}`);
      return response.data.cartItems.reduce((sum, item) => sum + item.quantity, 0);
    } catch (error) {
      console.error('Failed to fetch cart item count:', error);
      return 0;
    }
  };

  const handleToggleFavorite = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      console.log('Please log in to manage favorites');
      return;
    }

    try {
      if (isFavorite) {
        await axios.delete(`${API_URL}/favorites/delete`, {
          data: {
            user_id: user.user.id,
            product_id: product._id
          }
        });
        setIsFavorite(false);
        console.log('Product removed from favorites!');
      } else {
        await axios.post(`${API_URL}/favorites/add`, {
          user_id: user.user.id,
          product_id: product._id
        });
        setIsFavorite(true);
        console.log('Product added to favorites!');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      console.log('Failed to update favorites. Please try again.');
    }
  };

  const showCartSuccessNotification = () => {
    console.log('Cart success notification');
  };

  const handleViewCart = (e) => {
    e.preventDefault();
    navigate('/cart');
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    navigate('/checkout');
  };

  const handleOfferClick = (offerId) => {
    setExpandedOffers(prev => ({
      ...prev,
      [offerId]: !prev[offerId]
    }));
  };

  const regularPrice = selectedVariant ? selectedVariant.price : 0;
  const memberPrice = Math.floor(regularPrice * 0.8);
  const displayedOffers = showAllOffers ? offers : offers.slice(0, 2);

  // Default taglines
  const defaultTaglines = [
    'Dermatologically Tested',
    '100% Authentic Products',
    'Free Shipping Available',
    'Premium Quality'
  ];

  // Convert comma-separated string to array or use defaults
  const displayTaglines = product?.taglines 
    ? product.taglines.split(',').map(tag => tag.trim())
    : defaultTaglines;

  // Only expose these methods for mobile view
  React.useImperativeHandle(ref, () => ({
    handleToggleFavorite: deviceType === 'mobile' ? handleToggleFavorite : null,
    handleAddToBag: deviceType === 'mobile' ? handleAddToBag : null,
    isFavorite: deviceType === 'mobile' ? isFavorite : null,
    isAddingToCart: deviceType === 'mobile' ? isAddingToCart : null
  }));

  return (
    <>
      <div className={`product-detail-info ${deviceType}`}>
        <div className="product-header">
          <div className="title-section">
            <h1 className="product-name">{product.name}</h1>
            {product.category_id?.name === 'Skin Care' && (
              <div className="skin-type-badge">
                <span className="badge-icon">✧</span>
                <span className="badge-text">For ALL Skin Types</span>
              </div>
            )}
          </div>
          <button className="share-button" onClick={handleShare}>
            <FontAwesomeIcon icon={faShare} />
            <span>Share</span>
          </button>
        </div>

        <div className="variants-section">
          {product.variants && product.variants.map((variant) => (
            <button
              key={variant._id}
              className={`variant-btn ${selectedVariant?._id === variant._id ? 'active' : ''}`}
              onClick={() => handleVariantSelect(variant)}
            >
              {variant.name}
            </button>
          ))}
        </div>

        <div className="price-section">
          <div className="regular-price">Rs:{regularPrice}</div>
          <div className="product-taglines">
            <div className="tagline-grid">
              {displayTaglines.map((tagline, index) => (
                <div key={index} className="tagline-item">
                  <span className="tagline-icon">✦</span>
                  <span className="tagline-text">{tagline}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {offers && offers.length > 0 && (
          <div className="offers-section">
            <h3 className="section-title">AVAILABLE OFFER!</h3>
            <ul className="offers-list">
              {displayedOffers.map((offer, index) => (
                <li key={offer.id || index} className="offer-item">
                  <div className="offer-header">
                    <span>{offer.description}</span>
                    <button 
                      className="know-more-btn"
                      onClick={() => handleOfferClick(offer.id || index)}
                    >
                      {expandedOffers[offer.id || index] ? 'Show Less' : 'Know More'}
                    </button>
                  </div>
                  <div className={`offer-details ${expandedOffers[offer.id || index] ? 'expanded' : ''}`}>
                    <div className="details-content">
                      <p className="discount">Discount: {offer.discount_percentage}% off</p>
                      <p className="note">* This offer can be applied at checkout</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            {offers.length > 2 && (
              <button 
                className="view-more-btn"
                onClick={() => setShowAllOffers(!showAllOffers)}
              >
                {showAllOffers ? '- View Less' : '+ View More'}
              </button>
            )}
          </div>
        )}

        {deviceType === 'mobile' && (
           <div className="payment-methods">
           <div className="payment-methods-image-container">
             <img 
               src="/images/payments.png" 
               alt="Available payment methods" 
               className="payment-methods-image" 
             />
           </div>
           <div className="payment-features">
             <div className="feature-card prepaid">
               <span>5% Prepaid Discount</span>
             </div>
             <div className="feature-card cod">
               <span>COD Available</span>
             </div>
             <div className="feature-card delivery">
               <span>Delivers in 3 - 5 days</span>
             </div>
           </div>
         </div>
        )}

        {deviceType !== 'mobile' && (
          <>
            <div className="action-buttons-container">
              <button 
                className={`favorite-btn ${isFavorite ? 'active' : ''}`}
                onClick={handleToggleFavorite}
              >
                <FaHeart />
              </button>
              <button
                className={`add-to-bag-btn ${isAddingToCart ? 'loading' : ''}`}
                onClick={handleAddToBag}
                disabled={isAddingToCart}
              >
                {isAddingToCart ? 'Adding...' : 'Add to Bag'}
              </button>
            </div>

            <div className="payment-methods">
              <div className="payment-methods-image-container">
                <img 
                  src="/images/payments.png" 
                  alt="Available payment methods" 
                  className="payment-methods-image" 
                />
              </div>
              <div className="payment-features">
                <div className="feature-card prepaid">
                  <span>5% Prepaid Discount</span>
                </div>
                <div className="feature-card cod">
                  <span>COD Available</span>
                </div>
                <div className="feature-card delivery">
                  <span>Delivers in 3 - 5 days</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <CartNotification 
        isOpen={showNotification}
        onClose={() => setShowNotification(false)}
        addedProduct={product}
      />
    </>
  );
});

export default ProductDetailInfo;
