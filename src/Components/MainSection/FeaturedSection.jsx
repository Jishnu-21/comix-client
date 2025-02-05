// FeaturedSection.jsx
import React, { useState } from 'react';
import SectionTitle from '../../Components/SectionTitle';
import '../../Assets/Css/Home/FeaturedSection.scss';

const FeaturedSection = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <section className="comix-featured-section">
      <SectionTitle title="Skincare That Loves You Back" />
      <div className="comix-featured-grid">
        {['left', 'right'].map((side, index) => (
          <div 
            key={index}
            className="comix-featured-card"
            onMouseEnter={() => setHoveredCard(index)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="comix-featured-media-wrapper">
              {hoveredCard === index ? (
                <video
                  className="comix-featured-media"
                  autoPlay
                  loop
                  muted
                  playsInline
                >
                  <source src="/bd864b9d1184a0851962efed781eac79.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img
                  src={require(`../../Assets/Image/subscribe-${side}.png`)}
                  alt={`Subscribe and save ${side} image`}
                  className="comix-featured-media"
                />
              )}
            </div>
            <div className="comix-featured-content">
              <h3 className="comix-featured-title">SUBSCRIBE & SAVE 15%</h3>
              <p className="comix-featured-description">Rinse And Repeat with Comix</p>
              <button className="comix-featured-button">SUBSCRIBE NOW</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedSection;