import React from 'react';
import '../../Assets/Css/ProductDetail/HowToUse.scss';
import { FaRegCircle } from 'react-icons/fa';

const HowToUse = ({ steps, category }) => {
  const formatSteps = (stepsData) => {
    if (typeof stepsData === 'string') {
      return stepsData.split('\n').filter(step => step.trim()).map(step => 
        step.replace(/^\d+\.\s*/, '').trim()
      );
    }
    return Array.isArray(stepsData) ? stepsData : [];
  };

  const formattedSteps = formatSteps(steps);

  if (!formattedSteps || formattedSteps.length === 0) return null;

  const getCategoryImage = (categoryId) => {
    if (!categoryId) return '/images/skincare.gif';
    
    const categoryMap = {
      '67935d7c5e8e847cc68a212f': '/images/haircare.png',      // Hair Care
      '679635d0a547744085f05ffb': '/images/skincare.gif',      // Skin Care
      '6797dc7caaf46dbfaee6fdb6': '/images/oral care.png',     // Oral Care
      '6797dc8caaf46dbfaee6fdbc': '/images/bodycare.png'       // Body Care
    };
    
    return categoryMap[categoryId] || '/images/skincare.gif';
  };

  const getCategoryName = (categoryId) => {
    const categoryNames = {
      '67935d7c5e8e847cc68a212f': 'Hair Care',
      '679635d0a547744085f05ffb': 'Skin Care',
      '6797dc7caaf46dbfaee6fdb6': 'Oral Care',
      '6797dc8caaf46dbfaee6fdbc': 'Body Care'
    };
    
    return categoryNames[categoryId] || 'Product';
  };

  return (
    <div className="how-to-use-section">
      <h2 className="section-title">How to Use</h2>
      <div className="how-to-use-content">
        <div className="steps-container">
          {formattedSteps.map((step, index) => (
            <div key={index} className="step-item">
              <div className="step-icon">
                <FaRegCircle />
              </div>
              <div className="step-info">
                <span className="step-number">Step {index + 1}</span>
                <p className="step-description">{step}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="category-image">
          <img 
            src={getCategoryImage(category)} 
            alt={`How to use - ${getCategoryName(category)}`} 
          />
        </div>
      </div>
    </div>
  );
};

export default HowToUse;
