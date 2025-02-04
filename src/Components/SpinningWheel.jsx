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
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (localStorage.getItem("wheelOpened")) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    document.body.style.overflow = isVisible ? "hidden" : "unset";
    return () => (document.body.style.overflow = "unset");
  }, [isVisible]);

  const handleSpinClick = () => {
    if (!isSpinning) {
      setPrizeNumber(Math.floor(Math.random() * offers.length));
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
    handleSpinClick();
  };

  return (
    <>
      {isVisible && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]" onClick={() => setIsVisible(false)} />
      )}
      <div className={`fixed top-0 h-screen transition-all duration-500 ease-in-out z-[9999] left-0 w-[600px] ${isVisible ? "translate-x-0" : "translate-x-full"}`}>
        <div className="relative bg-white h-full shadow-2xl flex flex-row-reverse">
          <button onClick={() => setIsVisible(false)} className="absolute top-4 right-[24px] text-gray-500 hover:text-gray-700 transition-colors z-30">
            <X size={24} />
          </button>
          <div className="flex-shrink-0 p-8 flex flex-col justify-center items-center w-[300px] border-l">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Spin & Win!</h2>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{showOffer ? "Claim Your Prize!" : "Get Free Offers!"}</h3>
            <p className="text-gray-600">{showOffer ? `Congratulations! You've won ${selectedOffer?.option}` : "Enter your phone number to spin the wheel"}</p>
            <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
              <input type="tel" id="phone" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Enter your phone number" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" required />
              <button type="submit" disabled={isSpinning} className="w-full py-2 px-6 bg-gradient-to-r from-gray-500 to-black text-white font-bold rounded-lg transition-all transform hover:scale-105 disabled:opacity-50">
                {isSpinning ? "Spinning..." : showOffer ? "Claim Now" : "Spin the Wheel"}
              </button>
            </form>
            <p className="text-sm text-gray-500 mt-6">By submitting, you agree to receive promotional messages. You can unsubscribe at any time.</p>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <Wheel mustStartSpinning={isSpinning} prizeNumber={prizeNumber} data={offers} onStopSpinning={handleSpinStop} backgroundColors={offers.map(o => o.style.backgroundColor)} textColors={offers.map(o => o.style.textColor)} fontSize={16} outerBorderColor="#ccc" outerBorderWidth={3} innerRadius={0} innerBorderColor="#ccc" innerBorderWidth={2} radiusLineColor="#ccc" radiusLineWidth={1} perpendicularText textDistance={75} spinDuration={0.8} />
          </div>
        </div>
      </div>
    </>
  );
};

export default SpinningWheel;