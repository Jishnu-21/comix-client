import React, { useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import '../../Assets/Css/Components/ReelModal.scss';

const ReelModal = ({ isOpen, onClose, reel }) => {
  // Handle body scroll lock
  useEffect(() => {
    const body = document.body;
    if (isOpen) {
      body.style.overflow = 'hidden';
      body.style.paddingRight = '15px';
    }

    return () => {
      body.style.overflow = '';
      body.style.paddingRight = '';
    };
  }, [isOpen]);

  const handleClose = () => {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    onClose();
  };

  if (!isOpen || !reel) return null;

  return (
    <div className="reel-modal-overlay" onClick={handleClose}>
      <div className="reel-modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={handleClose}>
          <IoClose />
        </button>
        
        <div className="reel-content">
          <div className="video-container">
            <video 
              src={reel.videoUrl} 
              autoPlay 
              loop 
              playsInline
              muted
              className="reel-video"
            />
          </div>
          
          <div className="reel-info">
            <h3 className="reel-title">{reel.title}</h3>
            <p className="reel-description">{reel.description}</p>
            
            {reel.products && reel.products.length > 0 && (
              <div className="featured-products">
                <h4>Featured Products</h4>
                <div className="products-list">
                  {reel.products.map((product, index) => (
                    <div key={index} className="product-item">
                      <img src={product.image} alt={product.name} />
                      <div className="product-details">
                        <h5>{product.name}</h5>
                        <p className="price">₹{product.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReelModal;
