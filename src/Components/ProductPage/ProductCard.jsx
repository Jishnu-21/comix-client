import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { toast } from 'sonner';
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
      const fallbackSlug = product.name.toLowerCase().replace(/\s+/g, '-');
      navigate(`/product/${fallbackSlug}`);
    }
  };

  const defaultVariant = product.variants.find(v => v.name === '50ml') || product.variants[0];
  const isOutOfStock = product.variants.every(v => v.stock_quantity === 0);
  const { name, image_urls, variants, category, rating = 4.8 } = product;
  const price = variants && variants.length > 0 ? variants[0].price : 'N/A';

  return (
    <div className="col-xl-4 col-lg-4 col-md-6 col-sm-6 mb-4">
      <div 
        className={`bg-white relative mb-4 cursor-pointer group rounded-lg shadow-sm 
                   hover:shadow-md transition-shadow duration-300 
                   ${isOutOfStock ? 'opacity-70 pointer-events-none' : ''}`}
        onClick={handleCardClick}
      >
        {/* Image Container */}
        <div className="relative w-full aspect-square bg-gray-50 rounded-t-lg overflow-hidden">
          <img
            src={image_urls?.[0]}
            className="w-full h-full object-cover transition-transform duration-500 
                     group-hover:scale-105"
            alt={name}
          />
          <button 
            className={`absolute top-3 right-3 p-2  backdrop-blur-sm rounded-full
                     shadow-sm transition-all duration-200 
                      active:scale-95 z-10 
                     ${isOutOfStock ? 'pointer-events-auto' : ''}`}
            onClick={handleFavoriteClick}
          >
            <FontAwesomeIcon 
              icon={faHeart} 
              className={`text-xl transition-colors duration-300 
                       ${isFavorite ? 'text-red-500' : 'text-gray-500 hover:text-red-400'}`}
            />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Category */}
          <div className="text-sm text-gray-500 mb-1.5 capitalize tracking-wide">{category}</div>
          
          {/* Title */}
          <h3 className="text-[16px] leading-normal font-bold text-gray-800 mb-2.5 
                       min-h-[48px] line-clamp-2 font-poppins group-hover:text-yellow-600 
                       transition-colors duration-200">
            {name}
          </h3>
          
          {/* Price and Rating */}
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium text-gray-900">
              ${Number(price).toFixed(2)}
            </span>
            <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-full">
              <FontAwesomeIcon icon={faStar} className="text-yellow-400 text-sm" />
              <span className="text-sm font-medium text-gray-600">{rating}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;