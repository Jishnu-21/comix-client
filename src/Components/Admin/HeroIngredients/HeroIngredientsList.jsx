import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { API_URL } from '../../../config/api';
import HeroIngredientForm from './HeroIngredientForm';
import '../../../Assets/Css/Admin/SharedForm.scss';

const HeroIngredientsList = () => {
  const [heroIngredients, setHeroIngredients] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHeroIngredients();
  }, []);

  const fetchHeroIngredients = async () => {
    try {
      const response = await axios.get(`${API_URL}/hero-ingredients`);
      setHeroIngredients(response.data.heroIngredients);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching hero ingredients:', error);
      setError('Failed to load hero ingredients');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this hero ingredient?')) {
      try {
        await axios.delete(`${API_URL}/hero-ingredients/${id}`);
        setHeroIngredients(prevIngredients => 
          prevIngredients.filter(ingredient => ingredient._id !== id)
        );
      } catch (error) {
        console.error('Error deleting hero ingredient:', error);
        setError('Failed to delete hero ingredient');
      }
    }
  };

  const handleEdit = (ingredient) => {
    setEditingIngredient(ingredient);
    setShowAddForm(true);
  };

  const handleFormClose = () => {
    setShowAddForm(false);
    setEditingIngredient(null);
  };

  const handleFormSubmit = () => {
    fetchHeroIngredients();
    handleFormClose();
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="hero-ingredients-container">
      <div className="header">
        <h2>Hero Ingredients</h2>
        <button 
          className="add-button"
          onClick={() => setShowAddForm(true)}
        >
          <FontAwesomeIcon icon={faPlus} /> Add Hero Ingredient
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="ingredients-grid">
        {heroIngredients.map(ingredient => (
          <div key={ingredient._id} className="ingredient-card">
            <div className="ingredient-image">
              <img 
                src={ingredient.image_url || '/placeholder-image.jpg'} 
                alt={ingredient.name}
                onError={(e) => {
                  e.target.src = '/placeholder-image.jpg';
                }}
              />
            </div>
            <div className="ingredient-header">
              <h3>{ingredient.name}</h3>
              <div className="actions">
                <button
                  onClick={() => handleEdit(ingredient)}
                  className="edit-button"
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button
                  onClick={() => handleDelete(ingredient._id)}
                  className="delete-button"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>
            <div className="descriptions-list">
              {ingredient.descriptions.map((desc, index) => (
                <div key={index} className="description-item">
                  {desc}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showAddForm && (
        <HeroIngredientForm
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
          ingredient={editingIngredient}
        />
      )}
    </div>
  );
};

export default HeroIngredientsList;
