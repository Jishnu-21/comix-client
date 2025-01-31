import React, { useState, useEffect } from 'react';
import '../../Assets/Css/SpinnerOffer.scss';

const SpinnerOffer = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [userName, setUserName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    // Show the spinner after a short delay when component mounts
    setTimeout(() => {
      setIsVisible(true);
    }, 1500);
  }, []);

  const handleSpin = () => {
    if (!userName || !phoneNumber) return;
    
    setIsSpinning(true);
    // Add spinning animation logic here
    setTimeout(() => {
      setIsSpinning(false);
      // Handle prize logic here
    }, 3000);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <div className={`spinner-offer ${isVisible ? 'visible' : ''}`}>
      <button className="close-button" onClick={handleClose}>×</button>
      
      <div className="spinner-content">
        <h2>SPIN TO WIN!</h2>
        <p>Feeling lucky? Give the wheel a spin!</p>
        
        <div className={`spinner-wheel ${isSpinning ? 'spinning' : ''}`}>
          <div className="wheel-section">₹50 Off</div>
          <div className="wheel-section">₹75 Off</div>
          <div className="wheel-section">₹100 Off</div>
          <div className="wheel-section">₹125 Off</div>
          <div className="wheel-section">₹500 Off</div>
        </div>

        <div className="form-group">
          <input
            type="tel"
            placeholder="Enter phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="phone-input"
          />
          <input
            type="text"
            placeholder="Enter your name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="name-input"
          />
          <button 
            className="spin-button"
            onClick={handleSpin}
            disabled={isSpinning}
          >
            Try My Luck
          </button>
        </div>

        <p className="terms">
          By submitting your information, you agree to our Privacy Policy and Terms of Service.
        </p>
      </div>
    </div>
  );
};

export default SpinnerOffer; 