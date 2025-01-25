import React, { useState } from 'react';
import { Link } from "react-router-dom";
import "../../Assets/Css/ProductPage/ProductFilters.scss"; // Import the SCSS file for this component

const ProductFilters = () => {
  const [openSection, setOpenSection] = useState(null);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const handlePriceChange = (e, type) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (type === 'min') setMinPrice(value);
    else setMaxPrice(value);
  };

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
                <li className="list-group-item">Skincare</li>
                <li className="list-group-item">Makeup</li>
                <li className="list-group-item">Haircare</li>
                <li className="list-group-item">Bodycare</li>
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
                <div className="price-inputs">
                  <input
                    type="text"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => handlePriceChange(e, 'min')}
                  />
                  <input
                    type="text"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => handlePriceChange(e, 'max')}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="browse-category">
        <h3>Browse by Popular Category</h3>
        <div className="category-tags">
          <Link to="/cleansers">Cleansers</Link>
          <Link to="/face-mask">Face Mask</Link>
          <Link to="/lipstick">Lipstick</Link>
          <Link to="/sunscreens">Sunscreens</Link>
          <Link to="/face-moisturizers">Face Moisturizers</Link>
          <Link to="/mascara">Mascara</Link>
          <Link to="/foundations">Foundations</Link>
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
              <ul className="filter-list">
                <li>Under $50</li>
                <li>$50 - $100</li>
                <li>Over $100</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="browse-category mt-4">
        <h3>Browse by Popular Category</h3>
        <div className="category-tags">
          <Link to="/cleansers">Cleansers</Link>
          <Link to="/face-mask">Face Mask</Link>
          <Link to="/lipstick">Lipstick</Link>
          <Link to="/sunscreens">Sunscreens</Link>
          <Link to="/face-moisturizers">Face Moisturizers</Link>
          <Link to="/mascara">Mascara</Link>
          <Link to="/foundations">Foundations</Link>
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
