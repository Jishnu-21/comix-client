import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import '../Assets/Css/Footer.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faFacebookF, faTwitter, faLinkedinIn, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const footerLinks = [
    {
      name: 'Policies',
      details: [
        { name: 'Privacy Policy', path: '/policy/privacy' },
        { name: 'Refund Policy', path: '/policy/refund' },
        { name: 'Terms of Service', path: '/policy/terms' }
      ]
    },
    {
      name: 'General',
      details: [
        { name: 'Home', path: '/' },
        { name: 'Blogs', path: '/blog' },
        { name: 'About Us', path: '/about' },
        { name: 'Careera', path: '/career' }
      ]
    },
    {
      name: 'Customer Service',
      details: [
        { name: 'FAQs', path: '/faqs' },
      ]
    }
  ];
  
  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };
  
  return (
    <footer className={`footer ${isMobile ? 'mobile-footer' : ''}`}>
      {isMobile && (
        <div className="mobile-footer-content">
          <div className="footer-top">
            <div className="rounded-logo">
              <img
                src={`${process.env.PUBLIC_URL}/images/logo.gif`}
                alt="Footer logo"
                className="footer-logo"
              />
            </div>
          </div>
          
          <div className="footer-sections">
            <div className="footer-info">
              <p className="footer-description">
              Commix, where self-care is something to smile about. In a world that never slows down, we know it is difficult to find time for yourself. While we are aware of what goes into our personal care products              </p>
              <div className="footer-contact">
                <h3>Contact Us</h3>
                <p>Commix Pvt Ltd</p>
                <p><a href="tel:+919004711317">+91 90047 11317</a></p>
                <p><a href="mailto:customercare@renueminerals.com">customercare@commix.com</a></p>
              </div>
            </div>
  
            <div className="footer-links">
              {footerLinks.map((section, index) => (
                <div key={index} className="footer-link-item">
                  <button 
                    className={`footer-link-button ${openDropdown === index ? 'active' : ''}`}
                    onClick={() => toggleDropdown(index)}
                  >
                    <span>{section.name}</span>
                    <span className="toggle-icon">{openDropdown === index ? '−' : '+'}</span>
                  </button>
                  <div className={`dropdown-content ${openDropdown === index ? 'show' : ''}`}>
                    {section.details.map((item, itemIndex) => (
                      <a key={itemIndex} href={item.path}>{item.name}</a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="footer-bottom">
            <p className="footer-copyright">
              &copy; 2025 Commix . All rights reserved.
            </p>
          </div>
        </div>
      )}
      {!isMobile && (
        // Desktop Footer
        <>
          <div className="footer-top text-center">
            <div className="rounded-logo">
              <img
                src={`${process.env.PUBLIC_URL}/images/logo.gif`}
                alt="Top logo"
                className="footer-logo"
              />
            </div>
          </div>

          <div className="footer-social-links row justify-content-center gap-3 mt-3 w-100">
            <div className="col-auto">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
            </div>
            <div className="col-auto">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                <FontAwesomeIcon icon={faFacebookF} />
              </a>
            </div>
            <div className="col-auto">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                <FontAwesomeIcon icon={faTwitter} />
              </a>
            </div>
            <div className="col-auto">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                <FontAwesomeIcon icon={faLinkedinIn} />
              </a>
            </div>
            <div className="col-auto">
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                <FontAwesomeIcon icon={faYoutube} />
              </a>
            </div>
          </div>

          <div className="footer-divider my-3"></div>

          <div className="footer-links d-flex flex-wrap justify-content-center">
            {[
              { name: 'Stores', link: '/stores' },
              { name: 'Elite', link: '/elite' },
              { name: 'Terms', link: '/terms' },
              { name: 'Returns', link: '/returns' },
              { name: 'FAQ', link: '/faq' },
              { name: 'About', link: '/about' }
            ].map((footerItem, index) => (
              <Link key={index} to={footerItem.link} className="footer-link-item mx-3">
                {footerItem.name}
              </Link>
            ))}
          </div>

          <div className="footer-divider my-3"></div>

          <div className="footer-bottom">
            <div className="footer-content-wrapper">
              <h2 className="get-in-touch">GET IN TOUCH</h2>
              <div className="contact-section">
                <div className="contact-info">
                  <p className="label">Call us at</p>
                  <p className="phone">79319324298</p>
                  <p className="timing">Monday to Friday: 09:00AM - 09:00PM</p>
                  <p className="timing">Saturday: 09:00AM - 06:00PM</p>
                </div>

                <div className="links-section">
                  <div className="link-group">
                    <h3>Support</h3>
                    <a href="mailto:hello@commic.com">hello@commic.com</a>
                  </div>

                  <div className="link-group">
                    <h3>Careers</h3>
                    <Link to="/career">We're hiring!</Link>
                  </div>

                  <div className="link-group">
                    <h3>PR Inquiries</h3>
                    <a href="mailto:pr@commix.com">pr@commix.com</a>
                  </div>

                  <div className="link-group">
                    <h3>Influencer collab</h3>
                    <Link to="/collab">Join Us</Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="footer-divider"></div>
            
            <div className="copyright">
              Copyright@2024 Commix. All rights reserved.
            </div>
          </div>
        </>
      )}
    </footer>
  );
};

export default Footer;