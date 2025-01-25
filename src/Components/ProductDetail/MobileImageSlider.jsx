import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import '../../Assets/Css/ProductDetail/MobileImageSlider.scss';

const MobileImageSlider = ({ images }) => {
  const [showSwipeHint, setShowSwipeHint] = useState(true);

  useEffect(() => {
    // Hide swipe hint after 3 seconds
    const timer = setTimeout(() => {
      setShowSwipeHint(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="mobile-image-slider">
      <Swiper
        modules={[Pagination, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        pagination={{ 
          clickable: true,
          dynamicBullets: true
        }}
        loop={true}
        effect="fade"
        fadeEffect={{
          crossFade: true
        }}
        className="product-swiper"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="swiper-slide-content">
              <img src={image} alt={`Product view ${index + 1}`} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      {showSwipeHint && (
        <div className="swipe-hint">
          <div className="swipe-icon"></div>
          <span>Swipe to view more</span>
        </div>
      )}
    </div>
  );
};

export default MobileImageSlider;
