import React, { useState, useEffect } from 'react';
import '../../Assets/Css/ProductPage/MobileFilter.scss';
import { MdFilterList, MdClose } from "react-icons/md";

const MobileFilter = ({ sortOption, setSortOption }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const toggleFilter = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="mobile-filter">
        <div 
          onClick={toggleFilter} 
          className="filter-toggle" 
          role="button" 
          tabIndex={0} 
          onKeyPress={(e) => e.key === 'Enter' && toggleFilter()}
        >
          <MdFilterList className="filter-icon" />
          <span className="filter-text">Filter</span>
        </div>
      </div>

      {isOpen && (
        <div className="filter-page">
          <div className="filter-header">
            <h2>Filters</h2>
            <button className="close-button" onClick={toggleFilter}>
              <MdClose />
            </button>
          </div>

          <div className="filter-content">
            <div className="filter-section">
              <h3>Sort By</h3>
              <select 
                id="sortOptions" 
                value={sortOption} 
                onChange={(e) => setSortOption(e.target.value)} 
                className="sort-select"
              >
                <option value="" disabled>Select Option</option>
                <option value="AtoZ">A to Z</option>
                <option value="ZtoA">Z to A</option>
                <option value="priceLowToHigh">Price Low to High</option>
                <option value="priceHighToLow">Price High to Low</option>
              </select>
            </div>

            <div className="filter-section">
              <h3>Categories</h3>
              <div className="filter-options">
                <label className="filter-option">
                  <input type="checkbox" name="category" value="hairCare" />
                  <span>Hair Care</span>
                </label>
                <label className="filter-option">
                  <input type="checkbox" name="category" value="skinCare" />
                  <span>Skin Care</span>
                </label>
                <label className="filter-option">
                  <input type="checkbox" name="category" value="oralCare" />
                  <span>Oral Care</span>
                </label>
                <label className="filter-option">
                  <input type="checkbox" name="category" value="bodyCare" />
                  <span>Body Care</span>
                </label>
              </div>
            </div>

            <div className="filter-actions">
              <button className="clear-btn">Clear All</button>
              <button className="apply-btn" onClick={toggleFilter}>Apply</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MobileFilter;