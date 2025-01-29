import React from 'react';
import { Link } from 'react-router-dom';
import '../Assets/Css/Footer.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faFacebookF, faTwitter, faLinkedinIn, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
  const footerLinks = [
    { name: 'Stores', link: '/stores' },
    { name: 'Elite', link: '/elite' },
    { name: 'Terms', link: '/terms' },
    { name: 'Returns', link: '/returns' },
    { name: 'FAQ', link: '/faq' },
    { name: 'About', link: '/about' }
  ];

  const isMobile = window.innerWidth <= 768;

  return (
    <footer className={`footer ${isMobile ? 'mobile-footer' : ''}`}>
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
            <div className="col-auto">
              <a href="mailto:hello@commic.com" className="social-icon">
                <FontAwesomeIcon icon={faEnvelope} />
              </a>
            </div>
          </div>

          <div className="footer-divider my-3"></div>

          <div className="footer-links d-flex flex-wrap justify-content-center">
            {footerLinks.map((footerItem, index) => (
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

      {isMobile && (
        // Mobile Footer
        <div className="mobile-footer-content">
          <div className="mobile-footer-links">
            {footerLinks.map((footerItem, index) => (
              <Link key={index} to={footerItem.link} className="mobile-footer-link">
                {footerItem.name}
              </Link>
            ))}
          </div>

          <div className="mobile-footer-divider"></div>

          <div className="mobile-footer-contact">
            <div className="contact-item">
              <FontAwesomeIcon icon={faPhone} />
              <span>79319324298</span>
            </div>
            <div className="contact-item">
              <FontAwesomeIcon icon={faEnvelope} />
              <span>hello@commic.com</span>
            </div>
          </div>

          <div className="mobile-footer-social">
            <FontAwesomeIcon icon={faInstagram} />
            <FontAwesomeIcon icon={faFacebookF} />
            <FontAwesomeIcon icon={faTwitter} />
            <FontAwesomeIcon icon={faYoutube} />
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;