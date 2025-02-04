"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Wheel } from 'react-custom-roulette';

const offers = [
  { option: "20% OFF", style: { backgroundColor: "#FF6B6B", textColor: "white" } },
  { option: "Free Shipping", style: { backgroundColor: "#4ECDC4", textColor: "white" } },
  { option: "50% OFF", style: { backgroundColor: "#45B7D1", textColor: "white" } },
  { option: "Buy 1 Get 1", style: { backgroundColor: "#96CEB4", textColor: "white" } },
  { option: "10% OFF", style: { backgroundColor: "#FFEEAD", textColor: "black" } },
  { option: "5$ Coupon", style: { backgroundColor: "#D4A5A5", textColor: "white" } },
  { option: "15% OFF", style: { backgroundColor: "#9B59B6", textColor: "white" } },
  { option: "Free Gift", style: { backgroundColor: "#3498DB", textColor: "white" } },
];

const SpinningWheel = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
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
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 500);

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

  const handleSpinClick = () => {
    if (!isSpinning) {
      const newPrizeNumber = Math.floor(Math.random() * offers.length);
      setPrizeNumber(newPrizeNumber);
      setIsSpinning(true);
    }
  };

  const handleSpinStop = () => {
    setIsSpinning(false);
    setSelectedOffer(offers[prizeNumber]);
    setShowOffer(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Phone number:", phoneNumber);
    handleSpinClick();
  };

  const wheelData = offers.map(offer => ({
    option: offer.option,
    style: offer.style
  }));

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
            className="absolute top-4 left-[24px] text-gray-500 hover:text-gray-700 transition-colors z-30"
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
                  ? `Congratulations! You've won ${selectedOffer?.option}`
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

          {/* Wheel Container */}
          <div
            className={`relative flex items-center ${
              isMobile 
                ? "h-[300px] order-1 justify-center" 
                : "flex-1 justify-end pl-[120px]"
            }`}
          >
            <div className={`${isMobile ? "w-[250px]" : "w-[400px]"}`}>
              <Wheel
                mustStartSpinning={isSpinning}
                prizeNumber={prizeNumber}
                data={wheelData}
                onStopSpinning={handleSpinStop}
                backgroundColors={offers.map(offer => offer.style.backgroundColor)}
                textColors={offers.map(offer => offer.style.textColor)}
                fontSize={isMobile ? 14 : 16}
                outerBorderColor="#ccc"
                outerBorderWidth={3}
                innerRadius={0}
                innerBorderColor="#ccc"
                innerBorderWidth={2}
                radiusLineColor="#ccc"
                radiusLineWidth={1}
                perpendicularText
                textDistance={75}
                spinDuration={0.8}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SpinningWheel;