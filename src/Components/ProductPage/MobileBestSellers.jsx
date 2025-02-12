import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
import CardComponent from './CardComponent';
import 'swiper/css';
import 'swiper/css/free-mode';

const MobileBestSellers = ({ bestSellers }) => {
  return (
    <div className="">
      <Swiper
        modules={[FreeMode]}
        spaceBetween={12}
        slidesPerView="auto"
        freeMode={true}
        className="!overflow-visible"
        wrapperClass="!items-stretch"
      >
        {bestSellers.slice(0, 4).map((product) => (
          <SwiperSlide 
            key={product._id}
            className="!w-[200px] md:!w-[220px]"
          >
            <div className="h-full">
              <CardComponent
                image={product.image_urls[0]}
                title={product.name}
                price={product.variants?.[0]?.price || 'N/A'}
                category={product.category_id?.name || 'Uncategorized'}
                slug={product.slug}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default MobileBestSellers;
