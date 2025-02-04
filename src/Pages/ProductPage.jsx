import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config/api';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import Banner from '../Components/ProductPage/Banner';
import SearchBar from '../Components/ProductPage/SearchBar';
import MobileFilter from '../Components/ProductPage/MobileFilter';
import ProductGridLayout from '../Components/ProductPage/ProductGridLayout'; 
import Touch from '../Components/Touch';
import LoadingScreen from '../Components/LoadingScreen';

import '../Assets/Css/ProductPage/ProductPage.scss';


const ProductPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({
    category: null,
    subcategories: [],
    skinType: null,
    priceRange: {
      min: 0,
      max: 1000
    }
  });

  // Effect to handle initial category load and updates
  useEffect(() => {
    const handleInitialCategory = () => {
      // Check URL state first
      if (location.state?.selectedCategory) {
        return location.state.selectedCategory;
      }
      // Then check localStorage
      const savedCategory = localStorage.getItem('lastSelectedCategory');
      if (savedCategory) {
        return savedCategory;
      }
      return null;
    };

    const categoryId = handleInitialCategory();
    if (categoryId) {
      setSelectedFilters(prev => ({
        ...prev,
        category: categoryId
      }));
      fetchProducts(categoryId);
    } else {
      fetchProducts(); // Fetch all products if no category is selected
    }
  }, [location.state]);

  const fetchProducts = async (categoryId = null) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      // Use the provided categoryId or the one from state
      const activeCategoryId = categoryId || selectedFilters.category;
      if (activeCategoryId) {
        queryParams.append('category_id', activeCategoryId);
      }
      
      // Add subcategories if any are selected
      if (selectedFilters.subcategories.length > 0) {
        selectedFilters.subcategories.forEach(subId => {
          queryParams.append('subcategories[]', subId);
        });
      }

      // Add other filters
      if (selectedFilters.skinType) {
        queryParams.append('skinType', selectedFilters.skinType);
      }
      if (selectedFilters.priceRange) {
        queryParams.append('minPrice', selectedFilters.priceRange.min);
        queryParams.append('maxPrice', selectedFilters.priceRange.max);
      }
      if (searchTerm) {
        queryParams.append('search', searchTerm);
      }

      const response = await axios.get(`${API_URL}/products?${queryParams.toString()}`);
      
      if (response.data.success) {
        setProducts(response.data.products || []);
        setError(null);
      } else {
        setError('Failed to fetch products');
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to fetch products. Please try again later.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    const updatedFilters = {
      ...selectedFilters,
      ...newFilters
    };
    setSelectedFilters(updatedFilters);
    
    // If category changed, update localStorage and URL state
    if (newFilters.category !== undefined) {
      if (newFilters.category) {
        localStorage.setItem('lastSelectedCategory', newFilters.category);
        navigate('.', { 
          state: { selectedCategory: newFilters.category },
          replace: true 
        });
      } else {
        localStorage.removeItem('lastSelectedCategory');
        navigate('.', { 
          state: {},
          replace: true 
        });
      }
    }
    
    fetchProducts(newFilters.category);
  };

  return (
    <div className="product-page fade-in">
      <Header />
      <div className="container">
        <Banner />
        <div className="search-filter-row">
          <SearchBar searchTerm={searchTerm} handleSearch={setSearchTerm} />
          <MobileFilter 
            sortOption={sortOption}
            setSortOption={setSortOption}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
          />
        </div>
        {loading ? (
          <LoadingScreen />
        ) : error ? (
          <p>{error}</p>
        ) : (
          <ProductGridLayout 
            products={products}
            searchTerm={searchTerm} 
            sortOption={sortOption} 
            setSortOption={setSortOption}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
          />
        )}
      </div>
      <Touch />
      <Footer />
    </div>
  );
};

export default ProductPage;