import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { API_URL } from '../../config/api';
import '../../Assets/Css/Admin/SharedForm.scss';

const VARIANT_SIZES = ['50ml', '150ml', '250ml'];

const AddProductForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category_id: '',
    subcategory_id: '',
    ingredients: '',
    hero_ingredients: '',
    functions: '',
    taglines: '',
    variants: [{ name: '50ml', price: '', stock_quantity: '' }],
  });
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [ingredientInput, setIngredientInput] = useState('');
  const [heroIngredientInput, setHeroIngredientInput] = useState('');
  const [imagePreview, setImagePreview] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));

    if (name === 'category_id') {
      try {
        const response = await axios.get(`${API_URL}/categories/${value}`);
        setSubcategories(response.data.category.subcategories || []);
      } catch (error) {
        console.error('Error fetching subcategories:', error);
        setSubcategories([]);
      }
    }
  };

  const handleVariantChange = (index, field, value) => {
    setFormData(prevState => ({
      ...prevState,
      variants: prevState.variants.map((variant, i) => 
        i === index ? { 
          ...variant, 
          [field]: field === 'price' ? parseFloat(value) || 0 : value 
        } : variant
      )
    }));
  };

  const addVariant = () => {
    if (formData.variants.length < VARIANT_SIZES.length) {
      setFormData(prevState => ({
        ...prevState,
        variants: [...prevState.variants, { name: '', price: '', stock_quantity: '' }]
      }));
    }
  };

  const removeVariant = (index) => {
    setFormData(prevState => ({
      ...prevState,
      variants: prevState.variants.filter((_, i) => i !== index)
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 7) {
      setError('You can only upload a maximum of 7 images.');
      return;
    }
    setImages(files);
    setImagePreview(files.map(file => URL.createObjectURL(file)));
    setError('');
  };

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreview(imagePreview.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    // Validate variants
    const validVariants = formData.variants.filter(v => 
      v.name && 
      v.price && 
      v.stock_quantity
    ).map(v => ({
      name: v.name,
      price: Number(v.price),
      stock_quantity: Number(v.stock_quantity)
    }));

    if (validVariants.length === 0) {
      setError('At least one variant with name, price, and stock quantity is required');
      setIsSubmitting(false);
      return;
    }

    try {
      const productData = new FormData();
      
      // Append form data
      Object.keys(formData).forEach(key => {
        if (key === 'variants') {
          // Ensure variants are properly stringified
          productData.append('variants', JSON.stringify(validVariants));
        } else if (['ingredients', 'hero_ingredients', 'functions', 'taglines'].includes(key)) {
          const arrayData = formData[key].split(',').map(item => item.trim()).filter(Boolean);
          productData.append(key, JSON.stringify(arrayData));
        } else {
          productData.append(key, formData[key]);
        }
      });
      
      images.forEach((image, index) => {
        productData.append(`files`, image);
      });
  
      const response = await axios.post(`${API_URL}/products/add`, productData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
  
      setSuccess('Product added successfully');
      setTimeout(() => {
        onClose();
        setFormData({
          name: '',
          description: '',
          category_id: '',
          subcategory_id: '',
          ingredients: '',
          hero_ingredients: '',
          functions: '',
          taglines: '',
          variants: [{ name: '50ml', price: '', stock_quantity: '' }],
        });
        setImages([]);
        setImagePreview([]);
        setSuccess('');
        setIsSubmitting(false);
      }, 2000);
    } catch (error) {
      console.error('Error adding product:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'Failed to add product. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="form-header">
            <h2>Add New Product</h2>
            <button type="button" className="close-button" onClick={onClose}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">Product Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category_id">Category</label>
              <select
                id="category_id"
                name="category_id"
                value={formData.category_id}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category._id} value={category._id}>{category.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="subcategory_id">Subcategory</label>
              <select
                id="subcategory_id"
                name="subcategory_id"
                value={formData.subcategory_id}
                onChange={handleInputChange}
                required
                disabled={!formData.category_id}
              >
                <option value="">Select Subcategory</option>
                {subcategories.map(subcategory => (
                  <option key={subcategory._id} value={subcategory._id}>{subcategory.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Ingredients</label>
              <div className="input-group">
                <input
                  type="text"
                  value={ingredientInput}
                  onChange={(e) => setIngredientInput(e.target.value)}
                  placeholder="Add ingredient"
                />
                <button type="button" onClick={() => {
                  setFormData(prevState => ({
                    ...prevState,
                    ingredients: prevState.ingredients + (prevState.ingredients ? ',' : '') + ingredientInput
                  }));
                  setIngredientInput('');
                }}>
                  Add
                </button>
              </div>
              <div className="variant-list">
                {formData.ingredients.split(',').map((ingredient, index) => (
                  <div key={index} className="variant-item">
                    <span>{ingredient.trim()}</span>
                    <button
                      type="button"
                      className="remove-button"
                      onClick={() => {
                        const ingredients = formData.ingredients.split(',').filter((_, i) => i !== index);
                        setFormData(prevState => ({
                          ...prevState,
                          ingredients: ingredients.join(',')
                        }));
                      }}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Hero Ingredients</label>
              <div className="input-group">
                <input
                  type="text"
                  value={heroIngredientInput}
                  onChange={(e) => setHeroIngredientInput(e.target.value)}
                  placeholder="Add hero ingredient"
                />
                <button type="button" onClick={() => {
                  setFormData(prevState => ({
                    ...prevState,
                    hero_ingredients: prevState.hero_ingredients + (prevState.hero_ingredients ? ',' : '') + heroIngredientInput
                  }));
                  setHeroIngredientInput('');
                }}>
                  Add
                </button>
              </div>
              <div className="variant-list">
                {formData.hero_ingredients.split(',').map((ingredient, index) => (
                  <div key={index} className="variant-item">
                    <span>{ingredient.trim()}</span>
                    <button
                      type="button"
                      className="remove-button"
                      onClick={() => {
                        const heroIngredients = formData.hero_ingredients.split(',').filter((_, i) => i !== index);
                        setFormData(prevState => ({
                          ...prevState,
                          hero_ingredients: heroIngredients.join(',')
                        }));
                      }}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group full-width">
              <label>Functions</label>
              <textarea
                id="functions"
                name="functions"
                value={formData.functions}
                onChange={handleInputChange}
                placeholder="e.g., Moisturizing, Anti-aging, etc."
              />
            </div>

            <div className="form-group full-width">
              <label>Taglines</label>
              <textarea
                id="taglines"
                name="taglines"
                value={formData.taglines}
                onChange={handleInputChange}
                placeholder="Enter product taglines"
              />
            </div>

            <div className="form-group full-width">
              <label>Product Images</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
              />
              <div className="image-preview">
                {imagePreview.map((image, index) => (
                  <div key={index} className="image-item">
                    <img src={image} alt={`Preview ${index + 1}`} />
                    <button
                      type="button"
                      className="remove-image"
                      onClick={() => handleRemoveImage(index)}
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group full-width">
              <label>Variants</label>
              <div className="variant-list">
                {formData.variants.map((variant, index) => (
                  <div key={index} className="variant-item">
                    <div className="variant-info">
                      <select
                        value={variant.name}
                        onChange={(e) => handleVariantChange(index, 'name', e.target.value)}
                        className="add-product-modal__select"
                      >
                        <option value="">Select size</option>
                        {VARIANT_SIZES.map(size => (
                          <option key={size} value={size}>{size}</option>
                        ))}
                      </select>
                      <input
                        type="number"
                        placeholder="Price"
                        value={variant.price}
                        onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                      />
                      <input
                        type="number"
                        placeholder="Stock"
                        value={variant.stock_quantity}
                        onChange={(e) => handleVariantChange(index, 'stock_quantity', e.target.value)}
                      />
                    </div>
                    <button
                      type="button"
                      className="remove-button"
                      onClick={() => removeVariant(index)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                ))}
                <button type="button" onClick={addVariant}>
                  Add Variant
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="add-product-modal__error" role="alert">
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="add-product-modal__success" role="alert">
              <span>{success}</span>
            </div>
          )}

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-button" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductForm;
