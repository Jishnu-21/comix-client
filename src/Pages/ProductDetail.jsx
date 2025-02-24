// src/Pages/ProductDetail.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import '../Assets/Css/ProductDetail/ProductDetail.scss';
import ProductImageGallery from '../Components/ProductDetail/ProductImageGallery.jsx';
import MobileImageSlider from '../Components/ProductDetail/MobileImageSlider';
import ProductDetailInfo from '../Components/ProductDetail/ProductDetailInfo';
import ProductDropdownInfo from '../Components/ProductDetail/ProductDropdownInfo';
import CardComponent from '../Components/ProductPage/CardComponent';
import SectionTitle from '../Components/SectionTitle';
import ImageComparisonSlider from '../Components/ProductDetail/ImageComparisonSlider';
import { API_URL } from '../config/api';
import afterImage from '../Assets/Image/after.jpeg';
import beforeImage from '../Assets/Image/before.jpeg';
import Touch from '../Components/Touch';
import { IoArrowBack } from "react-icons/io5";
import { FaHeart } from "react-icons/fa";
import LoadingScreen from '../Components/LoadingScreen';
import MobileHeader from '../Components/MobileHeader';
import { useNavigate } from 'react-router-dom';
import KeyIngredients from '../Components/ProductDetail/KeyIngredients';
import HowToUse from '../Components/ProductDetail/HowToUse';
import RelatedProducts from '../Components/ProductDetail/RelatedProducts';

const ProductDetail = () => {
  const { slug } = useParams();
  const productDetailRef = useRef(null);
  const leftSectionRef = useRef(null);
  const rightSectionRef = useRef(null);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentlyVisited, setRecentlyVisited] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);
  const [leftSectionHeight, setLeftSectionHeight] = useState(0);
  const [rightSectionHeight, setRightSectionHeight] = useState(0);

  useEffect(() => {
    const updateLayout = () => {
      if (!leftSectionRef.current || !rightSectionRef.current) return;

      const leftHeight = leftSectionRef.current.offsetHeight;
      const rightHeight = rightSectionRef.current.offsetHeight;
      
      if (leftHeight !== leftSectionHeight || rightHeight !== rightSectionHeight) {
        setLeftSectionHeight(leftHeight);
        setRightSectionHeight(rightHeight);
      }
    };

    // Initial update
    updateLayout();

    // Update on resize
    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(updateLayout);
    });

    if (leftSectionRef.current) resizeObserver.observe(leftSectionRef.current);
    if (rightSectionRef.current) resizeObserver.observe(rightSectionRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [product]);

  useEffect(() => {
    const handleScroll = () => {
      if (!leftSectionRef.current || !rightSectionRef.current) return;

      const leftSection = leftSectionRef.current;
      const rightSection = rightSectionRef.current;
      const leftRect = leftSection.getBoundingClientRect();
      const rightRect = rightSection.getBoundingClientRect();
      const container = leftSection.parentElement;
      const containerRect = container.getBoundingClientRect();

      // Calculate the scroll threshold where left section should start moving
      const scrollThreshold = rightRect.height - leftRect.height;
      
      if (containerRect.top <= 0) {
        // Container has reached the top of viewport
        if (Math.abs(containerRect.top) > scrollThreshold) {
          // Right section has been scrolled enough, let left section scroll
          leftSection.style.position = 'relative';
          leftSection.style.top = `${scrollThreshold}px`;
          leftSection.style.width = '40%';
        } else {
          // Keep left section fixed while right section scrolls
          leftSection.style.position = 'fixed';
          leftSection.style.top = '20px';
          leftSection.style.width = `${container.offsetWidth * 0.4}px`;
        }
      } else {
        // Container hasn't reached viewport top yet
        leftSection.style.position = 'relative';
        leftSection.style.top = '0';
        leftSection.style.width = '40%';
      }
    };

    // Handle window resize
    const handleResize = () => {
      if (leftSectionRef.current && leftSectionRef.current.style.position === 'fixed') {
        const container = leftSectionRef.current.parentElement;
        leftSectionRef.current.style.width = `${container.offsetWidth * 0.4}px`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [leftSectionHeight, rightSectionHeight]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log('Fetching product details...');
        const response = await axios.get(`${API_URL}/products/details/${slug}`);
        if (response.data.success) {
          console.log('Product details:', response.data.product);
          // Log hero ingredients specifically
          console.log('Category', response.data.product.category_id);
          setProduct(response.data.product);
          await trackProductVisit(response.data.product);
        } else {
          console.error('Failed to fetch product details');
          setError('Failed to fetch product details');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('An error occurred while fetching product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const trackProductVisit = async (product) => {
    console.log('Tracking product visit...');
    const userData = JSON.parse(localStorage.getItem('user'));
    console.log('User data:', userData);

    if (userData && userData.user && userData.user.id && product) {
      try {
        const response = await axios.post(`${API_URL}/products/trackProduct`, {
          productId: product._id,
          productName: product.name,
          userId: userData.user.id
        });
        console.log('Product visit tracked successfully:', response.data);
      } catch (err) {
        console.error('Error tracking product visit:', err);
      }
    } else {
      console.log('User not logged in or product information missing, skipping visit tracking');
    }
  };

  useEffect(() => {
    const fetchRecentlyVisited = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      console.log('User data for recently visited:', user);

      if (user && user.user && user.user.id) {
        try {
          console.log('Fetching recently visited products...');
          const response = await axios.get(`${API_URL}/products/recentlyVisited/${user.user.id}`);
          console.log('Recently visited products fetched successfully:', response.data);

          // Ensure productVisits exists and is an array
          const productVisits = Array.isArray(response.data.productVisits) ? response.data.productVisits : [];
          
          const filteredVisits = productVisits
            .filter(visit => {
              // Check if visit and its properties exist
              return visit?.productId && 
                     visit.productId._id && 
                     product?._id && 
                     visit.productId._id !== product._id;
            })
            .reduce((acc, current) => {
              if (!current?.productId?._id) return acc;
              
              const x = acc.find(item => item.productId._id === current.productId._id);
              if (!x) {
                return acc.concat([current]);
              }
              return acc;
            }, []);

          setRecentlyVisited(filteredVisits);
        } catch (err) {
          console.error('Error fetching recently visited products:', err);
        }
      } else {
        console.log('User is not logged in, skipping recently visited products');
      }
    };

    fetchRecentlyVisited();
  }, [product]);

  const handleBack = () => {
    window.history.back();
  };

  if (loading) return <LoadingScreen />;
  if (error) return <div>{error}</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className={`product-detail-page fade-in ${isMobile ? 'mobile-view' : ''}`}>
      {isMobile ? <MobileHeader /> : <Header />}
      <div className="container">
        {isMobile ? (
          <>
          <div className="mobile-product-content">
            <MobileImageSlider images={product.image_urls} />
            <div className="product-detail__info">
              <ProductDetailInfo 
                product={product} 
                ref={productDetailRef}
                isMobile={isMobile}
              />
            </div>
            <ProductDropdownInfo
              description={product.description}
              ingredients={product.ingredients}
              faqs={product.faqs}
              additionalDetails={product.additional_info}
              productId={product._id}
              product={product}
            />
            <div className="mobile-before-after">
              <h2>Before and After</h2>
              <ImageComparisonSlider 
                beforeImage={beforeImage}
                afterImage={afterImage}
                height="300px"
              />
            </div>
            <div className="icon-section">
                <div className="icon">
                 <img src="/images/fda.png" alt="FDA Approved" />
                 <span>FDA APPROVED</span>
                 </div>
                <div className="icon">
                <img src="/images/sulphate.png" alt="Sulphate Free" />
                  <span>SULPHATE FREE</span>
               </div>
               <div className="icon">
               <img src="/images/paraben.png" alt="Paraben Free" />
               <span>PARABEN FREE</span>
               </div>
              <div className="icon">
              <img src="/images/cruelty.png" alt="Cruelty Free" />
              <span>CRUELTY FREE</span>
             </div>
            </div>

            <div className="comix-benefits-marquee">
        <div className="comix-benefits-track">
          {[...Array(2)].map((_, index) => (
            <div key={index} className="comix-benefits-content">
              {[
                'Cleansing',
                'Hydrating',
                'Strengthening',
                'Balancing',
                'Soothing',
                'Polishing',
                'Revitalizing',
                'Protecting',
                'Refreshing',
                'Nourishing'
              ].map((benefit, idx) => (
                <React.Fragment key={idx}>
                  <span className="comix-benefit-word">{benefit}</span>
                  <span className="comix-benefit-separator">✧</span>
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
      </div>
            <KeyIngredients ingredients={product.hero_ingredients} />
            <HowToUse steps={product.how_to_use} category={product.category_id} />
            {recentlyVisited.length > 0 && (
              <div className="recently-viewed">
                <SectionTitle title="SHOP FROM RECENTLY VIEWED" />
                <div className="row mt-5 mb-5">
                  {recentlyVisited.map((visit) => (
                    <CardComponent
                      key={visit.productId._id}
                      image={visit.productId.image_urls[0]}
                      title={visit.productId.name}
                      price={visit.productId.variants[0].price}
                      description={visit.productId.description}
                      slug={visit.productId.slug}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        
          <div className="mobile-fixed-bottom">
            <button 
              className="wishlist-btn"
              onClick={() => productDetailRef.current?.handleToggleFavorite()}
            >
              <FaHeart className={productDetailRef.current?.isFavorite ? 'active' : ''} />
            </button>
            <button 
              className="add-to-bag-btn"
              onClick={() => productDetailRef.current?.handleAddToBag()}
              disabled={productDetailRef.current?.isAddingToCart}
            >
              {productDetailRef.current?.isAddingToCart ? 'Adding...' : 'Add to Bag'}
            </button>
          </div>
        </>
        ) : (
          <>
            {/* Tablet Layout (iPad Air, Mini, and Pro) */}
            <div className="tablet-layout d-block d-xl-none">
              <div className="row g-0">
                <div className="col-12">
                  <div className="product-content">
                    <div className="product-gallery-section">
                      <MobileImageSlider images={product.image_urls} />
                    </div>
                    <div className="product-info-wrapper">
                      <ProductDetailInfo product={product} />
                      <ProductDropdownInfo
                        description={product.description}
                        ingredients={product.ingredients}
                        faqs={product.faqs}
                        additionalDetails={product.additional_info}
                        productId={product._id}
                        product={product}
                      />
                      <div className="image-comparison-container">
                        <h2 className='kavya'>Before and After</h2>
                        <ImageComparisonSlider 
                          beforeImage={beforeImage}
                          afterImage={afterImage}
                          height="400px"
                        />
                      </div>
                      <div className="icon-section">
                        <div className="icon">
                          <img src="/images/fda.png" alt="FDA Approved" />
                          <span>FDA APPROVED</span>
                        </div>
                        <div className="icon">
                          <img src="/images/sulphate.png" alt="Sulphate Free" />
                          <span>SULPHATE FREE</span>
                        </div>
                        <div className="icon">
                          <img src="/images/paraben.png" alt="Paraben Free" />
                          <span>PARABEN FREE</span>
                        </div>
                        <div className="icon">
                          <img src="/images/cruelty.png" alt="Cruelty Free" />
                          <span>CRUELTY FREE</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="desktop-layout d-none d-xl-block">
              <div className="two-section-layout">
                <div className="left-section" ref={leftSectionRef}>
                  <ProductImageGallery images={product.image_urls} />
                  <div className="image-comparison-container">
                    <h2 className='kavya'>Before and After</h2>
                    <ImageComparisonSlider 
                      beforeImage={beforeImage}
                      afterImage={afterImage}
                      height="400px"
                    />
                  </div>
                  <div className="icon-section">
                    <div className="icon">
                      <img src="/images/fda.png" alt="FDA Approved" />
                      <span>FDA APPROVED</span>
                    </div>
                    <div className="icon">
                      <img src="/images/sulphate.png" alt="Sulphate Free" />
                      <span>SULPHATE FREE</span>
                    </div>
                    <div className="icon">
                      <img src="/images/paraben.png" alt="Paraben Free" />
                      <span>PARABEN FREE</span>
                    </div>
                    <div className="icon">
                      <img src="/images/cruelty.png" alt="Cruelty Free" />
                      <span>CRUELTY FREE</span>
                    </div>
                  </div>
                </div>
                <div className="right-section" ref={rightSectionRef}>
                  <ProductDetailInfo product={product} />
                  <ProductDropdownInfo
                    description={product.description}
                    ingredients={product.ingredients}
                    faqs={product.faqs}
                    additionalDetails={product.additional_info}
                    productId={product._id}
                    product={product}
                  />
                </div>
              </div>
            </div>
          </>
        )}
        {/* Recently Viewed Products Section (Desktop) */}
        {!isMobile && recentlyVisited.length > 3 && (
          <div className="recently-viewed-desktop">
            <SectionTitle title="SHOP FROM RECENTLY VIEWED" />
            <div className="row mt-5 mb-5">
              {recentlyVisited.slice(0, 4).map((visit) => (
                <div key={visit.productId._id} className="col-lg-3 col-md-4 col-sm-6">
                  <CardComponent
                    image={visit.productId.image_urls[0]}
                    title={visit.productId.name}
                    price={visit.productId.variants[0].price}
                    description={visit.productId.description}
                    slug={visit.productId.slug}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>


      {!isMobile && (
        <>
             <div className="comix-benefits-marquee">
        <div className="comix-benefits-track">
          {[...Array(2)].map((_, index) => (
            <div key={index} className="comix-benefits-content">
              {[
                'Cleansing',
                'Hydrating',
                'Strengthening',
                'Balancing',
                'Soothing',
                'Polishing',
                'Revitalizing',
                'Protecting',
                'Refreshing',
                'Nourishing'
              ].map((benefit, idx) => (
                <React.Fragment key={idx}>
                  <span className="comix-benefit-word">{benefit}</span>
                  <span className="comix-benefit-separator">✧</span>
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
      </div>
          <KeyIngredients ingredients={product.hero_ingredients} />
          <HowToUse 
            steps={product.how_to_use || `
              1. Wet your face with lukewarm water
              2. Take a small amount of product and gently massage in circular motions
              3. Focus on areas with specific concerns
              4. Rinse thoroughly with water
              5. Pat dry with a clean towel
            `} 
            category={product.category}
          />
        </>
      )}

      {!isMobile && (
        <>
          <Touch />
          <Footer />
        </>
      )}
    </div>
  );
};

export default ProductDetail;
