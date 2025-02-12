import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { updateCartItemCount } from '../../features/cart/cartSlice';
import { IoMdClose } from 'react-icons/io';
import { BsCartPlus } from 'react-icons/bs';
import { getGuestCart, getGuestCartCount, removeFromGuestCart, addToGuestCart } from '../../services/guestCartService';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import { API_URL } from '../../config/api';
import './CartNotification.scss';

const CartNotification = ({ isOpen, onClose, addedProduct }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [loadingRecommended, setLoadingRecommended] = useState(false);

  const fetchCartItemCount = async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/cart/count/${userId}`);
      return response.data.count;
    } catch (error) {
      console.error('Error fetching cart count:', error);
      return 0;
    }
  };

  const fetchRecommendedProducts = async () => {
    setLoadingRecommended(true);
    try {
      const response = await axios.get(`${API_URL}/products/`);
      setRecommendedProducts(response.data.products.slice(0, 3));
    } catch (error) {
      console.error('Error fetching recommended products:', error);
    } finally {
      setLoadingRecommended(false);
    }
  };

  const fetchCartItems = async () => {
    setLoading(true);
    try {
      if (user) {
        const userId = user.user?.id || user.id; // Handle both user structures
        const response = await axios.get(`${API_URL}/cart/${userId}`);
        
        // Transform the cart items to match the expected format
        const formattedItems = (response.data.cartItems || []).map(item => ({
          _id: item.product_id._id + '-' + item.variant_name,
          quantity: item.quantity,
          product: {
            _id: item.product_id._id,
            name: item.product_id.name,
            price: item.price,
            image_urls: item.product_id.image_urls,
            variant_name: item.variant_name
          }
        }));
        
        setCartItems(formattedItems);
      } else {
        const guestCart = getGuestCart();
        const formattedGuestCart = guestCart.map(item => ({
          _id: item.product_id + '-' + item.variant_name,
          quantity: item.quantity,
          product: {
            _id: item.product_id,
            name: item._display.name,
            price: item.price,
            image_urls: item._display.image_urls,
            variant_name: item.variant_name
          }
        }));
        setCartItems(formattedGuestCart);
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchCartItems();
      fetchRecommendedProducts();
      document.body.style.overflow = 'hidden';
    }
    return () => {
      if (document.body.style.overflow === 'hidden') {
        document.body.style.overflow = '';
      }
    };
  }, [isOpen]);

  const handleQuantityChange = async (itemId, change, currentQuantity) => {
    const newQuantity = Math.max(1, currentQuantity + change);
    
    try {
      if (user) {
        const userId = user.user?.id || user.id;
        const [productId, variantName] = itemId.split('-');
        
        await axios.put(`${API_URL}/cart/update-quantity`, {
          user_id: userId,
          product_id: productId,
          variant_name: variantName,
          quantity: newQuantity
        });
        
        const newCount = await fetchCartItemCount(userId);
        dispatch(updateCartItemCount(newCount));
      } else {
        const [productId, variantName] = itemId.split('-');
        const guestCart = getGuestCart();
        const item = guestCart.find(i => i.product_id === productId && i.variant_name === variantName);
        if (item) {
          item.quantity = newQuantity;
          item.total_price = newQuantity * item.price;
          localStorage.setItem('guestCart', JSON.stringify(guestCart));
          dispatch(updateCartItemCount(getGuestCartCount()));
        }
      }
      fetchCartItems();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      if (user) {
        const userId = user.user?.id || user.id;
        const [productId, variantName] = itemId.split('-');
        
        await axios.post(`${API_URL}/cart/remove`, {
          user_id: userId,
          product_id: productId,
          variant_name: variantName
        });
        
        const newCount = await fetchCartItemCount(userId);
        dispatch(updateCartItemCount(newCount));
      } else {
        const [productId, variantName] = itemId.split('-');
        removeFromGuestCart(productId, variantName);
        dispatch(updateCartItemCount(getGuestCartCount()));
      }
      fetchCartItems();
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const handleAddRecommendedToCart = async (product) => {
    try {
      const defaultVariant = product.variants[0];
      if (user) {
        const userId = user.user?.id || user.id;
        await axios.post(`${API_URL}/cart/add`, {
          user_id: userId,
          product_id: product._id,
          variant_name: defaultVariant.name,
          quantity: 1
        });
        const newCount = await fetchCartItemCount(userId);
        dispatch(updateCartItemCount(newCount));
      } else {
        addToGuestCart(product, defaultVariant, 1);
        dispatch(updateCartItemCount(getGuestCartCount()));
      }
      fetchCartItems();
    } catch (error) {
      console.error('Error adding recommended product to cart:', error);
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const subtotal = cartItems.reduce((total, item) => {
    return total + (item.product.price * item.quantity);
  }, 0);

  if (!isOpen) return null;
  return (
    <div className={`cart-notification ${isOpen ? 'open' : ''}`}>
      <div className="notification-header">
        <h2>YOUR CART</h2>
        <button className="close-btn" onClick={onClose}>
          <IoMdClose />
        </button>
      </div>


      <div className="cart-items">
        {loading ? (
          <div className="loading">Loading cart items...</div>
        ) : cartItems.length === 0 ? (
          <div className="empty-cart">Your cart is empty</div>
        ) : (
          cartItems.map((item) => (
            <div key={item._id} className="cart-item">
              <img 
                src={item.product.image_urls[0]} 
                alt={item.product.name} 
              />
              <div className="item-info">
                <h3>{item.product.name}</h3>
                <p className="variant">{item.product.variant_name}</p>
                <p className="price">Rs. {item.product.price}</p>
                <div className="quantity-controls">
                  <button 
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(item._id, -1, item.quantity)}
                  >
                    -
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button 
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(item._id, 1, item.quantity)}
                  >
                    +
                  </button>
                </div>
              </div>
              <button 
                className="remove-btn"
                onClick={() => handleRemoveItem(item._id)}
              >
                <IoMdClose />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="recommended-section">
        <h3>You May Also Like</h3>
        {loadingRecommended ? (
          <div className="loading">Loading recommendations...</div>
        ) : (
          <Swiper
            modules={[FreeMode]}
            spaceBetween={8}
            slidesPerView="auto"
            freeMode={true}
            className="recommended-slider"
          >
            {recommendedProducts.map((product) => (
              <SwiperSlide key={product._id} className="recommended-slide">
                <div className="recommended-item">
                  <div className="image-container">
                    <img 
                      src={product.image_urls[0]} 
                      alt={product.name}
                    />
                  </div>
                  <div className="recommended-info">
                    <h4>{product.name}</h4>
                    <div className="price-cart">
                      <p className="price">Rs. {product.variants[0].price}</p>
                      <button 
                        className="cart-add-btn"
                        onClick={() => handleAddRecommendedToCart(product)}
                        title="Add to Cart"
                      >
                        <BsCartPlus />
                      </button>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>

      <div className="cart-footer">
        <div className="subtotal">
          <span>SUBTOTAL</span>
          <span>Rs. {subtotal.toFixed(2)}</span>
        </div>
        <p className="note">Apply coupon at next step | Not Applicable On Combos & Gifts</p>
        <button 
          className="place-order-btn" 
          onClick={handleCheckout}
          disabled={cartItems.length === 0}
        >
          PLACE ORDER
        </button>
      </div>
    </div>
  );
};

export default CartNotification;
