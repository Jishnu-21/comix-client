import React, { useState, useEffect } from 'react';
import ProductFilters from './ProductFilters'; // Import the ProductFilters component
import ProductCard from './ProductCard'; // Import the ProductCard component
import CardComponent from './CardComponent';
import '../../Assets/Css/ProductPage/ProductGridLayout.scss';
import axios from 'axios'; // Import axios for API calls
import { API_URL } from '../../config/api';
import MobileFilter from './MobileFilter';

const itemsPerPage = 9;
const ProductGridLayout = ({ searchTerm, sortOption, setSortOption }) => {
  const [products, setProducts] = useState([]); // State to hold products
  const [bestSellers, setBestSellers] = useState([]); // State to hold best sellers
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [filters, setFilters] = useState({
    category: null,
    priceRange: { min: 0, max: 1000 }
  });

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Get filtered products
  const getFilteredProducts = () => {
    return products.filter(product => {
      // Filter by category
      if (filters.category && product.category !== filters.category) {
        return false;
      }

      // Filter by price
      const price = parseFloat(product.variants[0].price);
      if (price < filters.priceRange.min || price > filters.priceRange.max) {
        return false;
      }

      // Filter by search term
      if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      return true;
    });
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_URL}/products`); // Adjust the endpoint as necessary
        if (response.data.success) {
          setProducts(Array.isArray(response.data.products) ? response.data.products : []);
        } else {
          setError('Failed to fetch products');
        }
        console.log('Fetched products:', response.data); // Log the response
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to fetch products');
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    const fetchBestSellers = async () => {
      try {
        const response = await axios.get(`${API_URL}/products`); // Use the same endpoint for best sellers
        if (response.data.success) {
          setBestSellers(Array.isArray(response.data.products) ? response.data.products : []);
        } else {
          setError('Failed to fetch best sellers');
        }
        console.log('Fetched best sellers:', response.data); // Log the response
      } catch (err) {
        console.error('Error fetching best sellers:', err);
        setError('Failed to fetch best sellers');
      }
    };

    fetchProducts();
    fetchBestSellers();
  }, []);

  // Apply sorting to filtered products
  const getSortedProducts = (filteredProducts) => {
    if (!sortOption) return filteredProducts;

    return [...filteredProducts].sort((a, b) => {
      switch (sortOption) {
        case 'AtoZ':
          return a.name.localeCompare(b.name);
        case 'ZtoA':
          return b.name.localeCompare(a.name);
        case 'priceLowToHigh':
          return parseFloat(a.variants[0].price) - parseFloat(b.variants[0].price);
        case 'priceHighToLow':
          return parseFloat(b.variants[0].price) - parseFloat(a.variants[0].price);
        default:
          return 0;
      }
    });
  };

  const filteredProducts = getFilteredProducts();
  const sortedProducts = getSortedProducts(filteredProducts);
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const displayedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  if (loading) return <p>Loading products...</p>; // Loading state
  if (error) return <p>{error}</p>; // Error state

  return (
    <div className="product-grid-container">
      <div className="row">
        {/* Left Section */}
        <div className="col-sm-12 col-md-12 col-lg-4 col-xl-3 col-12">
          <ProductFilters onFilterChange={handleFilterChange} />
        </div>
        {/* Right Section */}
        <div className="col-sm-12 col-md-12 col-lg-8 col-xl-9 col-12">
          <div className="product-grid">
            {loading ? (
              <div>Loading...</div>
            ) : error ? (
              <div>{error}</div>
            ) : displayedProducts.length === 0 ? (
              <div>No products found matching your criteria</div>
            ) : (
              <>
                <div className="row">
                  {displayedProducts.map((product) => (
                    <div key={product._id} className="col-sm-6 col-md-6 col-lg-4 mb-4">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className="pagination justify-content-center mt-4">
                    <button
                      className="btn btn-outline-primary me-2"
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                    {[...Array(totalPages).keys()].map((num) => (
                      <button
                        key={num + 1}
                        onClick={() => setCurrentPage(num + 1)}
                        className={`btn ${
                          currentPage === num + 1 ? 'btn-primary' : 'btn-outline-primary'
                        } me-2`}
                      >
                        {num + 1}
                      </button>
                    ))}
                    <button
                      className="btn btn-outline-primary"
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <div className="row mt-5">
        <div className="col-lg-10 col-md-9 col-sm-12">
          <p className="section-subtitle">
            Top Seller
          </p>
          <h2 className="section-title d-none d-md-block">
            Explore Our Best Collections
          </h2>
          <h2 className="section-title d-md-none">
            Best Collections
          </h2>
        </div>
        <div className="col-lg-2 col-md-3 col-sm-12 d-flex justify-content-end align-items-center">
        </div>
      </div>
      <div className='row mt-4'>
        {bestSellers.map((product) => (
          <CardComponent
            key={product._id}
            image={product.image_urls[0]}
            title={product.name}
            price={product.variants && product.variants.length > 0 ? product.variants[0].price : 'N/A'}
            description={product.description}
            slug={product.slug}
            category={product.category}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductGridLayout;