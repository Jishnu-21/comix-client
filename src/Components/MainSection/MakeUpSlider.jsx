import React, { useState, useRef, useEffect } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../../Assets/Css/MakeUpSlider.scss';
import SectionTitle from '../SectionTitle';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import ReelModal from '../Reels/ReelModal';

const CustomPrevArrow = ({ onClick }) => (
  <button className="custom-arrow prev-arrow" onClick={onClick}>
    <IoIosArrowBack />
  </button>
);

const CustomNextArrow = ({ onClick }) => (
  <button className="custom-arrow next-arrow" onClick={onClick}>
    <IoIosArrowForward />
  </button>
);

const MakeupSlider = () => {
  const sliderRef = useRef(null);
  const [selectedReel, setSelectedReel] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const videoRefs = useRef([]);

  const reels = [
    {
      id: 1,
      videoUrl: 'https://d5ap13rps3ht6.cloudfront.net/8a742554-d177-11ef-808e-8aae7afc63b8/daa7257f-d17a-11ef-877c-9a35e5f0f4dd/dad9706c-d17a-11ef-877c-9a35e5f0f4dd_video.mp4',
      title: 'Everyday Glam Makeup Tutorial',
      description: 'Learn how to create a stunning everyday glam look perfect for any occasion! This tutorial features our best-selling products for a flawless finish. ✨💄',
      products: [
        {
          name: 'Radiant Foundation',
          price: '1299',
          image: '/images/product1.jpg'
        },
        {
          name: 'Velvet Matte Lipstick',
          price: '899',
          image: '/images/product2.jpg'
        }
      ]
    },
    {
      id: 2,
      videoUrl: 'https://d5ap13rps3ht6.cloudfront.net/8a742554-d177-11ef-808e-8aae7afc63b8/0dd9914b-d17a-11ef-877c-9a35e5f0f4dd/0e05c8f8-d17a-11ef-877c-9a35e5f0f4dd_video.mp4',
      title: 'Natural Glow Skincare Routine',
      description: 'Achieve that perfect natural glow with our simple yet effective skincare routine! Using our premium skincare line for radiant, healthy-looking skin. ✨💫',
      products: [
        {
          name: 'Hydrating Serum',
          price: '1499',
          image: '/images/product3.jpg'
        },
        {
          name: 'Glow Moisturizer',
          price: '999',
          image: '/images/product4.jpg'
        }
      ]
    },
    {
      id: 3,
      videoUrl: 'https://d5ap13rps3ht6.cloudfront.net/f8e2b0ba-d342-11ef-a2c1-428544fd1e23/dcfc3a97-e1df-11ef-9065-ee87500dd548/dd381819-e1df-11ef-9065-ee87500dd548_video.mp4',
      title: 'Summer Vibes Makeup Tutorial',
      description: 'Get ready for the summer with our vibrant makeup tutorial! Featuring our best-selling products for a sun-kissed glow. ☀️💄',
      products: [
        {
          name: 'Summer Breeze Eyeshadow Palette',
          price: '1999',
          image: '/images/product5.jpg'
        },
        {
          name: 'Coconut Lip Balm',
          price: '499',
          image: '/images/product6.jpg'
        }
      ]
    },
    {
      id: 4,
      videoUrl: 'https://d5ap13rps3ht6.cloudfront.net/8a742554-d177-11ef-808e-8aae7afc63b8/317d8115-d17a-11ef-877c-9a35e5f0f4dd/31a4a3b0-d17a-11ef-877c-9a35e5f0f4dd_video.mp4',
      title: 'Get Ready with Me Morning Routine',
      description: 'Start your day off right with our morning routine! From skincare to makeup, we\'ve got you covered. ☀️💫',
      products: [
        {
          name: 'Morning Dew Moisturizer',
          price: '1299',
          image: '/images/product7.jpg'
        },
        {
          name: 'Sunrise Eyeshadow Palette',
          price: '1999',
          image: '/images/product8.jpg'
        }
      ]
    },
    {
      id: 5,
      videoUrl: 'https://cdn.shopify.com/videos/c/o/v/34f3d466424f4b029d3c286642e2b5db.mp4',
      title: 'Nighttime Skincare Routine',
      description: 'Wind down with our nighttime skincare routine! From cleansing to moisturizing, we\'ve got the perfect products for a restful night\'s sleep. 🌙💤',
      products: [
        {
          name: 'Nighttime Cleanser',
          price: '999',
          image: '/images/product9.jpg'
        },
        {
          name: 'Sleeping Mask',
          price: '1499',
          image: '/images/product10.jpg'
        }
      ]
    },
    {
      id: 6,
      videoUrl: 'https://cdn.shopify.com/videos/c/o/v/840587849a554f74bd6cb8fc3146e412.mp4',
      title: 'Get Ready with Me Morning Routine',
      description: 'Start your day off right with our morning routine! From skincare to makeup, we\'ve got you covered. ☀️💫',
      products: [
        {
          name: 'Morning Dew Moisturizer',
          price: '1299',
          image: '/images/product11.jpg'
        },
        {
          name: 'Sunrise Eyeshadow Palette',
          price: '1999',
          image: '/images/product12.jpg'
        }
      ]
    },
  ];

  const handleReelClick = (reel) => {
    setSelectedReel(reel);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedReel(null);
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    arrows: true,
    swipeToSlide: true,
    centerMode: false,
    variableWidth: false,
    adaptiveHeight: false,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    responsive: [
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          arrows: true
        }
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          arrows: true
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          arrows: true,
          swipeToSlide: true,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          arrows: true,
          swipeToSlide: true,
        }
      }
    ]
  };

  useEffect(() => {
    const handleVideoPlay = (video) => {
      if (!video) return;
      
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          video.muted = true;
          video.play().catch(() => {});
        });
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const video = entry.target;
          if (!video) return;

          if (entry.isIntersecting) {
            handleVideoPlay(video);
          } else {
            video.pause();
          }
        });
      },
      { 
        threshold: 0.5,
        root: null,
        rootMargin: '0px'
      }
    );

    videoRefs.current.forEach(video => {
      if (video) {
        observer.observe(video);
        video.addEventListener('loadedmetadata', () => {
          if (video.paused) {
            handleVideoPlay(video);
          }
        });
      }
    });

    return () => {
      observer.disconnect();
      videoRefs.current.forEach(video => {
        if (video) {
          video.removeEventListener('loadedmetadata', () => {});
        }
      });
    };
  }, []);

  return (
    <section className="comix-insta-section">
      <SectionTitle title="Commix INSTA" />
      <div className="comix-insta-wrapper">
        <Slider ref={sliderRef} {...settings}>
          {reels.map((reel) => (
            <div key={reel.id} className="comix-insta-slide" onClick={() => handleReelClick(reel)}>
              <div className="video-wrapper">
                <video
                  ref={el => videoRefs.current[reel.id] = el}
                  src={reel.videoUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                />
              </div>
            </div>
          ))}
        </Slider>
      </div>
      <ReelModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        reel={selectedReel}
      />
    </section>
  );
};

export default MakeupSlider;