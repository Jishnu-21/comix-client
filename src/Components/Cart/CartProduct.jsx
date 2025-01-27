import React from 'react';
import '../../Assets/Css/Cart/CartProduct.scss';

const CartProduct = ({ product, onQuantityChange, onDelete }) => {
  const isMobile = window.innerWidth <= 768;

  if (!product) {
    return null;
  }

  // Handle both guest cart and logged-in user cart structures
  const productId = product.product_id?._id || product.product_id;
  
  // Handle display data for both structures
  const displayData = product._display || {
    name: product.product_id?.name || 'Unknown Product',
    image_urls: product.product_id?.image_urls || [],
    description: product.product_id?.description || 'No description available',
    variants: product.product_id?.variants || []
  };
  
  // Log the product and display data
  console.log('Product data:', product);
  console.log('Display data:', displayData);

  if (isMobile) {
    return (
      <div className="cart-product-mobile">
        <div className="product-image">
          <img src={displayData.image_urls?.[0] || '/placeholder-image.jpg'} alt={displayData.name} />
        </div>
        <div className="product-details">
          <h3 className="product-name">{displayData.name}</h3>
          <div className="product-price">₹{product.price}</div>
          <div className="quantity-controls">
            <button
              onClick={() => onQuantityChange({
                product_id: productId,
                variant_name: product.variant_name,
                product_name: displayData.name,
                quantity: product.quantity - 1,
                price: product.price,
                image_urls: displayData.image_urls,
                description: displayData.description,
                variants: displayData.variants,
                total_price: (product.quantity - 1) * product.price
              })}
              disabled={product.quantity <= 1}
              className="quantity-btn"
            >
              -
            </button>
            <span className="quantity">{product.quantity}</span>
            <button
              onClick={() => onQuantityChange({
                product_id: productId,
                variant_name: product.variant_name,
                product_name: displayData.name,
                quantity: product.quantity + 1,
                price: product.price,
                image_urls: displayData.image_urls,
                description: displayData.description,
                variants: displayData.variants,
                total_price: (product.quantity + 1) * product.price
              })}
              className="quantity-btn"
            >
              +
            </button>
            <button
              onClick={() => onDelete(productId, product.variant_name)}
              className="remove-btn"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Define maxQuantity and create quantity options array
  const maxQuantity = 9;
  const quantityOptions = Array.from({ length: maxQuantity }, (_, i) => i + 1);

  // Define handleQuantityChange function
  const handleQuantityChange = (newQuantity) => {
    onQuantityChange({
      product_id: productId,
      variant_name: product.variant_name,
      product_name: displayData.name,
      quantity: newQuantity,
      price: product.price,
      image_urls: displayData.image_urls,
      description: displayData.description,
      variants: displayData.variants,
      total_price: newQuantity * product.price
    });
  };

  // Define handleDelete function
  const handleDelete = (e) => {
    e.preventDefault();
    if (!productId) {
      console.error('No product ID found:', product);
      return;
    }
    
    console.log('Deleting product:', {
      productId,
      variant_name: product.variant_name,
      product: product
    });
    
    onDelete(productId, product.variant_name);
  };

  return (
    <div className="cart-product mb-4">
      {/* Continue Shopping Link - Only show for first product */}
      {product.isFirstProduct && (
        <div className="continue-shopping-link d-none d-md-block">
          {/* <Link to="/">
            <FontAwesomeIcon icon={faArrowLeft} /> continue shopping
          </Link> */}
        </div>
      )}

      <div className="row">
        {/* Product Image */}
        <div className="col-2">
          <img 
            src={displayData.image_urls?.[0] || '/placeholder-image.jpg'} 
            alt={displayData.name} 
            className="img-fluid" 
          />
        </div>

        {/* Product Details */}
        <div className="col-7">
          <h5 className="cart-product-title">{displayData.name}</h5>
          <p className="cart-product-variant mb-2">{product.variant_name}</p>
          
          <div className="cart-product-actions">
            <div className="quantity-selector me-3">
              <label className="me-2">Qty:</label>
              <select 
                value={product.quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                className="form-select-sm"
              >
                {quantityOptions.map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
            <div className="action-links">
              <a href="#" onClick={handleDelete} className="me-3">Delete</a>
              <a href="#" className="me-3">Save for later</a>
              <a href="#" className="me-3">See more like this</a>
            </div>
          </div>

          <div className="cart-product-description mt-3">
           <span className='fw-bold'>DESCRIPTION:</span>{displayData.description}
          </div>
        </div>

        {/* Price Details */}
        <div className="col-3 price-column">
          <div className="price-info">
            <p className="cart-product-price mb-1">₹{product.price.toFixed(2)}</p>
            <p className="original-price mb-1">M.R.P: ₹{(product.price * 1.25).toFixed(2)}</p>
            <p className="discount mb-0">25% off</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartProduct;
