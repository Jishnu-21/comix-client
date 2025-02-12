import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faGift, faPhone } from '@fortawesome/free-solid-svg-icons';
import { Wheel } from 'react-custom-roulette';

const offers = [
  { option: "Better luck next time", style: { backgroundColor: "#2C2E3A", textColor: "white" } },
  { option: "5% OFF", style: { backgroundColor: "#EABE67", textColor: "#141519" } },
  { option: "Free Delivery", style: { backgroundColor: "#2f3035", textColor: "white" } },
  { option: "⁠10% off on next order", style: { backgroundColor: "#EABE67", textColor: "#141519" } },
  { option: "⁠7% off on order above ₹1000", style: { backgroundColor: "#2C2E5A", textColor: "white" } },
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
    }, 500);
  };

  if (!isVisible) return null;

  return (
    <>
      <div className={`fixed top-0 left-0 w-full h-screen bg-black/50 backdrop-blur-sm z-[9998] opacity-100 transition-opacity duration-300 ${!isVisible ? 'opacity-0 pointer-events-none' : ''}`} onClick={handleClose} />
      <div className={`fixed top-0 left-0 w-full md:w-[90vw] lg:w-[700px] h-screen bg-[#f8f9fa] shadow-lg z-[9999] transform transition-all duration-500 ease-out ${!isVisible ? '-translate-x-full opacity-0 scale-95' : 'translate-x-0 opacity-100 scale-100'}`}>
        <div className="relative w-full h-full flex flex-col">
          <div className={`absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#EABE67]/5 to-transparent transition-opacity duration-500 ${!isVisible ? 'opacity-0' : 'opacity-100'}`}></div>
          
          <button className="absolute top-2 right-2 bg-transparent border-none text-lg cursor-pointer text-[#6c757d] hover:text-[#2C2E3A] hover:bg-black/5 p-2 rounded-full transition-all duration-200 z-10" onClick={handleClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
          
          <div className="p-3 md:p-4 flex-shrink-0 border-b border-black/5 relative">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faGift} className="text-lg md:text-xl text-[#EABE67] animate-bounce" />
              <div className="text-left">
                <h2 className="m-0 text-lg md:text-xl text-[#2C2E3A] font-semibold">Spin & Win!</h2>
                <p className="mt-0.5 text-xs md:text-sm text-[#6c757d]">Try your luck and win exciting offers</p>
              </div>
            </div>
          </div>

          <div className="flex-1 relative flex flex-col md:flex-row items-center justify-start md:justify-center h-[calc(100%-4rem)]">
            <div className="w-full h-full flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8">
              <div className={`relative flex items-center justify-center w-full md:w-[550px] lg:w-[650px] ${
                isMobile 
                  ? 'h-[45vh] wheel-mobile' 
                  : 'md:-ml-[75px] lg:-ml-[150px] wheel-desktop'
              }`}>
                <div className="wheel-container">
                  <Wheel
                    mustStartSpinning={isSpinning}
                    prizeNumber={prizeNumber}
                    data={offers}
                    onStopSpinning={onSpinComplete}
                    outerBorderWidth={2}
                    radiusLineWidth={1}
                    fontSize={isMobile ? 10 : 12}
                    perpendicularText={true}
                    textDistance={55}
                    startingOptionIndex={2}
                    spinDuration={0.8}
                    outerBorderColor="#EABE67"
                    innerBorderColor="#2C2E3A"
                    innerBorderWidth={2}
                    radiusLineColor="#2f3035"
                    pointerProps={{
                      src: null,
                      style: {
                        backgroundColor: '#EABE67',
                        clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                      }
                    }}
                  />
                </div>
              </div>

              <div className={`w-[92%] md:w-[320px] p-4 md:p-6 mx-auto md:mr-28 lg:mr-36 bg-white rounded-xl md:rounded-2xl shadow-lg md:self-center md:mt-[-50px] relative overflow-hidden transition-all duration-500 ${!isVisible ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'}`}>
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
                  <div className={`prize-section text-center flex flex-col items-center gap-3 py-2 ${showPrize ? 'animate-fade-in' : ''}`}>
                    <FontAwesomeIcon icon={faGift} className="text-3xl md:text-4xl text-[#EABE67]" />
                    <div className="space-y-2">
                      <h3 className="text-lg md:text-xl font-semibold text-[#2C2E3A] font-['Montserrat-SemiBold']">Congratulations!</h3>
                      <p className="text-base md:text-lg text-[#EABE67] font-medium font-['Montserrat-SemiBold']">{offers[prizeNumber].option}</p>
                      <small className="block text-xs text-[#6c757d] font-['Montserrat-SemiBold']">Coupon code will be sent to your mobile</small>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        @media (min-width: 768px) {
          .wheel-desktop {
            position: relative;
            overflow: visible;
            height: 550px;
            display: flex;
            align-items: center;
          }
          .wheel-desktop .wheel-container {
            clip-path: inset(0 0 0 25%);
            transform: scale(1.3);
            transform-origin: center right;
            margin-left: -75px;
          }
        }
        
        @media (max-width: 767px) {
          .wheel-mobile {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: -20px;
          }
          .wheel-mobile .wheel-container {
            transform: scale(0.8);
            transition: transform 0.5s ease-out;
          }
        }
        
        @media (max-width: 374px) {
          .wheel-mobile .wheel-container {
            transform: scale(0.7);
          }
        }
        
        @media (min-width: 1024px) {
          .wheel-desktop .wheel-container {
            transform: scale(1.4);
          }
        }
        
        @media (min-width: 768px) and (max-width: 1023px) {
          .wheel-desktop .wheel-container {
            transform: scale(1.2);
          }
        }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default SpinningWheel;