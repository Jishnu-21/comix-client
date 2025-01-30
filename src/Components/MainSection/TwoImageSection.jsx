// TwoImageSection.jsx
import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import leftImage from '../../Assets/Image/secondbanner1.webp';
import rightImage from '../../Assets/Image/secondbanner2.webp';

const TwoImageSection = () => {
  const isMobile = window.innerWidth <= 768;

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000
  };

  const images = [
    { src: leftImage, alt: "Left Image" },
    { src: rightImage, alt: "Right Image" }
  ];

  return (
    <section className="two-image-section">
      {isMobile ? (
        <div className="mobile-slider-container">
          <Slider {...sliderSettings}>
            {images.map((image, index) => (
              <div key={index} className="slide-item">
                <img src={image.src} alt={image.alt} className="responsive-image" />
              </div>
            ))}
          </Slider>
        </div>
      ) : (
        <div className="two-images-container">
          <div className="image-wrapper">
            <img src={leftImage} alt="Left Image" className="responsive-image" />
          </div>
          <div className="image-wrapper">
            <img src={rightImage} alt="Right Image" className="responsive-image" />
          </div>
        </div>
      )}
    </section>
  );
};

export default TwoImageSection;