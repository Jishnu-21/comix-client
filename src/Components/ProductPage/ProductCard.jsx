import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { toast } from 'sonner';
import '../../Assets/Css/ProductPage/ProductCard.scss';
import { API_URL } from '../../config/api';

const ProductCard = ({ product }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      checkIfFavorite(user.user.id, product._id);
    }
  }, [product]);

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

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      toast.error('Please log in to manage favorites');
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
        toast.success('Product removed from favorites!');
      } else {
        await axios.post(`${API_URL}/favorites/add`, {
          user_id: user.user.id,
          product_id: product._id
        });
        setIsFavorite(true);
        toast.success('Product added to favorites!');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorites. Please try again.');
    }
  };

  const handleCardClick = () => {
    if (product.slug) {
      navigate(`/product/${product.slug}`);
    } else {
      // Fallback to name if slug is not available
      const fallbackSlug = product.name.toLowerCase().replace(/\s+/g, '-');
      navigate(`/product/${fallbackSlug}`);
    }
  };

  // Find the 50ml variant or the first available variant
  const defaultVariant = product.variants.find(v => v.name === '50ml') || product.variants[0];

  // Check if all variants are out of stock
  const isOutOfStock = product.variants.every(v => v.stock_quantity === 0);

  const { name, image_urls, variants, category, rating = 4.8, slug } = product;
  const price = variants && variants.length > 0 ? variants[0].price : 'N/A';

  return (
    <div className="col-xl-4 col-lg-4 col-md-6 col-sm-6 mb-4">
      <div className="product-card" onClick={handleCardClick}>
        <div className="card-image-container">
          <img
            src={image_urls?.[0]}
            className="card-image"
            alt={name}
          />
          <button className="wishlist-button" onClick={handleFavoriteClick}>
            <FontAwesomeIcon icon={faHeart} />
          </button>
        </div>
        <div className="card-content">
          <div className="category">{category}</div>
          <h3 className="product-title">{name}</h3>
          <div className="price-rating">
            <span className="price">${Number(price).toFixed(2)}</span>
            <div className="rating">
              <FontAwesomeIcon icon={faStar} className="star-icon" />
              <span>{rating}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;