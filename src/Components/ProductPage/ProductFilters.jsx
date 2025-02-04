import React, { useState, useEffect } from 'react';
import "../../Assets/Css/ProductPage/ProductFilters.scss";
import { API_URL } from '../../config/api';

const ProductFilters = ({ selectedFilters = {}, onFilterChange }) => {
  const [openSection, setOpenSection] = useState(null);
  const [categories, setCategories] = useState([]);
  const [popularSubcategories, setPopularSubcategories] = useState([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState(selectedFilters.subcategories || []);

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    // Safely update subcategories from props
    if (selectedFilters && Array.isArray(selectedFilters.subcategories)) {
      setSelectedSubcategories(selectedFilters.subcategories);
    }
  }, [selectedFilters?.subcategories]);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const handlePriceRangeSelect = (range) => {
    const isCurrentlySelected = 
      selectedFilters?.priceRange?.min === range.min && 
      selectedFilters?.priceRange?.max === range.max;

    onFilterChange({
      ...selectedFilters,
      priceRange: isCurrentlySelected ? null : range
    });
  };

  const getCategories = async () => {
    try {
      const response = await fetch(`${API_URL || ''}/categories/`);
      if (!response.ok) throw new Error('Failed to fetch categories');
      
      const data = await response.json();
      const categoriesData = Array.isArray(data) ? data : data.categories || [];
      setCategories(categoriesData);
      
      const allSubcategories = categoriesData.reduce((acc, category) => {
        return [...acc, ...(category.subcategories || [])];
      }, []);
      
      const shuffled = [...allSubcategories].sort(() => 0.5 - Math.random());
      setPopularSubcategories(shuffled.slice(0, 6));
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
      setPopularSubcategories([]);
    }
  };

  const handleCategorySelect = (categoryId) => {
    onFilterChange({
      ...selectedFilters,
      category: selectedFilters?.category === categoryId ? null : categoryId,
      subcategories: [] // Reset subcategories when changing category
    });
  };

  const handleSubcategorySelect = (subcategoryId) => {
    const newSubcategories = selectedSubcategories.includes(subcategoryId)
      ? selectedSubcategories.filter(id => id !== subcategoryId)
      : [...selectedSubcategories, subcategoryId];

    onFilterChange({
      ...selectedFilters,
      subcategories: newSubcategories
    });
  };

  const priceRanges = [
    { label: '< Rs500.00', value: { min: 0, max: 500 } },
    { label: 'Rs500.00 - Rs1000.00', value: { min: 500, max: 1000 } },
    { label: '> Rs1000.00', value: { min: 1000, max: Infinity } }
  ];

  // Rest of the component remains the same, just add optional chaining where needed
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
                      style={{ 
                        cursor: 'pointer', 
                        color: selectedFilters?.category === category._id ? 'gold' : 'white'
                      }}
                    >
                      {category.name}
                    </span>
                  </li>
                ))}
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
                {priceRanges.map((range) => (
                  <li key={range.label} className="list-group-item">
                    <span
                      onClick={() => handlePriceRangeSelect(range.value)}
                      className={`price-button ${
                        selectedFilters?.priceRange?.min === range.value.min ? 'selected' : ''
                      }`}
                      style={{ 
                        cursor: 'pointer', 
                        color: selectedFilters?.priceRange?.min === range.value.min ? 'gold' : 'white' 
                      }}
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
              onClick={() => handleSubcategorySelect(subcategory._id)}
              className={`subcategory-button ${
                selectedSubcategories.includes(subcategory._id) ? 'selected' : ''
              }`}
            >
              {subcategory.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

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
                {categories.map((category) => (
                  <li key={category._id}>
                    <span
                      onClick={() => handleCategorySelect(category._id)}
                      style={{ 
                        cursor: 'pointer', 
                        color: selectedFilters?.category === category._id ? 'gold' : 'white'
                      }}
                    >
                      {category.name}
                    </span>
                  </li>
                ))}
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
                    className={`price-button ${
                      selectedFilters?.priceRange?.min === range.value.min ? 'selected' : ''
                    }`}
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
              onClick={() => handleSubcategorySelect(subcategory._id)}
              className={`subcategory-button ${
                selectedSubcategories.includes(subcategory._id) ? 'selected' : ''
              }`}
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