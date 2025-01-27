import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { API_URL } from '../../config/api';
import '../../Assets/Css/Admin/SharedForm.scss';

const VARIANT_SIZES = ['50ml', '150ml', '250ml','100ml','200ml','300ml','50mg','100mg','30ml'];

const AddProductForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category_id: '',
    subcategory_id: '',
    ingredients: '',
    how_to_use: '',
    functions: '',
    taglines: '',
    additional_info: '',
    variants: [{ name: '50ml', price: '', stock_quantity: '' }],
    faqs: [{ question: '', answer: '' }]
  });

  const [heroIngredients, setHeroIngredients] = useState([]);
  const [selectedHeroIngredients, setSelectedHeroIngredients] = useState([]);
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchHeroIngredients();
  }, []);

  const fetchHeroIngredients = async () => {
    try {
      const response = await axios.get(`${API_URL}/hero-ingredients`);
      setHeroIngredients(response.data.heroIngredients || []);
    } catch (error) {
      console.error('Error fetching hero ingredients:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleHeroIngredientSelect = (heroIngredient) => {
    const isAlreadySelected = selectedHeroIngredients.some(
      item => item.ingredient === heroIngredient._id
    );

    if (!isAlreadySelected) {
      setSelectedHeroIngredients([
        ...selectedHeroIngredients,
        {
          ingredient: heroIngredient._id,
          description: ''
        }
      ]);
    }
  };

  const handleHeroIngredientDescription = (id, description) => {
    setSelectedHeroIngredients(prevState =>
      prevState.map(item =>
        item.ingredient === id
          ? { ...item, description }
          : item
      )
    );
  };

  const removeHeroIngredient = (id) => {
    setSelectedHeroIngredients(prevState =>
      prevState.filter(item => item.ingredient !== id)
    );
  };

  const handleCategoryChange = async (e) => {
    const categoryId = e.target.value;
    setFormData(prevState => ({
      ...prevState,
      category_id: categoryId,
      subcategory_id: ''
    }));

    const selectedCategory = categories.find(cat => cat._id === categoryId);
    setSubcategories(selectedCategory ? selectedCategory.subcategories : []);
  };

  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...formData.variants];
    updatedVariants[index] = {
      ...updatedVariants[index],
      [field]: field === 'price' || field === 'stock_quantity' ? Number(value) : value
    };
    setFormData(prevState => ({
      ...prevState,
      variants: updatedVariants
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

  const handleFaqChange = (index, field, value) => {
    const updatedFaqs = [...formData.faqs];
    updatedFaqs[index] = {
      ...updatedFaqs[index],
      [field]: value
    };
    setFormData(prevState => ({
      ...prevState,
      faqs: updatedFaqs
    }));
  };

  const addFaq = () => {
    setFormData(prevState => ({
      ...prevState,
      faqs: [...prevState.faqs, { question: '', answer: '' }]
    }));
  };

  const removeFaq = (index) => {
    setFormData(prevState => ({
      ...prevState,
      faqs: prevState.faqs.filter((_, i) => i !== index)
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(prevImages => [...prevImages, ...files]);

    // Create preview URLs
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreview(prevPreviews => [...prevPreviews, ...newPreviews]);
  };

  const removeImage = (index) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
    setImagePreview(prevPreviews => prevPreviews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category_id', formData.category_id);
      formDataToSend.append('subcategory_id', formData.subcategory_id);
      formDataToSend.append('ingredients', formData.ingredients);
      formDataToSend.append('how_to_use', formData.how_to_use);
      formDataToSend.append('functions', formData.functions);
      formDataToSend.append('taglines', formData.taglines);
      formDataToSend.append('additional_info', formData.additional_info);
      formDataToSend.append('hero_ingredients', JSON.stringify(selectedHeroIngredients));
      formDataToSend.append('variants', JSON.stringify(formData.variants));
      formDataToSend.append('faqs', JSON.stringify(formData.faqs));

      images.forEach(image => {
        formDataToSend.append('files', image);
      });

      const response = await axios.post(`${API_URL}/products/add`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setSuccess('Product added successfully!');
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Error adding product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="admin-form">
        <div className="form-header">
          <h2>Add New Product</h2>
          <button onClick={onClose} className="close-button">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Basic Information */}
          <div className="form-section">
            <h3>Basic Information</h3>
            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter product name"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter product description"
                required
              />
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>Category</label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleCategoryChange}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Subcategory</label>
                <select
                  name="subcategory_id"
                  value={formData.subcategory_id}
                  onChange={handleInputChange}
                  required
                  disabled={!formData.category_id}
                >
                  <option value="">Select Subcategory</option>
                  {subcategories.map(subcategory => (
                    <option key={subcategory._id} value={subcategory._id}>
                      {subcategory.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="form-section">
            <h3>Product Details</h3>
            <div className="form-group">
              <label>Ingredients</label>
              <textarea
                name="ingredients"
                value={formData.ingredients}
                onChange={handleInputChange}
                placeholder="List all ingredients"
                required
              />
            </div>

            <div className="form-group">
              <label>How to Use</label>
              <textarea
                name="how_to_use"
                value={formData.how_to_use}
                onChange={handleInputChange}
                placeholder="Enter usage instructions"
                required
              />
            </div>

            <div className="form-group">
              <label>Functions</label>
              <textarea
                name="functions"
                value={formData.functions}
                onChange={handleInputChange}
                placeholder="Enter product functions"
              />
            </div>

            <div className="form-group">
              <label>Taglines</label>
              <textarea
                name="taglines"
                value={formData.taglines}
                onChange={handleInputChange}
                placeholder="Enter product taglines"
              />
            </div>

            <div className="form-group">
              <label>Additional Information</label>
              <textarea
                name="additional_info"
                value={formData.additional_info}
                onChange={handleInputChange}
                placeholder="Enter any additional information"
              />
            </div>
          </div>

          {/* Hero Ingredients */}
          <div className="form-section">
            <h3>Hero Ingredients</h3>
            <div className="form-group">
              <label>Add Hero Ingredient</label>
              <select
                onChange={(e) => {
                  const heroIngredient = heroIngredients.find(h => h._id === e.target.value);
                  if (heroIngredient) {
                    handleHeroIngredientSelect(heroIngredient);
                  }
                }}
                value=""
              >
                <option value="">Select Hero Ingredient</option>
                {heroIngredients.map(hero => (
                  <option key={hero._id} value={hero._id}>
                    {hero.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="hero-ingredients-list">
              {selectedHeroIngredients.map((item, index) => {
                const heroIngredient = heroIngredients.find(h => h._id === item.ingredient);
                return (
                  <div key={index} className="hero-ingredient-item">
                    <div className="ingredient-header">
                      <span>{heroIngredient?.name}</span>
                      <button
                        type="button"
                        onClick={() => removeHeroIngredient(item.ingredient)}
                        className="remove-button"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                    <textarea
                      value={item.description}
                      onChange={(e) => handleHeroIngredientDescription(item.ingredient, e.target.value)}
                      placeholder="Description for this hero ingredient"
                      required
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Variants */}
          <div className="form-section">
            <h3>Variants</h3>
            <div className="variant-list">
              {formData.variants.map((variant, index) => (
                <div key={index} className="variant-item">
                  <div className="variant-info">
                    <div className="form-group">
                      <label>Size</label>
                      <select
                        value={variant.name}
                        onChange={(e) => handleVariantChange(index, 'name', e.target.value)}
                        required
                      >
                        <option value="">Select Size</option>
                        {VARIANT_SIZES.map(size => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Price</label>
                      <input
                        type="number"
                        value={variant.price}
                        onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                        placeholder="Enter price"
                        required
                        min="0"
                      />
                    </div>
                    <div className="form-group">
                      <label>Stock</label>
                      <input
                        type="number"
                        value={variant.stock_quantity}
                        onChange={(e) => handleVariantChange(index, 'stock_quantity', e.target.value)}
                        placeholder="Enter stock quantity"
                        required
                        min="0"
                      />
                    </div>
                  </div>
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeVariant(index)}
                      className="remove-button"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {formData.variants.length < VARIANT_SIZES.length && (
              <button
                type="button"
                onClick={addVariant}
                className="add-button"
              >
                <FontAwesomeIcon icon={faPlus} /> Add Variant
              </button>
            )}
          </div>

          {/* FAQs */}
          <div className="form-section">
            <h3>FAQs</h3>
            <div className="faq-list">
              {formData.faqs.map((faq, index) => (
                <div key={index} className="faq-item">
                  <div className="faq-inputs">
                    <div className="form-group">
                      <label>Question</label>
                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
                        placeholder="Enter question"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Answer</label>
                      <textarea
                        value={faq.answer}
                        onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
                        placeholder="Enter answer"
                        required
                      />
                    </div>
                  </div>
                  <div className="faq-actions">
                    <button
                      type="button"
                      onClick={() => removeFaq(index)}
                      className="remove-button"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addFaq}
              className="add-button"
            >
              <FontAwesomeIcon icon={faPlus} /> Add FAQ
            </button>
          </div>

          {/* Images */}
          <div className="form-section">
            <h3>Product Images</h3>
            <div className="form-group">
              <label>Upload Images</label>
              <input
                type="file"
                onChange={handleImageChange}
                multiple
                accept="image/*"
              />
            </div>
            {imagePreview.length > 0 && (
              <div className="image-preview">
                {imagePreview.map((preview, index) => (
                  <div key={index} className="image-item">
                    <img src={preview} alt={`Preview ${index + 1}`} />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="remove-image"
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

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
              {isSubmitting ? 'Adding Product...' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductForm;
