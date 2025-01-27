import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import "../../Assets/Css/ProductPage/ProductFilters.scss"; // Import the SCSS file for this component
import axios from 'axios';
import { API_URL } from '../../config/api';

const ProductFilters = () => {
  const [openSection, setOpenSection] = useState(null);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [categories, setCategories] = useState([]);  // Initialize as empty array
  const [popularSubcategories, setPopularSubcategories] = useState([]);

  useEffect(() => {
    getCategories();
  }, []);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const handleMinPriceChange = (e) => {
    const value = Number(e.target.value);
    setMinPrice(Math.min(value, maxPrice));
  };

  const handleMaxPriceChange = (e) => {
    const value = Number(e.target.value);
    setMaxPrice(Math.max(value, minPrice));
  };

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

  // Desktop version remains the same
  const DesktopFilter = () => (
    <div className="product-filters p-4">
      <div className="accordion" id="filterAccordion">
        {/* Categories Filter */}
        <div className={`accordion-item ${openSection === 'categories' ? 'open' : ''}`}>
          <h2 className="accordion-header" id="headingOne">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseOne"
              aria-expanded="false"
              aria-controls="collapseOne"
              onClick={() => toggleSection('categories')}
            >
              Categories
            </button>
          </h2>
          <div
            id="collapseOne"
            className={`accordion-collapse collapse ${openSection === 'categories' ? 'show' : ''}`}
            aria-labelledby="headingOne"
            data-bs-parent="#filterAccordion"
          >
            <div className="accordion-body">
              <ul className="list-group">
                {categories.map((category) => (
                  <li key={category._id} className="list-group-item">
                    {category.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Skin Type Filter */}
        <div className={`accordion-item ${openSection === 'skinType' ? 'open' : ''}`}>
          <h2 className="accordion-header" id="headingTwo">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseTwo"
              aria-expanded="false"
              aria-controls="collapseTwo"
              onClick={() => toggleSection('skinType')}
            >
              Skin Type
            </button>
          </h2>
          <div
            id="collapseTwo"
            className={`accordion-collapse collapse ${openSection === 'skinType' ? 'show' : ''}`}
            aria-labelledby="headingTwo"
            data-bs-parent="#filterAccordion"
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
        <div className={`accordion-item ${openSection === 'price' ? 'open' : ''}`}>
          <h2 className="accordion-header" id="headingThree">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseThree"
              aria-expanded="false"
              aria-controls="collapseThree"
              onClick={() => toggleSection('price')}
            >
              Price Range
            </button>
          </h2>
          <div
            id="collapseThree"
            className={`accordion-collapse collapse ${openSection === 'price' ? 'show' : ''}`}
            aria-labelledby="headingThree"
            data-bs-parent="#filterAccordion"
          >
            <div className="accordion-body">
              <div className="price-range">
                <div className="price-slider">
                  <div className="slider-container text-white">
                    <label>Min Price: {formatPrice(minPrice)}</label>
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      value={minPrice}
                      onChange={handleMinPriceChange}
                      className="price-range-input"
                    />
                  </div>
                  <div className="slider-container text-white">
                    <label>Max Price: {formatPrice(maxPrice)}</label>
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      value={maxPrice}
                      onChange={handleMaxPriceChange}
                      className="price-range-input"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="browse-category">
        <h3>Browse by Popular Category</h3>
        <div className="category-tags">
          {popularSubcategories.map((subcategory) => (
            <Link 
              key={subcategory._id} 
              to={`/category/${subcategory.name.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {subcategory.name}
            </Link>
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
                <div className="price-slider">
                  <div className="slider-container">
                    <label>Min Price: {formatPrice(minPrice)}</label>
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      value={minPrice}
                      onChange={handleMinPriceChange}
                      className="price-range-input"
                    />
                  </div>
                  <div className="slider-container">
                    <label>Max Price: {formatPrice(maxPrice)}</label>
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      value={maxPrice}
                      onChange={handleMaxPriceChange}
                      className="price-range-input"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="browse-category mt-4">
        <h3>Browse by Popular Category</h3>
        <div className="category-tags">
          {popularSubcategories.map((subcategory) => (
            <Link 
              key={subcategory._id} 
              to={`/category/${subcategory.name.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {subcategory.name}
            </Link>
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
