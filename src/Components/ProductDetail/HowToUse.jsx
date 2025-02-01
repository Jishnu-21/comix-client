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

  const getCategoryImage = (categoryName) => {
    if (!categoryName) return '/images/skincare.gif';
    
    const categoryMap = {
      'Skin Care': '/images/skincare.gif',
      'Hair Care': '/images/haircare.png',
      'Oral Care': '/images/oral care.png',
      'Body Care': '/images/bodycare.png'
    };
    
    const normalizedCategory = categoryName.toLowerCase();
    return categoryMap[normalizedCategory] || '/images/skincare.gif';
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
            alt={`How to use - ${category || 'Product'}`} 
          />
        </div>
      </div>
    </div>
  );
};

export default HowToUse;
