import React from 'react';

const CartProduct = ({ product, onQuantityChange, onDelete }) => {
  const isMobile = window.innerWidth <= 768;

  if (!product) return null;

  const productId = product.product_id?._id || product.product_id;
  
  const displayData = product._display || {
    name: product.product_id?.name || 'Unknown Product',
    image_urls: product.product_id?.image_urls || [],
    description: product.product_id?.description || 'No description available',
    variants: product.product_id?.variants || []
  };

  if (isMobile) {
    return (
      <div className="flex p-4 border-b border-gray-200 bg-white gap-4">
        <div className="w-20 h-20 flex-shrink-0">
          <img 
            src={displayData.image_urls?.[0] || '/placeholder-image.jpg'} 
            alt={displayData.name}
            className="w-full h-full object-cover rounded"
          />
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <h3 className="text-sm text-gray-800 m-0">{displayData.name}</h3>
          <div className="text-base font-bold text-red-700">₹{product.price}</div>
          <div className="flex items-center gap-2">
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
              className="w-6 h-6 border border-gray-300 rounded flex items-center justify-center bg-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              -
            </button>
            <span className="min-w-6 text-center">{product.quantity}</span>
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
              className="w-6 h-6 border border-gray-300 rounded flex items-center justify-center bg-white"
            >
              +
            </button>
            <button
              onClick={() => onDelete(productId, product.variant_name)}
              className="ml-auto text-sm text-gray-600 underline"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    );
  }

  const maxQuantity = 9;
  const quantityOptions = Array.from({ length: maxQuantity }, (_, i) => i + 1);

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

  const handleDelete = (e) => {
    e.preventDefault();
    if (!productId) {
      console.error('No product ID found:', product);
      return;
    }
    onDelete(productId, product.variant_name);
  };

  return (
    <div className="bg-white rounded-lg p-5 mb-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Product Image */}
        <div className="w-full md:w-1/6">
          <img 
            src={displayData.image_urls?.[0] || '/placeholder-image.jpg'} 
            alt={displayData.name} 
            className="w-full h-auto object-contain min-h-[140px]"
          />
        </div>

        {/* Product Details */}
        <div className="flex-1">
          <h5 className="text-base font-medium text-gray-900 mb-2">{displayData.name}</h5>
          <p className="text-sm text-gray-600 mb-2">{product.variant_name}</p>
          
          <div className="flex flex-wrap items-center gap-4 mt-4">
            <div className="flex items-center">
              <label className="text-sm text-gray-600 mr-2">Qty:</label>
              <select 
                value={product.quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                className="py-1 px-2 border border-gray-300 rounded-lg bg-gray-50 text-sm cursor-pointer hover:bg-gray-100 min-w-[60px]"
              >
                {quantityOptions.map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-wrap gap-4">
              <a href="#" onClick={handleDelete} className="text-sm text-cyan-700 hover:text-orange-700 hover:underline">Delete</a>
            </div>
          </div>

          <div className="text-sm text-gray-600 mt-3 text-left leading-relaxed hidden lg:block">
            <span className="font-bold">DESCRIPTION:</span> {displayData.description}
          </div>
        </div>

        {/* Price Details */}
        <div className="md:w-1/4">
          <div className="text-right md:text-right">
            <p className="text-lg font-medium text-gray-900 mb-1.5">₹{product.price.toFixed(2)}</p>
            <p className="text-sm text-gray-600 line-through mb-1.5">M.R.P: ₹{(product.price * 1.25).toFixed(2)}</p>
            <p className="text-sm text-red-600 font-medium">25% off</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartProduct;