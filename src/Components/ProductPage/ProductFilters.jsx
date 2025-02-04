import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import "../../Assets/Css/ProductPage/ProductFilters.scss"; // Import the SCSS file for this component
import axios from 'axios';
import { API_URL } from '../../config/api';

const ProductFilters = ({ selectedCategories, onCategorySelect, onFilterChange }) => {
  const [openSection, setOpenSection] = useState(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [categories, setCategories] = useState([]);  // Initialize as empty array
  const [popularSubcategories, setPopularSubcategories] = useState([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);

  console.log('Selected Categories:', selectedCategories);
  useEffect(() => {
    getCategories();
  }, []);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const handlePriceRangeSelect = (range) => {
    // Check if the selected range is already active
    if (
      selectedPriceRange &&
      selectedPriceRange.min === range.min &&
      selectedPriceRange.max === range.max
    ) {
      // Deselect the price range if it's already selected
      setSelectedPriceRange(null);
      onFilterChange({ priceRange: null }); // Notify parent component
    } else {
      // Select the new price range
      setSelectedPriceRange(range);
      onFilterChange({ priceRange: range }); // Notify parent component
    }
  };

  const priceRanges = [
    { label: '> Rs500.00', value: { min: 0, max: 500 } },
    { label: 'Rs500.00 - Rs1000.00', value: { min: 500, max: 1000 } },
    { label: '< Rs1000.00', value: { min: 1000, max: Infinity } },
  ];

  const getCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/categories/`);
      console.log('Categories response:', response.data);
      // Ensure we're setting an array
      const categoriesData = Array.isArray(response.data) ? response.data : response.data.categories || [];
      setCategories(categoriesData);
      
      // Get all subcategories from all categories
      const allSubcategories = categoriesData.reduce((acc, category) => {
        return [...acc, ...(category.subcategories || [])];
      }, []);
      
      // Randomly select 6 subcategories
      const shuffled = allSubcategories.sort(() => 0.5 - Math.random());
      setPopularSubcategories(shuffled.slice(0, 6));
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]); // Set empty array on error
    }
  }

  const formatPrice = (value) => `$${value}`;

  const handleCategorySelect = (categoryId) => {
    const newSelectedCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId) // Remove if already selected
      : [...selectedCategories, categoryId]; // Add if not selected

    onCategorySelect(newSelectedCategories); // Update parent with new selection
  };

  const onSubcategorySelect = (subcategoryId) => {
    const newSelectedSubcategories = selectedSubcategories.includes(subcategoryId)
      ? selectedSubcategories.filter(id => id !== subcategoryId) // Remove if already selected
      : [...selectedSubcategories, subcategoryId]; // Add if not selected

    setSelectedSubcategories(newSelectedSubcategories); // Update local state
    onFilterChange({ subcategories: newSelectedSubcategories }); // Update parent with new selection
  };

  useEffect(() => {
    onFilterChange({ subcategories: selectedSubcategories });
  }, [selectedSubcategories]);

  // Desktop version remains the same
  const DesktopFilter = () => (
    <div className="product-filters p-4">
      <div className="accordion" id="filterAccordion">
        {/* Categories Filter */}
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingOne">
            <button
              className={`accordion-button ${openSection !== 'categories' ? 'collapsed' : ''}`}
              type="button"
              onClick={() => toggleSection('categories')}
            >
              Categories
            </button>
          </h2>
          <div
            className={`accordion-collapse ${openSection === 'categories' ? 'show' : ''}`}
            aria-labelledby="headingOne"
          >
            <div className="accordion-body">
              <ul className="list-group">
                {categories.map((category) => (
                  <li key={category._id} className="list-group-item">
                    <span
                      onClick={() => handleCategorySelect(category._id)}
                      style={{ cursor: 'pointer', color: selectedCategories.includes(category._id) ? 'gold' : 'white' }}
                    >
                      {category.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Skin Type Filter */}
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingTwo">
            <button
              className={`accordion-button ${openSection !== 'skinType' ? 'collapsed' : ''}`}
              type="button"
              onClick={() => toggleSection('skinType')}
            >
              Skin Type
            </button>
          </h2>
          <div
            className={`accordion-collapse ${openSection === 'skinType' ? 'show' : ''}`}
            aria-labelledby="headingTwo"
          >
            <div className="accordion-body">
              <ul className="list-group">
                <li className="list-group-item">All Skin Types</li>
                <li className="list-group-item">Oily</li>
                <li className="list-group-item">Dry</li>
                <li className="list-group-item">Combination</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Price Range Filter */}
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingThree">
            <button
              className={`accordion-button ${openSection !== 'priceRange' ? 'collapsed' : ''}`}
              type="button"
              onClick={() => toggleSection('priceRange')}
            >
              Price Range
            </button>
          </h2>
          <div
            className={`accordion-collapse ${openSection === 'priceRange' ? 'show' : ''}`}
            aria-labelledby="headingThree"
          >
            <div className="accordion-body">
              <ul className="list-group">
                {priceRanges.map((range, index) => (
                  <li key={index} className="list-group-item">
                    <span
                      onClick={() => handlePriceRangeSelect(range.value)}
                      className={`price-button ${selectedPriceRange && selectedPriceRange.min === range.value.min && selectedPriceRange.max === range.value.max ? 'selected' : ''}`}
                      style={{ cursor: 'pointer', color: selectedPriceRange && selectedPriceRange.min === range.value.min && selectedPriceRange.max === range.value.max ? 'gold' : 'white' }}
                    >
                      {range.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="browse-category">
        <h3>Browse by Popular Category</h3>
        <div className="category-tags">
          {popularSubcategories.map((subcategory) => (
            <span
              key={subcategory._id}
              onClick={() => onSubcategorySelect(subcategory._id)}
              className={`subcategory-button ${selectedSubcategories.includes(subcategory._id) ? 'selected' : ''}`}
            >
              {subcategory.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  // New iPad/Tablet version
  const TabletFilter = () => (
    <div className="tablet-filter">
      <div className="filter-buttons mb-3">
        <button 
          className="filter-btn" 
          data-bs-toggle="collapse" 
          data-bs-target="#categoriesCollapse" 
          aria-expanded="false"
        >
          Categories
        </button>
        <button 
          className="filter-btn" 
          data-bs-toggle="collapse" 
          data-bs-target="#skinTypeCollapse" 
          aria-expanded="false"
        >
          Skin Type
        </button>
        <button 
          className="filter-btn" 
          data-bs-toggle="collapse" 
          data-bs-target="#priceCollapse" 
          aria-expanded="false"
        >
          Price Range
        </button>
      </div>

      <div className="row">
        <div className="col">
          <div className="collapse" id="categoriesCollapse">
            <div className="filter-card">
              <h3>Categories</h3>
              <ul className="filter-list">
                <li>Skincare</li>
                <li>Makeup</li>
                <li>Haircare</li>
                <li>Bodycare</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="collapse" id="skinTypeCollapse">
            <div className="filter-card">
              <h3>Skin Type</h3>
              <ul className="filter-list">
                <li>All Skin Types</li>
                <li>Oily</li>
                <li>Dry</li>
                <li>Combination</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="collapse" id="priceCollapse">
            <div className="filter-card">
              <h3>Price Range</h3>
              <div className="price-range">
                {priceRanges.map((range) => (
                  <span
                    key={range.label}
                    onClick={() => handlePriceRangeSelect(range.value)}
                    className={`price-button ${selectedPriceRange && selectedPriceRange.min === range.value.min && selectedPriceRange.max === range.value.max ? 'selected' : ''}`}
                  >
                    {range.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="browse-category mt-4">
        <h3>Browse by Popular Category</h3>
        <div className="category-tags">
          {popularSubcategories.map((subcategory) => (
            <span
              key={subcategory._id}
              onClick={() => onSubcategorySelect(subcategory._id)}
              className={`subcategory-button ${selectedSubcategories.includes(subcategory._id) ? 'selected' : ''}`}
            >
              {subcategory.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="d-none d-lg-block">
        <DesktopFilter />
      </div>
      <div className="d-lg-none">
        <TabletFilter />
      </div>
    </>
  );
};

export default ProductFilters;
