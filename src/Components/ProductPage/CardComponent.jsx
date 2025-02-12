import React from 'react';
import { Link } from 'react-router-dom';

const CardComponent = ({ image, title, price, category, slug }) => {
  return (
    <Link 
      to={`/product/${slug || title}`} 
      className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 
                overflow-hidden no-underline active:opacity-90 touch-manipulation"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={image}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          alt={title}
          loading="lazy"
        />
      </div>
      <div className="p-3">
        <div className="text-sm text-gray-500 mb-1.5 capitalize tracking-wide">
          {category || 'Uncategorized'}
        </div>
        <h3 className="text-[15px] leading-snug font-bold text-gray-800 mb-2 
                     min-h-[42px] line-clamp-2 font-poppins">
          {title}
        </h3>
        <div className="text-base font-medium text-gray-900">
          ${typeof price === 'number' ? price.toFixed(2) : price}
        </div>
      </div>
    </Link>
  );
};

export default CardComponent;
