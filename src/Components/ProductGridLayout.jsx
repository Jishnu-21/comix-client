import React, { useState, useEffect, useCallback } from 'react';
import ProductFilters from './ProductFilters';
import ProductCard from './ProductCard';
import CardComponent from './CardComponent';
import axios from 'axios';
import { API_URL } from '../../config/api';
import { useMediaQuery } from 'react-responsive';

const ProductGridLayout = ({ 
  searchTerm, 
  sortOption, 
  setSortOption,
  categoryProducts,
  categoryId,
  isCategoryPage
}) => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });
  const itemsPerPage = isMobile || isTablet ? 6 : 9;
  
  const [products, setProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: null,
    priceRange: { min: 0, max: 1000 }
  });

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Get filtered products
  const getFilteredProducts = useCallback(() => {
    const productsToFilter = isCategoryPage ? categoryProducts : products;

    return productsToFilter.filter(product => {
      // Apply price filter
      const price = parseFloat(product.variants[0]?.price || 0);
      if (price < filters.priceRange.min || price > filters.priceRange.max) {
        return false;
      }

      // Apply search filter
      if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      return true;
    });
  }, [isCategoryPage, categoryProducts, products, filters, searchTerm]);

  useEffect(() => {
    // Only fetch all products if we're NOT on a category page
    if (!isCategoryPage) {
      const fetchProducts = async () => {
        try {
          const response = await axios.get(`${API_URL}/products`);
          if (response.data.success) {
            setProducts(Array.isArray(response.data.products) ? response.data.products : []);
          } else {
            setError('Failed to fetch products');
          }
        } catch (err) {
          console.error('Error fetching products:', err);
          setError('Failed to fetch products');
        } finally {
          setLoading(false);
        }
      };

      fetchProducts();
    } else {
      setProducts(categoryProducts);
      setLoading(false);
    }

    // Fetch best sellers
    const fetchBestSellers = async () => {
      try {
        const endpoint = isCategoryPage
          ? `${API_URL}/products/bestsellers/${categoryId}`
          : `${API_URL}/products/bestsellers`;
        
        const response = await axios.get(endpoint);
        if (response.data.success) {
          setBestSellers(Array.isArray(response.data.products) ? response.data.products : []);
        }
      } catch (err) {
        console.error('Error fetching best sellers:', err);
      }
    };

    fetchBestSellers();
  }, [categoryProducts, categoryId, isCategoryPage]);

  // Apply sorting to filtered products
  const getSortedProducts = useCallback((filteredProducts) => {
    if (!sortOption) return filteredProducts;

    return [...filteredProducts].sort((a, b) => {
      const priceA = parseFloat(a.variants[0]?.price || 0);
      const priceB = parseFloat(b.variants[0]?.price || 0);

      switch (sortOption) {
        case 'price-low-high':
          return priceA - priceB;
        case 'price-high-low':
          return priceB - priceA;
        case 'name-a-z':
          return a.name.localeCompare(b.name);
        case 'name-z-a':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });
  }, [sortOption]);

  const filteredProducts = getFilteredProducts();
  const sortedProducts = getSortedProducts(filteredProducts);

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedProducts = sortedProducts.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row gap-6">
        <aside className="w-full md:w-1/4">
          <ProductFilters 
            onFilterChange={handleFilterChange}
            currentFilters={filters}
          />
        </aside>

        <main className="w-full md:w-3/4">
          {displayedProducts.length === 0 ? (
            <div className="text-center py-8">
              <h2 className="text-xl font-semibold mb-2">No Products Found</h2>
              <p className="text-gray-600">Try adjusting your filters or search criteria</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayedProducts.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8 mb-4">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => handlePageChange(index + 1)}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === index + 1
                          ? 'bg-yellow-500 text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </main>
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
        {bestSellers.slice(0, 4).map((product) => (
          <CardComponent
            key={product._id}
            image={product.image_urls[0]}
            title={product.name}
            price={product.variants && product.variants.length > 0 ? product.variants[0].price : 'N/A'}
            description={product.description}
            slug={product.slug}
            category={product.category_id.name}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductGridLayout;