import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config/api';
import '../../Assets/Css/ProductPage/Banner.scss';

const Banner = () => {
    const [banner, setBanner] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchBanner();
    }, []);

    const fetchBanner = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${API_URL}/banners`);
            const productPageBanner = response.data.banners.find(banner => banner.type === 'productpage');
            setBanner(productPageBanner);
        } catch (error) {
            console.error('Error fetching banner:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!banner || isLoading) return null;

    return (
        <div className="banner-section">
            <div 
                className="hero-banner" 
                style={{
                    backgroundImage: `url(${banner.image_url})`,
                }}
                role="banner"
                aria-label={banner.title}
            >
                <div className="col-12">
                    <h1 className="main-heading">{banner.title}</h1>
                    {banner.description && (
                        <p className="sub-heading">{banner.description}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Banner;
