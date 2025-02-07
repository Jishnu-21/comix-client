import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { API_URL } from '../../config/api';
import { updateCartItemCount } from '../../features/cart/cartSlice';
import { addToGuestCart, getGuestCartCount } from '../../services/guestCartService';
import '../../Assets/Css/ProductDetail/RelatedProducts.scss';

const RelatedProducts = ({ relatedProducts, onAddToCart }) => {
  const dispatch = useDispatch();
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [discountedPrice, setDiscountedPrice] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    // Initialize with all products selected
    const initialSelected = relatedProducts
      .filter(item => item.product && item.product.variants?.[0]?.price)
      .map(item => item.product._id);
    setSelectedProducts(initialSelected);
  }, [relatedProducts]);

  useEffect(() => {
    // Calculate total price of selected products
    const total = selectedProducts.reduce((sum, productId) => {
      const product = relatedProducts.find(item => item.product._id === productId);
      if (product?.product?.variants?.[0]?.price) {
        return sum + product.product.variants[0].price;
      }
      return sum;
    }, 0);
    setTotalPrice(total);
    
    // Set discounted price to 1099 if 3 or more products are selected
    setDiscountedPrice(selectedProducts.length >= 3 ? 1099 : total);
  }, [selectedProducts, relatedProducts]);

  const fetchCartItemCount = async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/cart/count/${userId}`);
      return response.data.count;
    } catch (error) {
      console.error('Error fetching cart count:', error);
      return 0;
    }
  };

  const handleProductSelect = (productId) => {
    setSelectedProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const handleAddToCart = async () => {
    try {
      setIsAddingToCart(true);

      // Get the selected products' details
      const selectedProductDetails = relatedProducts
        .filter(item => selectedProducts.includes(item.product._id))
        .map(item => {
          const product = item.product;
          // Log the raw product data to debug
          console.log('Raw product data:', product);
          
          // Create a clean product object with all fields
          const cleanProduct = {
            _id: product._id,
            name: product.name,
            description: product.description || '',
            best_results_description: product.best_results_description || '',
            image_urls: product.image_urls || [],
            variants: product.variants || [],
            taglines: typeof product.taglines === 'string' ? product.taglines.split(',').map(t => t.trim()) : [],
            ingredients: product.ingredients || '',
            additional_info: product.additional_info || '',
            faqs: Array.isArray(product.faqs) ? product.faqs : [],
            how_to_use: product.how_to_use || '',
            functions: product.functions || ''
          };

          console.log('Clean product data:', cleanProduct);
          return cleanProduct;
        });

      if (selectedProductDetails.length === 0) return;

      console.log('Selected Product Details:', selectedProductDetails);

      const userString = localStorage.getItem('user');
      const firstProduct = selectedProductDetails[0];
      
      if (!userString) {
        // Handle guest cart
        for (const product of selectedProductDetails) {
          // Ensure product has variants
          if (!product.variants || product.variants.length === 0) {
            console.error('Product has no variants:', product);
            continue;
          }

          const variant = product.variants[0];
          
          try {
            // Add to guest cart exactly like ProductDetailInfo
            const updatedCart = addToGuestCart(
              product,
              variant,
              1
            );
            
            const newCount = updatedCart.reduce((sum, item) => sum + item.quantity, 0);
            dispatch(updateCartItemCount(newCount));
          } catch (error) {
            console.error('Error adding to guest cart:', error);
          }
        }
      } else {
        // Handle logged in user
        const user = JSON.parse(userString);
        for (const product of selectedProductDetails) {
          await axios.post(`${API_URL}/cart/add`, {
            user_id: user.user.id,
            product_id: product._id,
            variant_name: product.variants[0].name,
            quantity: 1
          });
        }
        const newCount = await fetchCartItemCount(user.user.id);
        dispatch(updateCartItemCount(newCount));
      }

      // Notify parent about cart addition for notification
      if (onAddToCart) {
        onAddToCart(firstProduct);
      }
    } catch (error) {
      console.error('Add to cart error:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (!relatedProducts || relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="related-products">
      <div className="related-products__header">
        <h2 className="related-products__title">
          Frequently Brought Together
        </h2>
      </div>
      
      <div className="related-products__grid">
        {relatedProducts.map((item, index) => {
          if (!item.product || !item.product.variants?.[0]?.price) {
            return null;
          }

          const productImage = item.product.image_urls?.[0] || '/placeholder-image.jpg';
          const price = item.product.variants[0].price;
          const isSelected = selectedProducts.includes(item.product._id);

          return (
            <div 
              key={item.product._id || index}
              className={`related-product-card ${isSelected ? 'selected' : ''}`}
              onClick={() => handleProductSelect(item.product._id)}
            >
              <div className="related-product-card__image">
                <img 
                  src={productImage}
                  alt={item.product.name || 'Related Product'} 
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = '/placeholder-image.jpg';
                  }}
                />
              </div>
              <div className="related-product-card__content">
                <h3 className="related-product-card__title">
                  {item.product.name}
                </h3>
                <p className="related-product-card__price">
                  Rs. {price.toFixed(2)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {selectedProducts.length > 0 && (
        <div className="related-products-footer">
          <button 
            className="related-products-footer__button"
            onClick={handleAddToCart}
            disabled={isAddingToCart}
          >
            <span>Add To Cart</span>
            <span>
              <span className="discounted-price">Rs. {discountedPrice.toFixed(2)}</span>
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default RelatedProducts;
