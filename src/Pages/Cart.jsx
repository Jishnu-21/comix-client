// src/Assets/Css/ProductPage/CardComponent.scss
// src/Pages/Cart.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import CartProduct from '../Components/Cart/CartProduct';
import OrderSummary from '../Components/Cart/OrderSummary';
import RecommendedProduct from '../Components/Cart/RecommendedProduct';
import CardComponent from '../Components/ProductPage/CardComponent';
import { API_URL } from "../config/api";
import '../Assets/Css/Cart/Cart.scss';
import '../Assets/Css/ProductPage/ProductGridLayout.scss';
import 'swiper/css';
import 'swiper/css/pagination';
import { useDispatch } from 'react-redux';
import { updateCartItemCount } from '../features/cart/cartSlice';
import Touch from '../Components/Touch';
import { toast } from 'react-toastify';  
import { getGuestCart, addToGuestCart, removeFromGuestCart } from '../services/guestCartService';
import '../Assets/Css/ProductPage/CardComponent.scss'
import MobileCart from '../Components/Cart/MobileCart';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import LoadingScreen from '../Components/LoadingScreen';
import BestSeller from '../Components/ProductPage/BestSeller';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css/navigation';

const fetchCartItemCount = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/cart/${userId}`);
    return response.data.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  } catch (error) {
    console.error('Failed to fetch cart item count:', error);
    return 0;
  }
};

const Cart = () => {
  const [cartProducts, setCartProducts] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [subtotal, setSubtotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    fetchCartData();
    fetchAllProducts();
    fetchBestSellers();
  }, []);

  useEffect(() => {
    calculateTotals();
  }, [cartProducts]);

  const fetchCartData = async () => {
    try {
      const userString = localStorage.getItem('user');
      
      if (!userString) {
        const guestCart = getGuestCart();
        console.log('Fetched guest cart items:', guestCart);
        setCartProducts(guestCart);
        return;
      }

      const userData = JSON.parse(userString);
      const userId = userData.user?.id || userData.id;
      
      if (!userId) {
        throw new Error('Invalid user ID');
      }

      const response = await axios.get(`${API_URL}/cart/${userId}`);
      console.log('Fetched cart items for logged-in user:', response.data.cartItems);
      setCartProducts(response.data.cartItems || []);
    } catch (error) {
      console.error("Error fetching cart data:", error);
      setCartProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotals = () => {
    const total = cartProducts.reduce((sum, item) => sum + (item.total_price || 0), 0);
    const count = cartProducts.reduce((sum, item) => sum + (item.quantity || 0), 0);
    setSubtotal(total);
    setItemCount(count);
  };

  const getVariantStockQuantity = (product, variantName) => {
    if (product && product.variants) {
      const variant = product.variants.find(v => v.name === variantName);
      return variant ? variant.stock_quantity : 0;
    }
    return 0;
  };

  const handleQuantityChange = async (data) => {
    try {
      const userString = localStorage.getItem('user');
      
      if (!userString) {
        const updatedCart = addToGuestCart(
          {
            _id: data.product_id,
            name: data.product_name,
            image_urls: data.image_urls,
            description: data.description,
            variants: data.variants
          },
          {
            name: data.variant_name,
            price: data.price
          },
          data.quantity,
          true
        );
        setCartProducts(updatedCart);
        dispatch(updateCartItemCount(updatedCart.reduce((sum, item) => sum + item.quantity, 0)));
        toast.success('Cart updated successfully');
        return;
      }

      const userData = JSON.parse(userString);
      const userId = userData.user?.id;

      if (!userId) {
        toast.error('User not found');
        return;
      }

      // Use PUT request for quantity update
      const response = await axios.put(`${API_URL}/cart/update-quantity`, {
        user_id: userId,
        product_id: data.product_id,
        variant_name: data.variant_name,
        quantity: data.quantity
      });

      if (response.data && response.data.cartItem) {
        await fetchCartData();
        const newCount = await fetchCartItemCount(userId);
        dispatch(updateCartItemCount(newCount));
        toast.success('Cart updated successfully');
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error(error.response?.data?.message || 'Failed to update quantity');
    }
  };

  const handleDelete = async (productId, variantName) => {
    try {
      const userString = localStorage.getItem('user');
      
      if (!userString) {
        if (!productId || !variantName) {
          console.error('Missing required data:', { productId, variantName });
          toast.error('Unable to remove item: Missing data');
          return;
        }

        const updatedCart = removeFromGuestCart(productId, variantName);
        setCartProducts(updatedCart);
        const newCount = updatedCart.reduce((sum, item) => sum + item.quantity, 0);
        dispatch(updateCartItemCount(newCount));
        toast.success('Item removed from cart');
        return;
      }

      const userData = JSON.parse(userString);
      const userId = userData.user?.id;

      if (!userId) {
        toast.error('User not found');
        return;
      }

      const actualProductId = typeof productId === 'string' ? productId : productId._id;

      await axios.post(`${API_URL}/cart/remove`, {
        user_id: userId,
        product_id: actualProductId,
        variant_name: variantName
      });

      await fetchCartData();
      const newCount = await fetchCartItemCount(userId);
      dispatch(updateCartItemCount(newCount));
      toast.success('Item removed from cart');
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error(error.response?.data?.message || 'Failed to remove item from cart');
    }
  };

  const fetchAllProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products/`);
      const allProducts = response.data.products;
      
      if (Array.isArray(allProducts)) {
        const cartProductIds = new Set(cartProducts.map(item => item.product_id._id));
        const availableProducts = allProducts.filter(product => !cartProductIds.has(product._id));
        
        const shuffled = availableProducts.sort(() => 0.5 - Math.random());
        
        setRecommendedProducts(shuffled.slice(0, 5));
        setBestSellers(shuffled.slice(5, 9));
      } else {
        console.error("Unexpected response format for products:", allProducts);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchBestSellers = async () => {
    try {
      const response = await axios.get(`${API_URL}/products/`);
      if (response.data.success) {
        setBestSellers(response.data.products);
      } else {
        console.error('Failed to fetch best sellers');
      }
    } catch (err) {
      console.error('Error fetching best sellers:', err);
    }
  };

  const handleProceedToBuy = () => {
    const userString = localStorage.getItem('user');
    if (!userString) {
      navigate('/checkout', { state: { isGuest: true } });
    } else {
      navigate('/checkout');
    }
  };

  const fetchRecommendedProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/recommended-products`);
      const productsWithReviews = await Promise.all(response.data.map(async (product) => {
        const reviewsResponse = await axios.get(`${API_URL}/reviews/product/${product._id}`);
        const reviews = reviewsResponse.data.reviews;

        // Calculate average rating
        const averageRating = reviews.length > 0 
          ? (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1)
          : 0;

        return { ...product, averageRating, reviews };
      }));

      setRecommendedProducts(productsWithReviews);
    } catch (error) {
      console.error('Error fetching recommended products:', error);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  const isCartEmpty = cartProducts.length === 0;

  return (
    <div className="cart-page">
      {/* Desktop Cart */}
      <div className="d-none d-md-block">
        <Header />
        <div className="cart-container">
          <div className="container-fluid">
            {isCartEmpty ? (
              <div className="empty-cart-message">
                <div className="empty-cart-icon">
                  <FontAwesomeIcon icon={faShoppingCart} />
                </div>
                <h2>Your Shopping Cart is Empty</h2>
                <p>
                  Looks like you haven't added anything to your cart yet. 
                  Explore our collection and find something you'll love!
                </p>
                <Link to="/product" className="btn btn-primary font-color-$header-bg">
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="cart-page-layout">
                {/* Left Side - Cart Products */}
                <div className="cart-products-container">
                  <div className="cart-products-list">
                    <div className="cart-header">
                      <h1>Cart</h1>
                      <Link to="/" className="continue-shopping">
                        <FontAwesomeIcon icon={faArrowLeft} />
                        Continue Shopping
                      </Link>
                    </div>
                    {cartProducts.map((product, index) => (
                      <CartProduct 
                        key={`${product.product_id}-${product.variant_name}`}
                        product={{...product, isFirstProduct: index === 0}}
                        onQuantityChange={handleQuantityChange}
                        onDelete={() => handleDelete(product.product_id, product.variant_name)}
                      />
                    ))}
                    <div className="cart-products-subtotal">
                      <span>Subtotal ({itemCount} items):</span>
                      <span className="subtotal-amount">₹{subtotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Right Side - Order Summary and Recommendations */}
                <div className="cart-sidebar">
                  <div className="cart-sidebar-content">
                    <OrderSummary 
                      subtotal={subtotal} 
                      itemCount={itemCount} 
                      onProceedToBuy={handleProceedToBuy}
                    />
                    {recommendedProducts.length > 0 && (
                      <div className="recommended-products">
                        <h5 className="recommended-title  fw-bold mb-3">Recommended Products</h5>
                        <div className="recommended-products-grid">
                          {recommendedProducts.map((product) => (
                            <RecommendedProduct 
                              key={product._id} 
                              product={product}
                              onCartUpdate={fetchCartData}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        {!isCartEmpty && (
          <div className="best-sellers-section">
            <div className="container">
              <div className="section-header">
                <div className="header-content">
                  <h2 className="section-title mb-0">Explore Our Best Collections</h2>
                </div>
                <Link to="/product" className="view-all-btn">View All</Link>
              </div>
              
              {/* Desktop View (4 products grid) */}
              <div className="products-grid d-none d-xl-grid">
                {bestSellers.slice(0, 4).map(product => (
                  <div key={product._id} className="product-card-wrapper">
                    <BestSeller
                      image={product.image_urls[0]}
                      title={product.name}
                      price={product.variants[0]?.price || 0}
                      category={product.description}
                      slug={product._id}
                    />
                  </div>
                ))}
              </div>

              {/* Tablet View (2 products slider) */}
              <div className="products-slider d-none d-md-block d-xl-none">
                <Swiper
                  modules={[Navigation, Pagination]}
                  spaceBetween={20}
                  slidesPerView={2}
                  navigation
                  pagination={{ clickable: true }}
                  className="best-sellers-swiper"
                >
                  {bestSellers.map(product => (
                    <SwiperSlide key={product._id}>
                      <div className="product-card-wrapper">
                        <BestSeller
                          image={product.image_urls[0]}
                          title={product.name}
                          price={product.variants[0]?.price || 0}
                          category={product.description}
                          slug={product._id}
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              {/* Mobile View (Single product slider) */}
              <div className="products-slider d-block d-md-none">
                <Swiper
                  modules={[Navigation, Pagination]}
                  spaceBetween={10}
                  slidesPerView={1}
                  navigation
                  pagination={{ clickable: true }}
                  className="best-sellers-swiper"
                >
                  {bestSellers.map(product => (
                    <SwiperSlide key={product._id}>
                      <div className="product-card-wrapper">
                        <BestSeller
                          image={product.image_urls[0]}
                          title={product.name}
                          price={product.variants[0]?.price || 0}
                          category={product.description}
                          slug={product._id}
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          </div>
        )}
        <Touch/>
        <Footer />
      </div>

      {/* Mobile Cart */}
      <div className="d-block d-md-none">
        <MobileCart
          cartProducts={cartProducts}
          handleQuantityChange={handleQuantityChange}
          handleDelete={handleDelete}
          subtotal={subtotal}
          itemCount={itemCount}
          onProceedToBuy={handleProceedToBuy}
        />
      </div>
    </div>
  );
};


export default Cart;
