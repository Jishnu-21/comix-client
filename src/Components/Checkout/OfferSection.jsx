import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPercentage } from 'react-icons/fa';
import { IoCheckmarkCircle } from 'react-icons/io5';
import '../../Assets/Css/CheckOut/VoucherSection.scss';
import { API_URL } from "../../config/api.js";

const OfferSection = ({ onApplyOffer, appliedOffer }) => {
  const [offers, setOffers] = useState([]);
  const [selectedOfferId, setSelectedOfferId] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOffers();
  }, []);

  useEffect(() => {
    if (appliedOffer) {
      setSelectedOfferId(appliedOffer._id);
    } else {
      setSelectedOfferId('');
    }
  }, [appliedOffer]);

  const fetchOffers = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_URL}/offers/active-offers`);
      if (response.data.offers) {
        const currentDate = new Date();
        const activeOffers = response.data.offers.filter(offer => {
          const startDate = new Date(offer.start_date);
          const endDate = new Date(offer.end_date);
          return offer.is_active && currentDate >= startDate && currentDate <= endDate;
        });
        setOffers(activeOffers);
      } else {
        setOffers([]);
      }
    } catch (error) {
      console.error('Error fetching offers:', error);
      setError('Failed to load offers');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOfferSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (appliedOffer && appliedOffer._id === selectedOfferId) {
        await onApplyOffer(null);
        setSelectedOfferId('');
        return;
      }
      await onApplyOffer(selectedOfferId);
    } catch (err) {
      setError(err.message || 'Failed to apply offer');
    }
  };

  if (isLoading) {
    return (
      <div className="offer-section">
        <h3>Available Offers</h3>
        <div className="loading">Loading offers...</div>
      </div>
    );
  }

  return (
    <div className="offer-section">
      <h3>Available Offers</h3>
      {offers.length > 0 ? (
        <form onSubmit={handleOfferSubmit}>
          <select
            value={selectedOfferId}
            onChange={(e) => setSelectedOfferId(e.target.value)}
          >
            <option value="">Select an offer</option>
            {offers.map((offer) => (
              <option key={offer._id} value={offer._id}>
                {offer.title} - {offer.discount_percentage}% off
              </option>
            ))}
          </select>
          <div className="offer-buttons">
            <button 
              type="submit" 
              className="apply-offer-btn"
              disabled={!selectedOfferId && !appliedOffer}
            >
              {appliedOffer ? 'Change Offer' : 'Apply Offer'}
            </button>
            {appliedOffer && (
              <button 
                type="button" 
                onClick={() => onApplyOffer(null)}
                className="remove-offer-btn"
              >
                Remove Offer
              </button>
            )}
          </div>
        </form>
      ) : (
        <div className="no-offers-message">
          <FaPercentage className="icon" />
          <p>No offers available at the moment. Check back later for exciting discounts!</p>
        </div>
      )}
      {error && <p className="error-message">{error}</p>}
      {appliedOffer && (
        <p className="applied-offer-message">
          <IoCheckmarkCircle />
          Applied: {appliedOffer.title} ({appliedOffer.discount_percentage}% off)
        </p>
      )}
    </div>
  );
};

export default OfferSection;
