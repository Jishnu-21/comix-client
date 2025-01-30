// ExclusiveFestiveCombosSection.jsx
import React from 'react';
import SectionTitle from '../SectionTitle';
import '../../Assets/Css/ExclusiveFestiveCombosSection.scss';

const ExclusiveFestiveCombosSection = () => {
  const isMobile = window.innerWidth < 768; // Check if the screen size is mobile

  return (
    <section className="exclusive-festive-combos-section">
      <SectionTitle title="The Timeless Combos" />

      <div className="combo-image-container">
        {/* Show only one image on desktop */}
        {isMobile ? (
          <>
            <img className="combo-image" src={require('../../Assets/Image/combo1.jpg')} alt="Exclusive Combo Mobile" />
            <img className="combo-image" src={require('../../Assets/Image/combo2.jpg')} alt="Exclusive Combo Mobile" />
          </>
        ) : (
          <img className="combo-image" src={require('../../Assets/Image/combo-image.png')} alt="Exclusive Combo" />
        )}
      </div>
    </section>
  );
};

export default ExclusiveFestiveCombosSection;
