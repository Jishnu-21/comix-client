import React, { useState } from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { IoChatbubblesOutline } from 'react-icons/io5';
import '../Assets/Css/Components/SocialLinks.scss';

const SocialLinks = () => {
  const [isOpen, setIsOpen] = useState(false);

  const socialLinks = [
    { icon: <FaFacebookF />, url: 'https://facebook.com', label: 'Facebook' },
    { icon: <FaTwitter />, url: 'https://twitter.com', label: 'Twitter' },
    { icon: <FaInstagram />, url: 'https://instagram.com', label: 'Instagram' },
    { icon: <FaLinkedinIn />, url: 'https://linkedin.com', label: 'LinkedIn' }
  ];

  return (
    <div className={`social-links-container ${isOpen ? 'open' : ''}`}>
      <button 
        className="toggle-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle social links"
      >
        <IoChatbubblesOutline />
      </button>
      
      <div className="social-links">
        {socialLinks.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
            aria-label={link.label}
          >
            {link.icon}
          </a>
        ))}
      </div>
    </div>
  );
};

export default SocialLinks;
