// BlogSection.jsx
import React from 'react';
import SectionHeader from '../SectionTitle.jsx';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useMediaQuery } from 'react-responsive';
import SectionTitle from '../SectionTitle';
import { Link } from 'react-router-dom';
import '../../Assets/Css/Home/BlogSection.scss';

const BlogSection = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  
  const blogPosts = [
    { image: 'blog-image1.png', title: 'The Best Celebrity Beauty Brands to Shop in 2024' },
    { image: 'blog-image2.png', title: 'The Best Celebrity Beauty Brands to Shop in 2024' },
    { image: 'blog-image2.png', title: 'The Best Celebrity Beauty Brands to Shop in 2024' },
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
    className: "blog-mobile-slider"
  };

  return (
    <section className="blog-section">
      <SectionTitle title="BLOGS" />
      <p className="section-description">
      Glow Talk - Tips, Trends, and Everything Your Skin’s Been DMing You About!<br className="desktop-break"/>Been DMing You About!.
      </p>

      {isMobile ? (
        <Slider {...sliderSettings}>
          {blogPosts.map((post, index) => (
            <div key={index}>
              <div className="blog-post">
                <img 
                  src={require(`../../Assets/Image/${post.image}`)} 
                  alt={`Blog ${index + 1}`} 
                  className="blog-image" 
                />
                <div className="blog-text">
                  <p>It is a long established fact <br/>that</p>
                  <h3>{post.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      ) : (
        <div className="blog-grid">
          {blogPosts.map((post, index) => (
            <div key={index} className="blog-post">
              <img 
                src={require(`../../Assets/Image/${post.image}`)} 
                alt={`Blog ${index + 1}`} 
                className="blog-image" 
              />
              <div className="blog-text">
                <p>It is a long established fact <br/>that</p>
                <h3>{post.title}</h3>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="see-all-button-container">
        <Link to="/blog" className="see-all-button">SEE ALL</Link>
      </div>
    </section>
  );
};

export default BlogSection;