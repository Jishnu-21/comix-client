import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faGift, faPhone } from '@fortawesome/free-solid-svg-icons';
import { Wheel } from 'react-custom-roulette';

const offers = [
  { option: "Better luck next time.", style: { backgroundColor: "#2C2C38", textColor: "white" } },
  { option: "⁠5% off", style: { backgroundColor: "#EABE67", textColor: "#141519" } },
  { option: "⁠10% off on next order", style: { backgroundColor: "#2f3035", textColor: "white" } },
  { option: "⁠7% off on order above ₹1000", style: { backgroundColor: "#EABE67", textColor: "#141519" } },
  { option: "⁠Free delivery", style: { backgroundColor: "#FFFFFF", textColor: "black" } },
];

const SpinningWheel = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [hasSpun, setHasSpun] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isValidPhone, setIsValidPhone] = useState(false);
  const [showPrize, setShowPrize] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Clear localStorage for testing
    localStorage.removeItem('hasSeenSpinWheel');
    localStorage.removeItem('wheelLastShown');

    const hasSeenWheel = localStorage.getItem('hasSeenSpinWheel');
    const lastShownTime = localStorage.getItem('wheelLastShown');
    const currentTime = new Date().getTime();
    
    // Show wheel if never seen before or last shown more than 24 hours ago
    const shouldShowWheel = !hasSeenWheel || 
      (lastShownTime && (currentTime - parseInt(lastShownTime)) > 24 * 60 * 60 * 1000);

    if (shouldShowWheel) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        localStorage.setItem('hasSeenSpinWheel', 'true');
        localStorage.setItem('wheelLastShown', currentTime.toString());
      }, 2000);
      return () => clearTimeout(timer);
    }

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setPhoneNumber(value);
    setIsValidPhone(value.length === 10);
  };

  const handleSpinClick = () => {
    if (!isSpinning && !hasSpun && isValidPhone) {
      const newPrizeNumber = Math.floor(Math.random() * offers.length);
      setPrizeNumber(newPrizeNumber);
      setIsSpinning(true);
      setShowPrize(false);
      setHasSpun(true);
      // Store the phone number and prize in local storage
      localStorage.setItem('spinWheelPhone', phoneNumber);
      localStorage.setItem('spinWheelPrize', offers[newPrizeNumber].option);
    }
  };

  const handleClose = (e) => {
    e.stopPropagation();
    setIsVisible(false);
  };

  const onSpinComplete = () => {
    setIsSpinning(false);
    setTimeout(() => {
      setShowPrize(true);
    }, 1000);
  };

  if (!isVisible) return null;

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
                  pointerProps={{
                    src: null,
                    style: {
                      backgroundColor: 'red',
                      clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                    }
                  }}
                />
              </div>
            </div>

            {/* Form Section - Right side */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-8">
              <div className={`w-full md:w-[320px] p-4 md:p-6 bg-white rounded-xl md:rounded-2xl shadow-lg relative overflow-hidden transition-all duration-500 order-1 md:order-2 ${!isVisible ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'}`}>
                <div className="absolute top-0 left-0 w-full h-1 bg-[#EABE67]"></div>
                {!hasSpun ? (
                  <div className="phone-input-section space-y-4">
                    <h3 className="text-base md:text-lg text-[#2C2E3A] font-semibold text-center relative pb-3 font-['Montserrat-SemiBold']">
                      Enter mobile number to spin
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-[#EABE67] rounded"></span>
                    </h3>
                    <div className="relative">
                      <FontAwesomeIcon icon={faPhone} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6c757d] text-sm" />
                      <input
                        type="tel"
                        placeholder="Enter your mobile number"
                        value={phoneNumber}
                        onChange={handlePhoneChange}
                        maxLength={10}
                        className="w-full py-2.5 md:py-3 px-10 border border-gray-200 bg-white rounded-lg text-[#2C2E3A] placeholder-[#6c757d] focus:outline-none focus:border-[#EABE67] focus:ring-1 focus:ring-[#EABE67] transition-colors duration-200 text-[15px] font-['Montserrat-SemiBold']"
                      />
                    </div>
                    <button 
                      className={`w-full py-2.5 md:py-3 px-6 rounded-lg bg-[#2C2E3A] text-white font-medium transition-all duration-200 text-[15px] shadow-sm hover:shadow-md font-['Montserrat-SemiBold'] ${(!isValidPhone || isSpinning) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#141519] active:scale-[0.98]'}`}
                      onClick={handleSpinClick}
                      disabled={!isValidPhone || isSpinning}
                    >
                      {isSpinning ? 'Spinning...' : 'SPIN NOW'}
                    </button>
                    <p className="text-[11px] text-[#6c757d] text-center font-['Montserrat-SemiBold']">*By spinning you agree to our terms</p>
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