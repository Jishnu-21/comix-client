// ExclusiveFestiveCombosSection.jsx
import React from 'react';
import SectionTitle from '../SectionTitle';
import '../../Assets/Css/ExclusiveFestiveCombosSection.scss';

const ExclusiveFestiveCombosSection = () => {
  const comboItems = [
    {
      image: require('../../Assets/Image/combo1.jpg'),
      title: 'SKIN CARE',
      subtitle: 'Sandal Lotion',
      discount: '40% OFF'
    },
    {
      image: require('../../Assets/Image/combo2.png'),
      title: 'APPLY YOUR',
      subtitle: 'MACKUP',
      buttonText: 'SHOP NOW'
    },
    {
      image: require('../../Assets/Image/combo1.jpg'),
      title: 'SKIN CARE',
      subtitle: 'Sandal Lotion',
      discount: '40% OFF'
    }
  ];

  return (
    <div className="comix-exclusive-section">
      <SectionTitle title="The Timeless Combos" />
      <div className="comix-exclusive-grid">
        {comboItems.map((item, index) => (
          <div 
            key={index} 
            className="comix-exclusive-card"
            style={{ backgroundImage: `url(${item.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          >
            <div className="comix-exclusive-overlay">
              {item.discount && <div className="comix-exclusive-tag">{item.discount}</div>}
              <div className="comix-exclusive-text">
                <h3 className="comix-exclusive-title">{item.title}</h3>
                <p className="comix-exclusive-subtitle">{item.subtitle}</p>
              </div>
              <button className="comix-exclusive-button">SHOP NOW</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExclusiveFestiveCombosSection;