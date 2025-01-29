import React from 'react';
import { Link } from 'react-router-dom';
import '../../Assets/Css/ProductPage/CardComponent.scss';

const CardComponent = ({ image, title, price, category, slug }) => {
  return (
    <Link to={`/product/${slug || title}`} className="product-card">
      <div className="card-image-container">
        <img
          src={image}
          className="card-image"
          alt={title}
        />
      </div>
      <div className="card-content">
        <div className="price-tag">${price}.00</div>
        <h3 className="card-title">{title}</h3>
        <p className="card-description">{category || 'Lorem ipsum dolor sit amet'}</p>
      </div>
    </Link>
  );
};

export default CardComponent;
