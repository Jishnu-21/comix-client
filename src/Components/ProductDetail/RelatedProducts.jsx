import React from 'react';
import { Link } from 'react-router-dom';
import '../../Assets/Css/ProductDetail/RelatedProducts.scss';

const RelatedProducts = ({ relatedProducts, bestResultsDescription }) => {
  if (!relatedProducts || relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="related-products">
      <div className="related-products__header">
        <h2 className="related-products__title">
          {bestResultsDescription || "Best Results When Used Together"}
        </h2>
      </div>
      
      <div className="related-products__grid">
        {relatedProducts.map((item, index) => {
          // Check if product exists and has required data
          if (!item.product || !item.description) {
            return null;
          }

          // Get the default image or placeholder
          const productImage = item.product.image_urls && item.product.image_urls.length > 0
            ? item.product.image_urls[0]
            : '/placeholder-image.jpg'; // Add a placeholder image to your public folder

          // Get the default variant price if available
          const price = item.product.variants && item.product.variants.length > 0
            ? item.product.variants[0].price
            : null;

          return (
            <Link 
              to={`/product/${item.product.slug}`} 
              key={item.product._id || index} 
              className="related-product-card"
            >
              <div className="related-product-card__image">
                <img 
                  src={productImage}
                  alt={item.product.name || 'Related Product'} 
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = '/placeholder-image.jpg'; // Fallback image on error
                  }}
                />
              </div>
              <div className="related-product-card__content">
                <h3 className="related-product-card__title">
                  {item.product.name || 'Product Name Unavailable'}
                </h3>
                <p className="related-product-card__description">
                  {item.description}
                </p>
                {price && (
                  <p className="related-product-card__price">
                    ₹{price}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default RelatedProducts;
