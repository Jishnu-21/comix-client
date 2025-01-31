import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Slider from 'react-slick';
import SectionTitle from './SectionTitle';
import { API_URL } from '../config/api';
import '../Assets/Css/ProductSpotlight.scss';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ProductSpotlight = () => {
  const [activeCategory, setActiveCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const sliderSettings = {
    dots: true,
    infinite: products.length > 4,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
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
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: products.length > 3
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: products.length > 2,
          dots: true
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
          centerPadding: '0'
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
            product.images.length > 0
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

  const handleAddToCart = (productId) => {
    // Add to cart logic here
    console.log('Adding to cart:', productId);
  };

  const getActiveCategorySlug = () => {
    const category = categories.find(cat => cat._id === activeCategory);
    return category ? category.slug : '';
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
                  <Link to={`/product/${product._id}`} className="ps-product-link">
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
                  <button 
                    className="ps-add-to-cart-btn"
                    onClick={() => handleAddToCart(product._id)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      ) : (
        <div className="ps-no-products">No products available in this category</div>
      )}

      <div className="ps-view-all-container">
        <Link to={`/category/${getActiveCategorySlug()}`} className="ps-view-all-btn">
          View All
        </Link>
      </div>
    </section>
  );
};

export default ProductSpotlight;
