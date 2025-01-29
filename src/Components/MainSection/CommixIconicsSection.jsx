import React, { useEffect, useRef } from 'react';
import Slider from 'react-slick';
import { gsap } from 'gsap';
import SectionTitle from '../SectionTitle';

const CommixIconicsSection = () => {
  const sliderRef = useRef(null);

  const productSliderSettings = {
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: '0',
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: false,
    cssEase: 'ease',
    initialSlide: 2, // Start with second slide
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
          centerMode: true,
          centerPadding: '0',
          dots: false,
          arrows: false
        }
      }
    ]
  };

  const products = [
    { name: 'Custom Conditioner', image: 'iconic1.png', price: '$23.00' },
    { name: 'Custom Shampoo', image: 'iconic2.png', price: '$23.00' },
    { name: 'Custom Cream', image: 'iconic3.png', price: '$23.00' }
  ];

  useEffect(() => {
    const slider = sliderRef.current;

    const handleSlideChange = () => {
      const slides = slider.querySelectorAll('.product-cards');
      slides.forEach((slide, index) => {
        const isActive = index === 1; // Center slide
        gsap.to(slide, {
          scale: isActive ? 1.2 : 1,
          duration: 0.5,
          ease: 'power2.out'
        });
      });
    };

    handleSlideChange(); // Initial call

    slider.addEventListener('afterChange', handleSlideChange);
    return () => {
      slider.removeEventListener('afterChange', handleSlideChange);
    };
  }, []);

  return (
    <section className="commix-iconics-section" ref={sliderRef} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
     <SectionTitle title="Best Picks for You" />

      <div className="slider-container">
        <Slider {...productSliderSettings}>
          {products.map((product, index) => (
            <div key={index} className="product-cards">
              <img src={require(`../../Assets/Image/${product.image}`)} alt={product.name} className="product-image" />
              <h4>HAIRCARE</h4>
              <h3>{product.name}</h3>
              <p>{product.price}</p>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default CommixIconicsSection;