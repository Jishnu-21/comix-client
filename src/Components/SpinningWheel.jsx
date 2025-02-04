"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const offers = [
  { text: "20% OFF", color: "#FF6B6B" },
  { text: "Free Shipping", color: "#4ECDC4" },
  { text: "50% OFF", color: "#45B7D1" },
  { text: "Buy 1 Get 1", color: "#96CEB4" },
  { text: "10% OFF", color: "#FFEEAD" },
  { text: "5$ Coupon", color: "#D4A5A5" },
  { text: "15% OFF", color: "#9B59B6" },
  { text: "Free Gift", color: "#3498DB" },
];

const SpinningWheel = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showOffer, setShowOffer] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const isOpenedBefore = localStorage.getItem("wheelOpened");
    if (isOpenedBefore) {
      setIsVisible(false);
    } else {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (isVisible) {
      localStorage.setItem("wheelOpened", "true");
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isVisible]);

  const spinWheel = () => {
    if (!isSpinning) {
      setIsSpinning(true);
      const randomRotation = 1800 + Math.floor(Math.random() * 1800);
      setRotation(rotation + randomRotation);

      setTimeout(() => {
        setIsSpinning(false);
        const finalRotation = (rotation + randomRotation) % 360;
        const selectedIndex =
          Math.floor((360 - (finalRotation % 360)) / (360 / offers.length));
        setSelectedOffer(offers[selectedIndex]);
        setShowOffer(true);
      }, 5000);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Phone number:", phoneNumber);
    spinWheel();
  };

  return (
    <>
      {/* Backdrop */}
      {isVisible && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
          onClick={() => setIsVisible(false)}
        />
      )}

      {/* Main Container */}
      <div
        className={`fixed top-0 h-screen transition-all duration-500 ease-in-out z-[9999]
          ${isMobile ? "inset-0" : "right-0 w-[600px]"}
          ${isVisible ? "translate-x-0" : `${isMobile ? "translate-y-full" : "translate-x-full"}`}
        `}
      >
        <div className={`relative bg-white h-full shadow-2xl flex ${isMobile ? "flex-col" : ""}`}>
          <button
            onClick={() => setIsVisible(false)}
            className="absolute top-4 left-4 text-gray-500 hover:text-gray-700 transition-colors z-30"
          >
            <X size={24} />
          </button>

          {/* Offer Dialog */}
          <div
            className={`flex-shrink-0 p-8 flex flex-col justify-center items-center ${
              isMobile ? "w-full order-2" : "w-[300px] border-r"
            }`}
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Spin & Win!</h2>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {showOffer ? "Claim Your Prize!" : "Get Free Offers!"}
              </h3>
              <p className="text-gray-600">
                {showOffer
                  ? `Congratulations! You've won ${selectedOffer?.text}`
                  : "Enter your phone number to spin the wheel"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter your phone number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isSpinning}
                className="w-full py-2 px-6 bg-gradient-to-r from-gray-500 to-black hover:bg-gradient-to-r hover:from-gray-600 hover:to-gray-600 text-white font-bold rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSpinning ? "Spinning..." : showOffer ? "Claim Now" : "Spin the Wheel"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                By submitting, you agree to receive promotional messages. You can unsubscribe at any time.
              </p>
            </div>
          </div>

          {/* Vertical Half Wheel */}
          <div
            className={`relative overflow-hidden ${isMobile ? "h-[300px] order-1" : "flex-1"}`}
          >
            {/* Center Point */}
            <div
              className={`absolute w-4 h-4 bg-white rounded-full z-20 shadow-md ${
                isMobile ? "bottom-0 left-1/2 -translate-x-1/2" : "top-1/2 right-0 -translate-y-1/2"
              }`}
            />

            {/* Pointer */}
            <div
              className={`absolute w-6 h-6 bg-red-500 z-10 ${
                isMobile
                  ? "bottom-0 left-1/2 -translate-x-1/2 clip-triangle-up"
                  : "top-1/2 right-0 -translate-y-1/2 clip-triangle-right"
              }`}
            />

            {/* Full Wheel for Mobile, Half Wheel for Desktop */}
            <div
              className={`absolute w-[600px] h-[600px] rounded-full overflow-hidden transition-transform duration-5000 ease-out ${
                isMobile ? "left-1/2 -translate-x-1/2 bottom-0" : "right-[-300px] top-[calc(50%-300px)]"
              }`}
              style={{
                transform: `rotate(${rotation}deg)`,
              }}
            >
              {offers.map((offer, index) => {
                const angle = (360 / offers.length) * index;
                const textRotation = isMobile ? angle + 90 : angle;
                return (
                  <div
                    key={index}
                    className="absolute w-full h-full origin-center"
                    style={{
                      transform: `rotate(${angle}deg)`,
                      clipPath: isMobile
                        ? "polygon(0 50%, 100% 50%, 100% 100%, 0 100%)"
                        : "polygon(50% 0, 100% 0, 100% 100%, 50% 100%)",
                    }}
                  >
                    <div
                      className="absolute w-full h-full"
                      style={{ backgroundColor: offer.color }}
                    >
                      <div
                        className="absolute flex items-center justify-center w-full"
                        style={{
                          top: isMobile ? "75%" : "50%",
                          right: isMobile ? "50%" : "25%",
                          transform: isMobile
                            ? `translate(50%, -50%) rotate(${-textRotation}deg)`
                            : `translate(50%, -50%) rotate(${-textRotation + 90}deg)`,
                        }}
                      >
                        <span className="text-white font-bold whitespace-nowrap">
                          {offer.text}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SpinningWheel;