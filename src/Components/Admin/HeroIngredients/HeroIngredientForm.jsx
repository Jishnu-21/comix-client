import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { API_URL } from '../../../config/api';
import { toast } from 'sonner';
import '../../../Assets/Css/Admin/SharedForm.scss';

const HeroIngredientForm = ({ onClose, onSubmit, ingredient }) => {
  const [formData, setFormData] = useState({
    name: '',
    descriptions: [''],
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (ingredient) {
      setFormData({
        name: ingredient.name,
        descriptions: ingredient.descriptions,
        image: null
      });
      setImagePreview(ingredient.image_url);
    }
  }, [ingredient]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    const validDescriptions = formData.descriptions.filter(desc => desc.trim() !== '');
    if (validDescriptions.length === 0) {
      newErrors.descriptions = 'At least one description is required';
    }

    if (!ingredient && !formData.image && !imagePreview) {
      newErrors.image = 'Image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleDescriptionChange = (index, value) => {
    const newDescriptions = [...formData.descriptions];
    newDescriptions[index] = value;
    setFormData(prev => ({
      ...prev,
      descriptions: newDescriptions
    }));
    // Clear description error when user types
    if (errors.descriptions) {
      setErrors(prev => ({ ...prev, descriptions: '' }));
    }
  };

  const addDescription = () => {
    setFormData(prev => ({
      ...prev,
      descriptions: [...prev.descriptions, '']
    }));
  };

  const removeDescription = (index) => {
    if (formData.descriptions.length > 1) {
      setFormData(prev => ({
        ...prev,
        descriptions: prev.descriptions.filter((_, i) => i !== index)
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors(prev => ({
          ...prev,
          image: 'Image size should be less than 5MB'
        }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        image: file
      }));
      setImagePreview(URL.createObjectURL(file));
      setErrors(prev => ({ ...prev, image: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name.trim());
      formData.descriptions.forEach((desc) => {
        if (desc.trim()) {
          formDataToSend.append('descriptions[]', desc.trim());
        }
      });
      
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      if (ingredient) {
        await axios.put(
          `${API_URL}/hero-ingredients/${ingredient._id}`, 
          formDataToSend,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        toast.success('Hero ingredient updated successfully');
      } else {
        await axios.post(
          `${API_URL}/hero-ingredients/add`, 
          formDataToSend,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        toast.success('Hero ingredient added successfully');
      }

      onSubmit();
    } catch (error) {
      const message = error.response?.data?.message || 'Error submitting hero ingredient';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="admin-form hero-ingredient-form">
        <div className="form-header">
          <h2>{ingredient ? 'Edit Hero Ingredient' : 'Add Hero Ingredient'}</h2>
          <button onClick={onClose} className="close-button">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <div className="form-group">
              <label>Image {!ingredient && <span className="required">*</span>}</label>
              <div className="image-upload-container">
                {imagePreview && (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Preview" />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className={errors.image ? 'error' : ''}
                />
                {errors.image && <div className="error-message">{errors.image}</div>}
              </div>
            </div>

            <div className="form-group">
              <label>Name <span className="required">*</span></label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter ingredient name"
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <div className="error-message">{errors.name}</div>}
            </div>

            <div className="form-group">
              <label>Descriptions <span className="required">*</span></label>
              {errors.descriptions && (
                <div className="error-message">{errors.descriptions}</div>
              )}
              {formData.descriptions.map((description, index) => (
                <div key={index} className="description-input">
                  <textarea
                    value={description}
                    onChange={(e) => handleDescriptionChange(index, e.target.value)}
                    placeholder="Enter description"
                    className={errors.descriptions ? 'error' : ''}
                  />
                  {formData.descriptions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDescription(index)}
                      className="remove-button"
                      title="Remove description"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addDescription}
                className="add-button"
              >
                <FontAwesomeIcon icon={faPlus} /> Add Description
              </button>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={onClose}
              className="secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : (ingredient ? 'Update' : 'Add')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HeroIngredientForm;
