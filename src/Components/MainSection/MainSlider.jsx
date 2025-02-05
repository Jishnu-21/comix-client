import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../config/api';
import defaultImage from '../../Assets/Image/main-image.png';

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

      const isMobile = window.innerWidth < 768;

      if (isMobile) {
        const mobileBanners = [
          { _id: 'lap-banner1', title: 'Mobile Banner 1', image_url: '/banner1.webp' },
          { _id: 'lap-banner2', title: 'Mobile Banner 2', image_url: '/banner3.webp' },
          { _id: 'lap-banner3', title: 'Mobile Banner 3', image_url: '/banner.webp' }
        ];
        setBanners(mobileBanners);
      } else {
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
    adaptiveHeight: false,
    customPaging: function(i) {
      return (
        <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-white/50 hover:bg-white/80 transition-colors duration-300" />
      );
    },
    dotsClass: "slick-dots !absolute bottom-6 md:bottom-8 lg:bottom-10"
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
      <button 
        onClick={handleClick} 
        className="inline-flex items-center gap-3 px-6 py-3 text-sm uppercase tracking-wider border-2 border-[#4B4A9F] text-[#4B4A9F] transition-all duration-300 hover:bg-[#4B4A9F] hover:text-white md:px-8 md:py-4 md:text-base no-underline"
      >
        <span>SHOP NOW</span>
        <FontAwesomeIcon 
          icon={faChevronRight} 
          className="transform transition-transform duration-300 group-hover:translate-x-1"
        />
      </button>
    );
  };

  return (
    <div className="w-full">
      <div className="w-full [&_.slick-dots]:!flex [&_.slick-dots]:!justify-center [&_.slick-dots]:!items-center [&_.slick-dots]:!gap-2 [&_.slick-dots_li]:!m-0 [&_.slick-dots_li]:!w-auto [&_.slick-dots_li]:!h-auto">
        <Slider {...settings}>
          {banners.map((banner) => (
            <div key={banner._id} className="w-full">
              <div className="relative w-full overflow-hidden h-[40vh] md:h-[500px] lg:h-[600px] xl:h-[calc(100vh-135px)]">
                <div 
                  className="absolute inset-0 bg-center bg-no-repeat bg-cover"
                  style={{ backgroundImage: `url(${banner.image_url})` }}
                />
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default MainSlider;