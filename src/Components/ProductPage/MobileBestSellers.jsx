import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
import CardComponent from './CardComponent';
import 'swiper/css';
import 'swiper/css/free-mode';
import '../../Assets/Css/ProductPage/MobileBestSellers.scss';

const MobileBestSellers = ({ bestSellers }) => {
  return (
    <div className="mobile-best-sellers">
      <Swiper
        modules={[FreeMode]}
        spaceBetween={10}
        slidesPerView="auto"
        freeMode={true}
        className="best-sellers-swiper"
      >
        {bestSellers.map((product) => (
          <SwiperSlide key={product._id}>
            <CardComponent
              image={product.image_urls[0]}
              title={product.name}
              price={product.variants?.[0]?.price || 'N/A'}
              category={product.category_id?.name || 'Uncategorized'}
              slug={product.slug}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default MobileBestSellers;
