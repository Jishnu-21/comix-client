import React from 'react';
import { Link } from 'react-router-dom';
import CartProduct from './CartProduct';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import '../../Assets/Css/Cart/MobileCart.scss';

const MobileCart = ({ 
  cartProducts, 
  handleQuantityChange, 
  handleDelete,
  subtotal,
  itemCount,
  onProceedToBuy 
}) => {
  const formattedSubtotal = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(subtotal);

  return (
    <div className="mobile-cart">
      <div className="mobile-cart-header">
        <div className="header-content">
          <Link to="/" className="back-button">
            <FontAwesomeIcon icon={faArrowLeft} />
          </Link>
          <div className="title-container">
            <h1 className="cart-title">Shopping Cart</h1>
            <div className="cart-count">
              <FontAwesomeIcon icon={faShoppingCart} />
              <span>{itemCount}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="cart-items-section">
        {cartProducts.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">
              <FontAwesomeIcon icon={faShoppingCart} size="3x" />
            </div>
            <p className="empty-message">Your cart is empty</p>
            <Link to="/" className="continue-shopping-btn">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="cart-items-container">
            {cartProducts.map((product) => (
              <CartProduct
                key={`${product.product_id}-${product.variant_name}`}
                product={product}
                onQuantityChange={handleQuantityChange}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {cartProducts.length > 0 && (
        <div className="cart-summary">
          <div className="summary-content">
            <div className="summary-row">
              <span>Subtotal ({itemCount} items)</span>
              <span className="total-amount">{formattedSubtotal}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span className="shipping">Free</span>
            </div>
          </div>
          <button 
            className="checkout-button"
            onClick={onProceedToBuy}
          >
            Proceed to Checkout
          </button>
        </div>
      )}

      {/* Recommended Products Section */}
      <div className="recommended-section">
        <h2>You May Also Like</h2>
        <div className="recommended-products">
          {cartProducts.slice(0, 4).map((product) => (
            <CartProduct
              key={`recommended-${product.product_id}-${product.variant_name}`}
              product={product}
              isRecommended={true} // Add this prop to handle recommended product styling
              onQuantityChange={handleQuantityChange}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileCart;
