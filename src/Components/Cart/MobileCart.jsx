import React from 'react';
import { Link } from 'react-router-dom';
import CartProduct from './CartProduct';
import OrderSummary from './OrderSummary';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import '../../Assets/Css/Cart/MobileCart.scss';

const MobileCart = ({ 
  cartProducts, 
  handleQuantityChange, 
  handleDelete,
  subtotal,
  itemCount,
  onProceedToBuy,
  couponCode,
  setCouponCode,
  applyCoupon,
  couponDiscount,
  shippingCost,
  finalAmount
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
          <div className="mobile-order-summary">
            <OrderSummary
              subtotal={subtotal}
              itemCount={itemCount}
              onProceedToBuy={onProceedToBuy}
              couponCode={couponCode}
              setCouponCode={setCouponCode}
              applyCoupon={applyCoupon}
              couponDiscount={couponDiscount}
              shippingCost={shippingCost}
              finalAmount={finalAmount}
              isMobile={true}
            />
          </div>
        </div>
      )}

      {/* Recommended Products Section */}
    </div>
  );
};

export default MobileCart;
