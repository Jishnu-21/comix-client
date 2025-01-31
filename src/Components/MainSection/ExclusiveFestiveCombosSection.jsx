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
    <section className="exclusive-festive-combos-section">
      <SectionTitle title="The Timeless Combos" />
      
      <div className="combo-items-container">
        {comboItems.map((item, index) => (
          <div className="combo-item" key={index}>
            <img className="combo-image" src={item.image} alt={item.title} />
            <div className="combo-content">
              {item.discount && <div className="discount-tag">{item.discount}</div>}
              <div className="content-text">
                <h3>{item.title}</h3>
                <p>{item.subtitle}</p>
              </div>
              <button className="shop-now-btn">SHOP NOW</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ExclusiveFestiveCombosSection;