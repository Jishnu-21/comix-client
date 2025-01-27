import React, { useState, useEffect } from 'react';
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
  const [searchTerm, setSearchTerm] = useState(''); 
  const [sortOption, setSortOption] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({
    category: null,
    skinType: null,
    priceRange: {
      min: 0,
      max: 1000
    }
  });

  useEffect(() => {
    fetchProducts();
  }, [selectedFilters]); // Re-fetch when filters change

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Build query parameters based on filters
      const queryParams = new URLSearchParams();
      
      if (selectedFilters.category) {
        queryParams.append('category', selectedFilters.category);
      }
      if (selectedFilters.skinType) {
        queryParams.append('skinType', selectedFilters.skinType);
      }
      queryParams.append('minPrice', selectedFilters.priceRange.min);
      queryParams.append('maxPrice', selectedFilters.priceRange.max);

      const response = await axios.get(`${API_URL}/products?${queryParams.toString()}`);
      console.log('Fetched products:', response.data.products);
      setProducts(response.data.products);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to fetch products. Please try again later.');
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    console.log('New filters:', newFilters);
    setSelectedFilters(prevFilters => ({
      ...prevFilters,
      ...newFilters
    }));
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
            setSelectedFilters={setSelectedFilters}
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
      <Touch/>
      <Footer />
    </div>
  );
}

export default ProductPage;
