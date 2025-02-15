import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faGift, faPhone } from '@fortawesome/free-solid-svg-icons';
import { Wheel } from 'react-custom-roulette';
import { API_URL } from '../config/api';

const offers = [
  { option: "Better luck next time.", style: { backgroundColor: "#2C2C38", textColor: "white" } },
  { option: "⁠5% off", style: { backgroundColor: "#EABE67", textColor: "#141519" } },
  { option: "⁠10% off on next order", style: { backgroundColor: "#2f3035", textColor: "white" } },
  { option: "⁠7% off on order above ₹1000", style: { backgroundColor: "#EABE67", textColor: "#141519" } },
  { option: "⁠Free delivery", style: { backgroundColor: "#FFFFFF", textColor: "black" } },
];

const SpinningWheel = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isSpinning, setIsSpinning] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [hasSpun, setHasSpun] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isValidPhone, setIsValidPhone] = useState(false);
  const [showPrize, setShowPrize] = useState(false);
  const [error, setError] = useState('');
  const [isEligible, setIsEligible] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Get or create guest ID from localStorage
    const guestId = localStorage.getItem('guestId') || 
      `guest_${Math.random().toString(36).substring(2)}${Date.now()}`;
    localStorage.setItem('guestId', guestId);

    // Check if user has already won
    const checkEligibility = async () => {
      try {
        const userId = localStorage.getItem('userId') || guestId;
        const response = await fetch(`${API_URL}/api/wheel-offers/check-eligibility`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            userId, 
            phoneNumber: localStorage.getItem('lastPhoneNumber') 
          }),
        });
        
        if (!response.ok) {
          console.error('Error checking eligibility:', await response.text());
          return;
        }

        const data = await response.json();
        
        if (!data.eligible) {
          setError(data.message);
          setIsEligible(false);
          if (data.offer) {
            setShowPrize(true);
            setPrizeNumber(offers.findIndex(o => o.option === data.offer.offer));
            setHasSpun(true);
            setPhoneNumber(data.offer.phoneNumber);
          }
          return; // Don't show wheel if user has an offer
        }

        // Only show wheel if user is eligible
        const timer = setTimeout(() => {
        }, 2000);
        return () => clearTimeout(timer);
      } catch (err) {
        console.error('Error checking eligibility:', err);
      }
    };

    checkEligibility();
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleClose = (e) => {
    e.stopPropagation();
    setIsVisible(false);
    // Store that user has seen and closed the wheel
    const userId = localStorage.getItem('userId') || localStorage.getItem('guestId');
    localStorage.setItem(`wheel_closed_${userId}`, 'true');
  };

  // Don't render anything if user has already won or closed the wheel
  const userId = localStorage.getItem('userId') || localStorage.getItem('guestId');

  // If user has an active offer, show that instead of the wheel
  if (!isEligible && showPrize) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-[#2C2E3A] mb-4">Your Active Offer</h3>
            <p className="text-lg font-bold text-[#EABE67] mb-4">{offers[prizeNumber].option}</p>
            <p className="text-sm text-[#6c757d] mb-4">You can redeem this offer on your next purchase</p>
            <button
              onClick={handleClose}
              className="bg-[#2C2C38] text-white px-6 py-2 rounded-lg hover:bg-[#EABE67] transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setPhoneNumber(value);
    setIsValidPhone(value.length === 10);
    setError(''); // Clear any previous errors
  };

  const handleSpinClick = async () => {
    if (!isSpinning && !hasSpun && isValidPhone) {
      try {
        const userId = localStorage.getItem('userId') || localStorage.getItem('guestId');
        
        // Check eligibility again before spinning
        const eligibilityCheck = await fetch(`${API_URL}/wheel-offers/check-eligibility`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId, phoneNumber }),
        });

        if (!eligibilityCheck.ok) {
          const errorText = await eligibilityCheck.text();
          console.error('Eligibility check failed:', errorText);
          setError('Error checking eligibility. Please try again.');
          return;
        }

        const eligibilityData = await eligibilityCheck.json();
        
        if (!eligibilityData.eligible) {
          setError(eligibilityData.message);
          return;
        }

        const newPrizeNumber = Math.floor(Math.random() * offers.length);
        setPrizeNumber(newPrizeNumber);
        setIsSpinning(true);
        setShowPrize(false);
        setHasSpun(true);

        // Save the offer to backend
        const createResponse = await fetch('http://localhost:5000/api/wheel-offers/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            phoneNumber,
            offer: offers[newPrizeNumber].option
          }),
        });

        if (!createResponse.ok) {
          const errorText = await createResponse.text();
          console.error('Create offer failed:', errorText);
          throw new Error('Failed to save offer');
        }

        // Store phone number for future reference
        localStorage.setItem('lastPhoneNumber', phoneNumber);
      } catch (err) {
        console.error('Error creating offer:', err);
        setError('Something went wrong. Please try again later.');
      }
    }
  };

  const onSpinComplete = () => {
    setIsSpinning(false);
    setTimeout(() => {
      setShowPrize(true);
    }, 1000);
  };

  return (
    <>
      <div className={`fixed top-0 left-0 w-full h-screen bg-black/50 backdrop-blur-sm z-[9998] ${!isVisible ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} onClick={handleClose} />
      <div className={`fixed top-0 left-0 w-full md:w-[600px] h-screen bg-[#F4F9F4] shadow-lg z-[9999] transform transition-all duration-500 ease-out ${!isVisible ? '-translate-x-full' : 'translate-x-0'}`}>
        <div className="relative w-full h-full flex flex-col bg-[#ebf7f1]">
          {/* Close button */}
          <button 
            className="absolute top-4 right-4 z-50 text-gray-600 hover:text-gray-800" 
            onClick={handleClose}
          >
            <FontAwesomeIcon icon={faTimes} className="text-xl" />
          </button>

          {/* Main content */}
          <div className="flex flex-col md:flex-row h-full w-full">
            {/* Wheel Section */}
            <div className="wheel-section relative w-full md:w-3/4 h-[40vh] md:h-full flex items-center overflow-hidden">
              <div className="wheel-wrapper">
                <Wheel
                  mustStartSpinning={isSpinning}
                  prizeNumber={prizeNumber}
                  data={offers}
                  onStopSpinning={onSpinComplete}
                  outerBorderWidth={2}
                  radiusLineWidth={1}
                  fontSize={14}
                  perpendicularText={true}
                  textDistance={60}
                  spinDuration={0.8}
                  outerBorderColor="#EABE67"
                  innerBorderColor="#2C2C38"
                  innerBorderWidth={2}
                  radiusLineColor="#2f3035"
                />
              </div>
            </div>

            {/* Form Section - Right side */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-8">
              <div className={`w-full md:w-[320px] p-4 md:p-6 bg-white rounded-xl md:rounded-2xl shadow-lg relative overflow-hidden transition-all duration-500 order-1 md:order-2 ${!isVisible ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'}`}>
                <div className="absolute top-0 left-0 w-full h-1 bg-[#EABE67]"></div>
                {!hasSpun ? (
                  <div className="phone-input-section space-y-4">
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-semibold text-[#2C2E3A] mb-2">Enter your phone number to spin</h3>
                      <p className="text-sm text-[#6c757d]">Try your luck and win exciting offers!</p>
                    </div>
                    {error && (
                      <div className="text-red-500 text-sm text-center mb-2">
                        {error}
                      </div>
                    )}
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={handlePhoneChange}
                      placeholder="Enter your phone number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#EABE67] text-center"
                      maxLength="10"
                    />
                    <button
                      onClick={handleSpinClick}
                      disabled={!isValidPhone || isSpinning}
                      className={`w-full py-2 rounded-lg text-white font-semibold transition-all duration-200 ${
                        isValidPhone && !isSpinning
                          ? 'bg-[#2C2C38] hover:bg-[#EABE67]'
                          : 'bg-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {isSpinning ? 'Spinning...' : 'Spin Now'}
                    </button>
                    <p className="text-[11px] text-[#6c757d] text-center">*By spinning you agree to our terms</p>
                  </div>
                ) : (
                  <>
                    {isSpinning ? (
                      <div className="spinning-message text-center flex flex-col items-center gap-3 py-2 animate-bounce">
                        <FontAwesomeIcon icon={faGift} className="text-3xl md:text-4xl text-[#EABE67] animate-spin" />
                        <div className="space-y-2">
                          <h3 className="text-lg md:text-xl font-semibold text-[#2C2E3A] font-['Montserrat-SemiBold']">Spinning...</h3>
                          <p className="text-sm md:text-base text-[#6c757d] font-['Montserrat-SemiBold']">Good luck!</p>
                        </div>
                      </div>
                    ) : (
                      <div className={`prize-section text-center flex flex-col items-center gap-3 py-2 ${showPrize ? 'animate-fade-in' : 'opacity-0'}`}>
                        <FontAwesomeIcon icon={faGift} className="text-3xl md:text-4xl text-[#EABE67]" />
                        <div className="space-y-2">
                          <h3 className="text-lg md:text-xl font-semibold text-[#2C2E3A] font-['Montserrat-SemiBold']">Congratulations!</h3>
                          <p className="text-sm md:text-base text-[#6c757d] font-['Montserrat-SemiBold']">You've won:</p>
                          <p className="text-base md:text-lg font-semibold text-[#EABE67] font-['Montserrat-SemiBold']">{offers[prizeNumber].option}</p>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .wheel-section {
          position: relative;
        }

        .wheel-wrapper {
          position: absolute;
          width: 200%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: flex-start;
        }

        @media (min-width: 768px) {
          .wheel-wrapper {
            left: 0;
            transform: translateX(-40%);
          }

          .wheel-wrapper > div {
            transform: scale(1.2);
          }

          .wheel-wrapper :global(.rcs-custom-pointer) {
            position: absolute;
            right: 50% !important;
            transform: translateX(50%) !important;
            left: auto !important;
          }
        }

        @media (min-width: 1024px) {
          .wheel-wrapper {
            transform: translateX(-35%);
          }
        }
        
        @media (max-width: 767px) {
          .wheel-wrapper {
            position: relative;
            width: 100%;
            transform: none;
          }

          .wheel-wrapper > div {
            transform: scale(0.8);
            margin: 0 auto;
          }

          .wheel-wrapper :global(.rcs-custom-pointer) {
            right: 50% !important;
            transform: translateX(50%) !important;
          }
        }
        
        @media (max-width: 374px) {
          .wheel-wrapper > div {
            transform: scale(0.7);
          }
        }

        .wheel-wrapper > div {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .wheel-wrapper :global(.rcs-custom-pointer) {
          z-index: 10;
        }
      `}</style>
    </>
  );
};

export default SpinningWheel;