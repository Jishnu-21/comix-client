import React, { useState, useEffect } from 'react';
import ProductFilters from './ProductFilters'; // Import the ProductFilters component
import ProductCard from './ProductCard'; // Import the ProductCard component
import CardComponent from './CardComponent';
import MobileFilter from './MobileFilter';
import MobileBestSellers from './MobileBestSellers';
import '../../Assets/Css/ProductPage/ProductGridLayout.scss';
import axios from 'axios'; // Import axios for API calls
import { API_URL } from '../../config/api';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
const itemsPerPage = 9;

const ProductGridLayout = ({ searchTerm, sortOption, setSortOption }) => {
  const [products, setProducts] = useState([]); // State to hold products
  const [bestSellers, setBestSellers] = useState([]); // State to hold best sellers
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

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

  const totalPages = Math.ceil(products.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const filteredProducts = searchTerm.trim() === ''
    ? products
    : products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

  // Function to get product price safely
  const getProductPrice = (product) => {
    if (!product || !product.variants || !product.variants.length) return 0;
    const price = parseFloat(product.variants[0].price);
    return isNaN(price) ? 0 : price;
  };

  // Function to sort products based on the selected option
  const sortProducts = (products) => {
    const productsToSort = [...products]; // Create a new array to avoid mutating state

    switch (sortOption) {
      case 'AtoZ':
        return productsToSort.sort((a, b) => a.name.localeCompare(b.name));
      case 'ZtoA':
        return productsToSort.sort((a, b) => b.name.localeCompare(a.name));
      case 'priceLowToHigh':
        return productsToSort.sort((a, b) => {
          const priceA = getProductPrice(a);
          const priceB = getProductPrice(b);
          return priceA - priceB;
        });
      case 'priceHighToLow':
        return productsToSort.sort((a, b) => {
          const priceA = getProductPrice(a);
          const priceB = getProductPrice(b);
          return priceB - priceA;
        });
      default:
        return productsToSort;
    }
  };

  // Apply sorting to filtered products
  const sortedProducts = sortProducts(filteredProducts);
  const displayedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) return <p>Loading products...</p>; // Loading state
  if (error) return <p>{error}</p>; // Error state

  // Check if the screen size is mobile
  const isMobile = window.innerWidth <= 768; // Adjust the breakpoint as needed

  return (
    <div className="product-grid-layout container mt-5">
      <div className="row">
        {/* Left Section */}
        <div className="col-sm-12 col-md-12 col-lg-4 col-xl-3 col-12">
          <ProductFilters />
        </div>
        <MobileFilter sortOption={sortOption} setSortOption={setSortOption} />
        {/* Right Section */}
        <div className="col-sm-12 col-md-12 col-lg-8 col-xl-9 col-12">
          <div className="result-header mb-4 d-flex justify-content-between align-items-center">
            <div className="result-count">
              {searchTerm && (
                <p>Showing all {filteredProducts.length} results</p>
              )}
            </div>
            <div className="sort-by dropdown">
              <select 
                id="sortOptions" 
                value={sortOption} 
                onChange={(e) => setSortOption(e.target.value)} // Use setSortOption here
                className="btn btn-dark dropdown-toggle"
              >
                <option value="" disabled>Sort By</option> {/* "Sort By" will be shown initially but disabled */}
                <option value="AtoZ">A to Z</option>
                <option value="ZtoA">Z to A</option>
                <option value="priceLowToHigh">Price Low to High</option>
                <option value="priceHighToLow">Price High to Low</option>
              </select>
            </div>
          </div>

          <div className="row">
            {displayedProducts.length > 0 ? (
              displayedProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <p>No products found</p>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && ( // Only show pagination if there is more than one page
            <nav>
              <ul className="pagination justify-content-center ">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={handlePreviousPage}>
                    &laquo;
                  </button>
                </li>
                {[...Array(totalPages).keys()].map((num) => (
                  <li
                    key={num + 1}
                    className={`page-item ${currentPage === num + 1 ? 'active' : ''}`}
                  >
                    <button className="page-link" onClick={() => setCurrentPage(num + 1)}>
                      {num + 1}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={handleNextPage}>
                    &raquo;
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>

      <div className="section-heading mt-5 pt-4">
        <div className="top-seller">TOP SELLER</div>
        <h2>Explore Our Best Collections</h2>
      </div>

      <div className="row mt-4">
        {isMobile ? (
          <MobileBestSellers bestSellers={bestSellers} />
        ) : (
          bestSellers.map((product) => (
            <div key={product._id} className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
              <CardComponent
                image={product.image_urls[0]} // Adjusted to use the correct image field
                title={product.name}
                price={product.variants && product.variants.length > 0 ? product.variants[0].price : 'N/A'} // Ensure variants exist
                description={product.description}
                slug={product.slug} // Pass the slug
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductGridLayout;