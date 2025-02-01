import React from 'react';
import '../../Assets/Css/ProductDetail/KeyIngredients.scss';

const KeyIngredients = ({ ingredients }) => {
  if (!ingredients || ingredients.length === 0) return null;

  return (
    <div className="key-ingredients-section">
      <h2 className="section-title">Hero Ingredients</h2>
      <div className="ingredients-grid">
        {ingredients.map((ingredient, index) => (
          <div key={index} className="ingredient-card">
            <div className="ingredient-image">
              <img src={ingredient.image_url} alt={ingredient.name} />
            </div>
            <div className="ingredient-content">
              <h3 className="ingredient-name">{ingredient.name}</h3>
              <p className="ingredient-benefit">{ingredient.benefit || ingredient.description}</p>
              {ingredient.description && ingredient.benefit && (
                <p className="ingredient-description">{ingredient.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KeyIngredients;
