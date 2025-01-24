import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../Assets/Css/Cart/RecommendedProduct.scss';
import axios from 'axios';
import { API_URL } from '../../config/api';
import { useDispatch } from 'react-redux';
import { updateCartItemCount } from '../../features/cart/cartSlice';
import { addToGuestCart } from '../../services/guestCartService';
import { toast } from 'sonner';

const RecommendedProduct = ({ product, onCartUpdate }) => {
  const dispatch = useDispatch();
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const url = `${API_URL}/reviews/product/${product._id}/reviews?page=1&limit=5`;
        const response = await axios.get(url);
        const reviews = response.data.reviews;
        setTotalReviews(response.data.totalReviews || 0);

        if (reviews.length > 0) {
          const avgRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
          setAverageRating(avgRating.toFixed(1));
        } else {
          setAverageRating(0);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setError('Failed to fetch reviews. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (product._id) {
      fetchReviews();
    }
  }, [product._id]);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <span 
        key={i} 
        className={i < Math.round(rating) ? 'star' : 'empty-star'}
      >
        ★
      </span>
    ));
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

  const handleAddToCart = async () => {
    if (isAddingToCart) return;
    
    try {
      setIsAddingToCart(true);
      const selectedVariant = product.variants[0];

      if (!selectedVariant) {
        toast.error('No variant available for this product', { position: 'bottom-right' });
        return;
      }

      if (selectedVariant.stock_quantity < 1) {
        toast.error('Product is out of stock', { position: 'bottom-right' });
        return;
      }

      const userString = localStorage.getItem('user');
      
      if (!userString) {
        // Handle guest cart
        const updatedCart = addToGuestCart(
          product,
          selectedVariant,
          1
        );
        
        const newCount = updatedCart.reduce((sum, item) => sum + item.quantity, 0);
        dispatch(updateCartItemCount(newCount));
        
        toast.success('Added to cart successfully!', { position: 'bottom-right' });
        // Trigger cart refresh
        if (onCartUpdate) onCartUpdate();
        return;
      }

      // Handle logged-in user cart
      const user = JSON.parse(userString);
      const response = await axios.post(`${API_URL}/cart/add`, {
        user_id: user.user.id,
        product_id: product._id,
        variant_name: selectedVariant.name,
        quantity: 1
      });

      if (response.data.cartItem) {
        toast.success('Added to cart successfully!', { position: 'bottom-right' });
        const newCount = await fetchCartItemCount(user.user.id);
        dispatch(updateCartItemCount(newCount));
        // Trigger cart refresh
        if (onCartUpdate) onCartUpdate();
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      toast.error(error.response?.data?.message || 'Failed to add to cart', { position: 'bottom-right' });
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Check if variants exist and have at least one variant
  const price = product.variants && product.variants.length > 0 
    ? product.variants[0].price.toFixed(2) 
    : 'N/A';

  return (
    <div className="recommended-product">
      <div className="product-image">
        <img 
          src={product.image_urls[0] || 'placeholder-image-url'} 
          alt={product.name}
        />
      </div>
      <div className="product-details">
        <h6 className="product-title">{product.name}</h6>
        <div className="product-rating">
          {isLoading ? (
            <span>Loading...</span>
          ) : error ? (
            <span>{error}</span>
          ) : (
            <>
              {renderStars(averageRating)}
              <span className="ms-1">({totalReviews})</span>
            </>
          )}
        </div>
        <p className="product-price">Rs: {price}</p>
        <button 
          onClick={handleAddToCart}
          className="btn btn-warning"
          disabled={isAddingToCart}
        >
          {isAddingToCart ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default RecommendedProduct;
