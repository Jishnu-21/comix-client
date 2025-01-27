// src/Components/Admin/EditProductForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import '../../Assets/Css/Admin/EditProductForm.scss';

const VARIANT_SIZES = ['50ml', '150ml', '250ml'];

const EditProductForm = ({ product, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    category_id: product?.category?._id || product?.category_id || '',
    subcategory_id: product?.subcategory?._id || product?.subcategory_id || '',
    ingredients: product?.ingredients || '',
    how_to_use: product?.how_to_use || '',
    functions: product?.functions || '',
    taglines: product?.taglines || '',
    additional_info: product?.additional_info || '',
    variants: product?.variants?.map(variant => ({
      name: variant.name || '',
      price: variant.price || '',
      stock_quantity: variant.stock_quantity || ''
    })) || [{ name: '50ml', price: '', stock_quantity: '' }],
    faqs: product?.faqs || [{ question: '', answer: '' }]
  });

  const [heroIngredients, setHeroIngredients] = useState([]);
  const [selectedHeroIngredients, setSelectedHeroIngredients] = useState(
    product?.hero_ingredients?.map(hi => ({
      ingredient: hi.ingredient._id || hi.ingredient,
      description: hi.description
    })) || []
  );
  
  const [existingImages, setExistingImages] = useState(product?.image_urls || []);
  const [newImages, setNewImages] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchHeroIngredients();
  }, []);

  useEffect(() => {
    if (formData.category_id) {
      const selectedCategory = categories.find(cat => cat._id === formData.category_id);
      setSubcategories(selectedCategory ? selectedCategory.subcategories : []);
    }
  }, [formData.category_id, categories]);

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

  const handleCategoryChange = (e) => {
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

  const handleNewImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(prevImages => [...prevImages, ...files]);

    // Create preview URLs for new images
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreview(prevPreviews => [...prevPreviews, ...newPreviews]);
  };

  const removeExistingImage = (index) => {
    setExistingImages(prevImages => prevImages.filter((_, i) => i !== index));
  };

  const removeNewImage = (index) => {
    setNewImages(prevImages => prevImages.filter((_, i) => i !== index));
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
      formDataToSend.append('existing_images', JSON.stringify(existingImages));

      newImages.forEach(image => {
        formDataToSend.append('files', image);
      });

      const response = await axios.put(
        `${API_URL}/products/edit/${product._id}`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setSuccess('Product updated successfully!');
      if (onUpdate) {
        onUpdate(response.data.product);
      }
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Error updating product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h2>Edit Product</h2>
        <button onClick={onClose} className="close-button">
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="admin-form">
        {/* Basic Information */}
        <div className="form-section">
          <h3>Basic Information</h3>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Product Name"
            required
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Product Description"
            required
          />
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

        {/* Product Details */}
        <div className="form-section">
          <h3>Product Details</h3>
          <textarea
            name="ingredients"
            value={formData.ingredients}
            onChange={handleInputChange}
            placeholder="Ingredients"
            required
          />
          <textarea
            name="how_to_use"
            value={formData.how_to_use}
            onChange={handleInputChange}
            placeholder="How to Use"
            required
          />
          <textarea
            name="functions"
            value={formData.functions}
            onChange={handleInputChange}
            placeholder="Functions"
          />
          <textarea
            name="taglines"
            value={formData.taglines}
            onChange={handleInputChange}
            placeholder="Taglines"
          />
          <textarea
            name="additional_info"
            value={formData.additional_info}
            onChange={handleInputChange}
            placeholder="Additional Information"
          />
        </div>

        {/* Hero Ingredients */}
        <div className="form-section">
          <h3>Hero Ingredients</h3>
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

          {selectedHeroIngredients.map((item, index) => {
            const heroIngredient = heroIngredients.find(h => h._id === item.ingredient);
            return (
              <div key={index} className="hero-ingredient-item">
                <div className="hero-ingredient-header">
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

        {/* Variants */}
        <div className="form-section">
          <h3>Variants</h3>
          {formData.variants.map((variant, index) => (
            <div key={index} className="variant-item">
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
              <input
                type="number"
                value={variant.price}
                onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                placeholder="Price"
                required
                min="0"
              />
              <input
                type="number"
                value={variant.stock_quantity}
                onChange={(e) => handleVariantChange(index, 'stock_quantity', e.target.value)}
                placeholder="Stock Quantity"
                required
                min="0"
              />
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
          {formData.faqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <input
                type="text"
                value={faq.question}
                onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
                placeholder="Question"
                required
              />
              <textarea
                value={faq.answer}
                onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
                placeholder="Answer"
                required
              />
              <button
                type="button"
                onClick={() => removeFaq(index)}
                className="remove-button"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          ))}
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
          {/* Existing Images */}
          <div className="image-preview-container">
            {existingImages.map((url, index) => (
              <div key={index} className="image-preview">
                <img src={url} alt={`Existing ${index + 1}`} />
                <button
                  type="button"
                  onClick={() => removeExistingImage(index)}
                  className="remove-button"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            ))}
          </div>

          {/* New Images */}
          <input
            type="file"
            onChange={handleNewImageChange}
            multiple
            accept="image/*"
          />
          <div className="image-preview-container">
            {imagePreview.map((preview, index) => (
              <div key={index} className="image-preview">
                <img src={preview} alt={`New ${index + 1}`} />
                <button
                  type="button"
                  onClick={() => removeNewImage(index)}
                  className="remove-button"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="form-actions">
          <button type="submit" className="submit-button" disabled={isSubmitting}>
            {isSubmitting ? 'Updating Product...' : 'Update Product'}
          </button>
          <button type="button" onClick={onClose} className="cancel-button">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProductForm;
