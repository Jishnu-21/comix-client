// src/Components/Admin/ProductsContent.jsx
import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faBan, faEye, faPlus, faArrowLeft, faCheck, faStar as fasStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import AddProductForm from './AddProductForm';
import '../../Assets/Css/Admin/ProductContent.scss';

const ProductsContent = ({ onEditProduct, refreshTrigger }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get('/admin/products/');
        console.log('Products response:', response.data);

        if (response.data.success) {
          setProducts(response.data.products);
          setError(null);
        } else {
          throw new Error(response.data.message || 'Failed to fetch products');
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.response?.data?.message || err.message || 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [refreshTrigger]);

  const handleAddProduct = () => {
    setIsAddFormOpen(true);
  };

  const handleCloseAddForm = () => {
    setIsAddFormOpen(false);
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get('/admin/products/');
        console.log('Products response:', response.data);

        if (response.data.success) {
          setProducts(response.data.products);
          setError(null);
        } else {
          throw new Error(response.data.message || 'Failed to fetch products');
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.response?.data?.message || err.message || 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  };

  const handleToggleBlockStatus = async (productId) => {
    try {
      const productToUpdate = products.find(p => p._id === productId);
      const newStatus = !productToUpdate.isBlocked;
      
      await api.patch(`/admin/products/block/${productId}`, { isBlocked: newStatus });
      
      setProducts(prevProducts => 
        prevProducts.map(p => p._id === productId ? { ...p, isBlocked: newStatus } : p)
      );
    } catch (error) {
      console.error('Error updating product status:', error);
      setError('Failed to update product status. Please try again.');
    }
  };

  const handleView = async (productId) => {
    try {
      setLoading(true);
      // First try to get from admin endpoint
      const response = await api.get(`/admin/products/${productId}`);
      
      if (response.data && response.data.product) {
        setSelectedProduct(response.data.product);
        setError(null);
      } else {
        throw new Error('Product not found');
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
      setError('Failed to fetch product details. Please try again.');
      setSelectedProduct(null);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setSelectedProduct(null);
  };

  const getCategoryName = (product) => {
    if (product.category_id && typeof product.category_id === 'object' && product.category_id.name) {
      return product.category_id.name;
    } else if (product.category && typeof product.category === 'object' && product.category.name) {
      return product.category.name;
    } else {
      return 'N/A';
    }
  };

  const getSubcategoryName = (product) => {
    if (product.subcategory_id && typeof product.subcategory_id === 'object' && product.subcategory_id.name) {
      return product.subcategory_id.name;
    } else if (product.subcategory && typeof product.subcategory === 'object' && product.subcategory.name) {
      return product.subcategory.name;
    } else {
      return 'N/A';
    }
  };

  // Helper function to format array fields without quotes and brackets
  const formatArrayField = (field) => {
    if (!field) return '';
    
    // If it's already a string, remove all quotes and brackets
    if (typeof field === 'string') {
      // Remove all quotes, brackets, and extra spaces
      return field
        .replace(/[\[\]"]/g, '') // Remove brackets and quotes
        .split(',')
        .map(item => item.trim())
        .join(', ');
    }
    
    // If it's an array, just join with commas
    if (Array.isArray(field)) {
      return field.join(', ');
    }
    
    return '';
  };

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>{error}</div>;

  if (selectedProduct) {
    const rating = parseFloat(selectedProduct.rating) || 0;
    const fullStars = Math.floor(rating);

    return (
      <div className="product-details">
        <button onClick={handleBack} className="back-button">
          <FontAwesomeIcon icon={faArrowLeft} /> Back
        </button>
        <h2>{selectedProduct.name}</h2>
        
        <div className="product-images">
          <div className="image-grid">
            {selectedProduct.image_urls?.map((url, index) => (
              <img key={index} src={url} alt={`${selectedProduct.name} ${index + 1}`} />
            ))}
          </div>
        </div>
  
        <div className="product-info">
          <div className="info-grid">
            <p>
              <strong>Category:</strong>
              <span>{getCategoryName(selectedProduct)}</span>
            </p>
            <p>
              <strong>Subcategory:</strong>
              <span>{getSubcategoryName(selectedProduct)}</span>
            </p>
            <p>
              <strong>Description:</strong>
              <span>{selectedProduct.description || 'N/A'}</span>
            </p>
            <p>
              <strong>Ingredients:</strong>
              <span>{formatArrayField(selectedProduct.ingredients) || 'N/A'}</span>
            </p>
            <p>
              <strong>Hero Ingredients:</strong>
              <span>{formatArrayField(selectedProduct.hero_ingredients) || 'N/A'}</span>
            </p>
            <p>
              <strong>Functions:</strong>
              <span>{formatArrayField(selectedProduct.functions) || 'N/A'}</span>
            </p>
            <p>
              <strong>Taglines:</strong>
              <span>{formatArrayField(selectedProduct.taglines) || 'N/A'}</span>
            </p>
            <p>
              <strong>Variants:</strong>
              {selectedProduct.variants?.length > 0 ? (
                <ul className="variant-list">
                  {selectedProduct.variants.map((variant, index) => (
                    <li key={index}>
                      {variant.name} - ₹{variant.price} (Stock: {variant.stock_quantity})
                    </li>
                  ))}
                </ul>
              ) : (
                <span>No variants available</span>
              )}
            </p>
            <p>
              <strong>Rating:</strong>
              <span className="rating-display">
                <span className="stars">
                  {[...Array(5)].map((_, index) => (
                    <FontAwesomeIcon
                      key={index}
                      icon={index < fullStars ? fasStar : farStar}
                      className={index < fullStars ? 'filled' : ''}
                    />
                  ))}
                </span>
                <span>({rating.toFixed(1)})</span>
              </span>
            </p>
            <p>
              <strong>Status:</strong>
              <span>{selectedProduct.isBlocked ? 'Inactive' : 'Active'}</span>
            </p>
            <p>
              <strong>Sales:</strong>
              <span>{selectedProduct.sales || 0} units</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="products-content">
      <div className="products-header">
        <h2>Manage Products</h2>
        <button 
          onClick={handleAddProduct} 
          className="add-product-btn"
        >
          <FontAwesomeIcon icon={faPlus} /> Add New Product
        </button>
      </div>

      {isAddFormOpen && (
        <AddProductForm onClose={handleCloseAddForm} />
      )}

      <div className="products-table-container">
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Subcategory</th>
                <th>Price Range</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                // Calculate price range
                const prices = product.variants?.map(v => v.price) || [];
                const minPrice = Math.min(...prices);
                const maxPrice = Math.max(...prices);
                const priceRange = prices.length > 0 
                  ? `₹${minPrice} - ₹${maxPrice}`
                  : 'N/A';

                return (
                  <tr key={product._id}>
                    <td className="product-name">
                      <div className="product-info">
                        <div className="product-image">
                          <img 
                            src={product.image_urls?.[0] || '/placeholder.png'} 
                            alt={product.name}
                          />
                        </div>
                        <span>{product.name}</span>
                      </div>
                    </td>
                    <td>{getCategoryName(product)}</td>
                    <td>{getSubcategoryName(product)}</td>
                    <td>{priceRange}</td>
                    <td>
                      <span className={`status-badge ${product.isBlocked ? 'blocked' : 'active'}`}>
                        {product.isBlocked ? 'Inactive' : 'Active'}
                      </span>
                    </td>
                    <td className="actions">
                      <button 
                        onClick={() => handleView(product._id)} 
                        className="action-btn view"
                        title="View"
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      <button 
                        onClick={() => onEditProduct(product)} 
                        className="action-btn edit"
                        title="Edit"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button 
                        onClick={() => handleToggleBlockStatus(product._id)}
                        className="action-btn status"
                        title={product.isBlocked ? "Unblock" : "Block"}
                      >
                        {product.isBlocked ? 
                          <FontAwesomeIcon icon={faCheck} /> : 
                          <FontAwesomeIcon icon={faBan} />
                        }
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductsContent;
