import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Slider from 'react-slick';
import SectionTitle from './SectionTitle';
import { API_URL } from '../config/api';
import '../Assets/Css/ProductSpotlight.scss';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useDispatch } from 'react-redux';
import { updateCartItemCount } from '../features/cart/cartSlice';
import { addToGuestCart } from '../services/guestCartService';
import { toast } from 'sonner';

const ProductSpotlight = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeCategory, setActiveCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddingToCart, setIsAddingToCart] = useState({});
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      setIsMobileOrTablet(window.innerWidth <= 1024);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: products.length > 4,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: !isMobileOrTablet,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    arrows: true,
    responsive: [
      {
        breakpoint: 1800,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: products.length > 4
        }
      },
      {
        breakpoint: 1440,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: products.length > 4,
          centerMode: false
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: products.length > 2,
          dots: true,
          autoplay: false,
          centerMode: false,
          centerPadding: '0'
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: products.length > 2,
          dots: true,
          arrows: false,
          centerMode: false,
          centerPadding: '0',
          autoplay: false
        }
      }
    ]
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_URL}/categories`);
        if (response.data && response.data.categories) {
          const mainCategories = response.data.categories.filter(cat => !cat.parent_id);
          setCategories(mainCategories);
          if (mainCategories.length > 0) {
            setActiveCategory(mainCategories[0]._id);
          }
        } else {
          setError('Invalid category data received from server');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Failed to load categories. Please try again later.');
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!activeCategory) return;
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${API_URL}/products/category/${activeCategory}`);
        
        if (response.data && response.data.success && Array.isArray(response.data.products)) {
          const validProducts = response.data.products.filter(product => 
            product && 
            product.name && 
            product.images && 
            Array.isArray(product.images) && 
            product.images.length > 0 &&
            product.slug
          );
          setProducts(validProducts.slice(0, 6));
        } else {
          setError('Invalid product data received from server');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeCategory]);

  const renderProductImage = (product) => {
    if (!product.images || !Array.isArray(product.images) || product.images.length === 0) {
      return <div className="ps-product-image placeholder">No image available</div>;
    }
    return (
      <div className="ps-product-image">
        <img src={product.images[0]} alt={product.name} loading="lazy" />
      </div>
    );
  };

  const showCartSuccessNotification = (product, selectedVariant) => {
    toast.custom((t) => (
      <div className="custom-toast-content">
        <div className="product-info">
          <img 
            src={product.images?.[0]} 
            alt={product.name} 
            className="product-image" 
          />
          <div className="product-details">
            <h4>{product.name}</h4>
            <p className="variant">{selectedVariant?.name}</p>
            <p className="price">₹{selectedVariant?.price}</p>
          </div>
        </div>
        <div className="action-buttons">
          <button 
            className="view-cart-btn" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toast.dismiss(t);
              navigate('/cart');
            }}
          >
            View Cart
          </button>
          <button 
            className="buy-now-btn" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toast.dismiss(t);
              navigate('/checkout');
            }}
          >
            Buy Now
          </button>
        </div>
      </div>
    ), {
      duration: 2000,
      position: 'top-right',
      className: 'cart-notification-toast'
    });
  };

  const handleAddToCart = async (product, e) => {
    e.preventDefault(); // Prevent navigation
    
    try {
      setIsAddingToCart(prev => ({ ...prev, [product._id]: true }));

      const userString = localStorage.getItem('user');
      const selectedVariant = product.variants?.[0];
      
      if (!selectedVariant) {
        toast.error('Product not available', { position: 'bottom-right' });
        return;
      }

      if (selectedVariant.stock_quantity < 1) {
        toast.error('Product is out of stock', { position: 'bottom-right' });
        return;
      }
      
      // Prepare product data with all necessary fields
      const productData = {
        _id: product._id,
        name: product.name,
        description: product.description,
        image_urls: product.images,
        variants: product.variants,
        slug: product.slug
      };
      
      if (!userString) {
        const updatedCart = addToGuestCart(
          productData,
          selectedVariant,
          1
        );
        
        const newCount = updatedCart.reduce((sum, item) => sum + item.quantity, 0);
        dispatch(updateCartItemCount(newCount));
        
        showCartSuccessNotification(product, selectedVariant);
        return;
      }

      const user = JSON.parse(userString);
      const response = await axios.post(`${API_URL}/cart/add`, {
        user_id: user.user.id,
        product_id: product._id,
        variant_name: selectedVariant.name,
        quantity: 1,
        image_url: product.images?.[0]
      });

      if (response.data.cartItem) {
        showCartSuccessNotification(product, selectedVariant);
        const newCount = await fetchCartItemCount(user.user.id);
        dispatch(updateCartItemCount(newCount));
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      toast.error(error.response?.data?.message || 'Failed to add to cart', { position: 'bottom-right' });
    } finally {
      setIsAddingToCart(prev => ({ ...prev, [product._id]: false }));
    }
  };

  const renderAddToCartButton = (product) => {
    return (
      <button 
        className="ps-add-to-cart-btn"
        onClick={(e) => handleAddToCart(product, e)}
        disabled={isAddingToCart[product._id]}
      >
        {isAddingToCart[product._id] ? 'Adding...' : 'Add to Cart'}
      </button>
    );
  };

  const fetchCartItemCount = async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/cart/count/${userId}`);
      return response.data.count;
    } catch (error) {
      console.error('Error fetching cart count:', error);
      return 0;
    }
  };

  return (
    <section className="ps-product-spotlight">
      <SectionTitle title="IN THE SPOTLIGHT" />
      
      {categories.length > 0 && (
        <div className="ps-category-tabs-container">
          <div className="ps-category-tabs">
            {categories.map(category => (
              <button
                key={category._id}
                className={`ps-category-tab ${activeCategory === category._id ? 'active' : ''}`}
                onClick={() => setActiveCategory(category._id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && <div className="ps-error-message">{error}</div>}

      {loading ? (
        <div className="ps-loading-skeleton">
          {[1, 2].map(i => (
            <div key={i} className="ps-product-card ps-skeleton">
              <div className="ps-product-image"></div>
              <div className="ps-product-info">
                <div className="ps-skeleton-line"></div>
                <div className="ps-skeleton-line"></div>
                <div className="ps-skeleton-line ps-short"></div>
              </div>
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="ps-products-slider">
          <Slider {...sliderSettings}>
            {products.map(product => (
              <div key={product._id} className="ps-slider-item">
                <div className="ps-product-card-spot">
                  <Link to={`/product/${product.slug}`} className="ps-product-link">
                    {renderProductImage(product)}
                    <div className="ps-product-info">
                      <h3 className="ps-product-name">{product.name}</h3>
                      <p className="ps-product-description">{product.tag}</p>
                      <div className="ps-product-price">
                        <span className="ps-current-price">₹{product.price}</span>
                        {product.originalPrice && (
                          <span className="ps-original-price">₹{product.originalPrice}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                  {renderAddToCartButton(product)}
                </div>
              </div>
            ))}
          </Slider>
        </div>
      ) : (
        <div className="ps-no-products">No products available in this category</div>
      )}
    </section>
  );
};

export default ProductSpotlight;
