import React, { useEffect, useRef, useState } from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import gsap from 'gsap';
import SectionTitle from '../SectionTitle';
import '../../Assets/Css/Home/DiscoverHaircare.scss';

const DiscoverHaircareSection = () => {
  const isMobile = window.innerWidth <= 768;
  const [activeIndex, setActiveIndex] = useState(null);
  const productRefs = useRef([]);
  const observerRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setActiveIndex(null);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
          gsap.fromTo(
            entry.target,
            { opacity: 0, y: 50 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: "power2.out",
            }
          );
          setHasAnimated(true);
        }
      });
    }, { threshold: 0.1 });

    productRefs.current.forEach(ref => {
      if (ref) {
        observerRef.current.observe(ref);
      }
    });

    return () => {
      productRefs.current.forEach(ref => {
        if (ref) {
          observerRef.current.unobserve(ref);
        }
      });
    };
  }, [hasAnimated]);

  const products = [
    { name: 'Custom Shampoo', image: 'primary.webp', category: 'HAIRCARE', price: '$23.00' },
    { name: 'Custom Conditioner', image: 'primary.webp', category: 'HAIRCARE', price: '$23.00' },
    { name: 'Custom Hair Mask', image: 'primary.webp', category: 'HAIRCARE', price: '$25.00' },
    { name: 'Custom Hair Oil', image: 'primary.webp', category: 'HAIRCARE', price: '$28.00' }
  ];

  const renderProductCard = (product, index) => (
    <div
      key={index}
      className="product-cards"
      ref={el => productRefs.current[index] = el}
      onMouseEnter={() => !isMobile && setActiveIndex(index)}
      onMouseLeave={() => !isMobile && setActiveIndex(null)}
    >
      <img
        src={require(`../../Assets/Image/${product.image}`)}
        alt={product.name}
        className="product-image"
      />
      {activeIndex === index && (
        <video
          className="product-video"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/bd864b9d1184a0851962efed781eac79.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      <div className="product-info">
        <h4 className="product-category">{product.category}</h4>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">{product.price}</p>
      </div>
    </div>
  );

  return (
    <section className="discover-haircare-section" ref={sectionRef}>
      <SectionTitle title="What Are You Shopping Today?" />
      <div className="products-container">
        {products.map((product, index) => renderProductCard(product, index))}
      </div>
    </section>
  );
};

export default DiscoverHaircareSection;