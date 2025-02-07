// src/Components/Admin/EditProductForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import '../../Assets/Css/Admin/EditProductForm.scss';

const VARIANT_SIZES = ['50ml', '150ml', '250ml','100ml','200ml','300ml','50mg','100mg','30ml'];

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
    faqs: product?.faqs || [{ question: '', answer: '' }],
    related_products: product?.related_products || [],
    best_results_description: product?.best_results_description || ''
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
  const [allProducts, setAllProducts] = useState([]);
  const [selectedRelatedProduct, setSelectedRelatedProduct] = useState('');
  const [relatedProductDescription, setRelatedProductDescription] = useState('');

  useEffect(() => {
    fetchCategories();
    fetchHeroIngredients();
    fetchAllProducts();
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

  const fetchAllProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products`);
      setAllProducts(response.data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
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

  const handleAddRelatedProduct = () => {
    if (selectedRelatedProduct && relatedProductDescription) {
      setFormData(prev => ({
        ...prev,
        related_products: [
          ...prev.related_products,
          {
            product: selectedRelatedProduct,
            description: relatedProductDescription
          }
        ]
      }));
      setSelectedRelatedProduct('');
      setRelatedProductDescription('');
    }
  };

  const handleRemoveRelatedProduct = (index) => {
    setFormData(prev => ({
      ...prev,
      related_products: prev.related_products.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const formDataToSend = new FormData();
      
      // Append basic fields
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category_id', formData.category_id);
      formDataToSend.append('subcategory_id', formData.subcategory_id);
      formDataToSend.append('ingredients', formData.ingredients);
      formDataToSend.append('how_to_use', formData.how_to_use);
      formDataToSend.append('functions', formData.functions);
      formDataToSend.append('taglines', formData.taglines);
      formDataToSend.append('additional_info', formData.additional_info);
      
      // Append JSON fields
      formDataToSend.append('hero_ingredients', JSON.stringify(selectedHeroIngredients));
      formDataToSend.append('variants', JSON.stringify(formData.variants));
      formDataToSend.append('faqs', JSON.stringify(formData.faqs));
      formDataToSend.append('existing_images', JSON.stringify(existingImages));
      formDataToSend.append('related_products', JSON.stringify(formData.related_products));
      formDataToSend.append('best_results_description', formData.best_results_description);

      // Append new images
      newImages.forEach(image => {
        formDataToSend.append('images', image);
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
      console.error('Error updating product:', error);
      setError(error.response?.data?.message || 'Error updating product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="admin-form">
        <div className="form-header">
          <h2>Edit Product</h2>
          <button onClick={onClose} className="close-button">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit}>
          {/* Basic Information */}
          <div className="form-section">
            <h3>Basic Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
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

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
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
                required
              />
            </div>
            <div className="form-group">
              <label>How to Use</label>
              <textarea
                name="how_to_use"
                value={formData.how_to_use}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Functions</label>
              <textarea
                name="functions"
                value={formData.functions}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Taglines</label>
              <textarea
                name="taglines"
                value={formData.taglines}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Additional Information</label>
              <textarea
                name="additional_info"
                value={formData.additional_info}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Hero Ingredients */}
          <div className="form-section">
            <h3>Hero Ingredients</h3>
            <div className="form-group">
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
                {heroIngredients.map(ingredient => (
                  <option key={ingredient._id} value={ingredient._id}>
                    {ingredient.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedHeroIngredients.map((hi, index) => (
              <div key={hi.ingredient} className="variant-row">
                <div>
                  {heroIngredients.find(h => h._id === hi.ingredient)?.name}
                </div>
                <input
                  type="text"
                  value={hi.description}
                  onChange={(e) => handleHeroIngredientDescription(hi.ingredient, e.target.value)}
                  placeholder="Description"
                />
                <button
                  type="button"
                  onClick={() => removeHeroIngredient(hi.ingredient)}
                  className="action-button remove"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            ))}
          </div>

          {/* Variants */}
          <div className="form-section">
            <h3>Variants</h3>
            <div className="variant-section">
              {formData.variants.map((variant, index) => (
                <div key={index} className="variant-row">
                  <select
                    value={variant.name}
                    onChange={(e) => handleVariantChange(index, 'name', e.target.value)}
                    required
                  >
                    <option value="">Select Size</option>
                    {VARIANT_SIZES.map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={variant.price}
                    onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                    placeholder="Price"
                    required
                  />
                  <input
                    type="number"
                    value={variant.stock_quantity}
                    onChange={(e) => handleVariantChange(index, 'stock_quantity', e.target.value)}
                    placeholder="Stock"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => removeVariant(index)}
                    className="action-button remove"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addVariant}
                className="action-button add"
                disabled={formData.variants.length >= VARIANT_SIZES.length}
              >
                <FontAwesomeIcon icon={faPlus} /> Add Variant
              </button>
            </div>
          </div>

          {/* Related Products */}
          <div className="form-section">
            <h3>Related Products</h3>
            <div className="related-products-section">
              <div className="form-group">
                <select
                  value={selectedRelatedProduct}
                  onChange={(e) => setSelectedRelatedProduct(e.target.value)}
                >
                  <option value="">Select Related Product</option>
                  {allProducts
                    .filter(p => p._id !== product._id)
                    .map(product => (
                      <option key={product._id} value={product._id}>
                        {product.name}
                      </option>
                    ))}
                </select>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  value={relatedProductDescription}
                  onChange={(e) => setRelatedProductDescription(e.target.value)}
                  placeholder="Description of relationship"
                />
              </div>
              <button
                type="button"
                onClick={handleAddRelatedProduct}
                className="action-button add"
                disabled={!selectedRelatedProduct || !relatedProductDescription}
              >
                <FontAwesomeIcon icon={faPlus} /> Add Related Product
              </button>

              {formData.related_products.map((rp, index) => (
                <div key={index} className="related-product-row">
                  <div>
                    {allProducts.find(p => p._id === rp.product)?.name}
                  </div>
                  <div>{rp.description}</div>
                  <button
                    type="button"
                    onClick={() => handleRemoveRelatedProduct(index)}
                    className="action-button remove"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Images */}
          <div className="form-section">
            <h3>Images</h3>
            <div className="form-group">
              <input
                type="file"
                onChange={handleNewImageChange}
                multiple
                accept="image/*"
              />
            </div>
            
            <div className="image-preview-grid">
              {existingImages.map((url, index) => (
                <div key={index} className="image-preview">
                  <img src={url} alt={`Product ${index + 1}`} />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(index)}
                    className="action-button remove"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              ))}
              
              {imagePreview.map((url, index) => (
                <div key={`new-${index}`} className="image-preview">
                  <img src={url} alt={`New ${index + 1}`} />
                  <button
                    type="button"
                    onClick={() => removeNewImage(index)}
                    className="action-button remove"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Updating...' : 'Update Product'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProductForm;
