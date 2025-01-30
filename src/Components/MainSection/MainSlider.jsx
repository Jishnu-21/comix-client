import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../config/api';
import defaultImage from '../../Assets/Image/main-image.png'
import '../../Assets/Css/MainSection.scss'

const MainSlider = () => {
  const [banners, setBanners] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await axios.get(`${API_URL}/banners`);
      const homepageBanners = response.data.banners.filter(banner => banner.type === 'homepage');

      // Check screen size
      const isMobile = window.innerWidth < 768; // Mobile breakpoint

      if (isMobile) {
        // Set mobile banners
        const mobileBanners = [
          { _id: 'lap-banner1', title: 'Mobile Banner 1', image_url: '/banner1.webp' },
          { _id: 'lap-banner2', title: 'Mobile Banner 2', image_url: '/banner3.webp' },
          { _id: 'lap-banner3', title: 'Mobile Banner 3', image_url: '/banner.webp' }
        ];
        setBanners(mobileBanners);
      } else {
        // Set desktop banners
        setBanners(homepageBanners.length > 0 ? homepageBanners : [{
          _id: 'default',
          title: 'Welcome to Our Store',
          description: 'Check out our amazing products',
          link: '/',
          image_url: defaultImage
        }]);
      }
    } catch (error) {
      console.error('Error fetching banners:', error);
      setBanners([{
        _id: 'default',
        title: 'Welcome to Our Store',
        description: 'Check out our amazing products',
        link: '/',
        image_url: defaultImage
      }]);
    }
  };

  const settings = {
    dots: banners.length > 1,
    infinite: banners.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: banners.length > 1,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    cssEase: "linear",
    arrows: false,
    adaptiveHeight: false
  };

  const renderShopNowButton = (link) => {
    const handleClick = () => {
      if (link.startsWith('http://') || link.startsWith('https://')) {
        window.location.href = link;
      } else {
        navigate(link);
      }
    };

    return (
      <button onClick={handleClick} className="shop-now-btn no-underline">
        <div className="btn-content">
          SHOP NOW
          <FontAwesomeIcon icon={faChevronRight} className="social-icon" />
        </div>
      </button>
    );
  };

  return (
    <div className="main-section">
      <div className="main-slider-container">
        <Slider {...settings}>
          {banners.map((banner) => (
            <div key={banner._id} className="slider-item">
              <div className="slide-content">
                <div className="slide-background" style={{
                  backgroundImage: `url(${banner.image_url})`,
                  backgroundPosition: 'center',
                  backgroundSize: 'cover'
                }} />
                <div className="content-wrapper">
            
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default MainSlider;