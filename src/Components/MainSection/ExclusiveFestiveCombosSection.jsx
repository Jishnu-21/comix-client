// ExclusiveFestiveCombosSection.jsx
import React from 'react';
import SectionTitle from '../SectionTitle';

const ExclusiveFestiveCombosSection = () => {
  return (
    <section className="exclusive-festive-combos-section">
      <SectionTitle title="The Timeless Combos" />

      <div className="combo-image-container">
        <img
          src={require('../../Assets/Image/combo-image.png')}
          alt="Festive Combos"
          className="combo-image"
        />
      </div>
    </section>
  );
};

export default ExclusiveFestiveCombosSection;
