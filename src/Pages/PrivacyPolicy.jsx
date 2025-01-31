import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import Touch from '../Components/Touch';
import '../Assets/Css/Policy.scss';

const PrivacyPolicy = () => {
  return (
    <>
      <Header />
      <div className="policy-container">
        <div className="policy-header">
          <h1>Privacy Policy</h1>
          <nav className="policy-breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item active">Privacy Policy</li>
            </ol>
          </nav>
        </div>

        <div className="policy-content">
          <section className="policy-section">
            <h2>1. Information We Collect</h2>
            <p>We collect and process several types of personal information to enhance your experience and improve our services. This information includes:</p>
            <ul>
              <li>
                <strong>Personal Identification Information</strong>
                When you make a purchase, create an account, or contact us, we may collect your name, email address, shipping and billing address, phone number, and payment information.
              </li>
              <li>
                <strong>Device and Usage Information</strong>
                We collect information on how you access and use our website, such as IP addresses, browser type, device type, operating system, and usage patterns.
              </li>
              <li>
                <strong>Transaction Data</strong>
                When you make purchases, we retain details of your orders, including product selections, purchase amount, and transaction details.
              </li>
              <li>
                <strong>Communication Data:</strong> Any data you voluntarily provide when you contact us, subscribe to our newsletters, or participate in surveys, promotions, or events.
              </li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>2. How We Use Your Information</h2>
            <ul>
              <li>
                <strong>Order Processing</strong>
                To fulfill your purchases, process payments, arrange for shipping, and provide order confirmations.
              </li>
              <li>
                <strong>Customer Service</strong>
                To respond to your inquiries, manage your account, process returns, and assist with any issues.
              </li>
              <li>
                <strong>Personalization</strong>
                To tailor our services and product recommendations based on your preferences and usage patterns.
              </li>
              <li>
                <strong>Marketing and Promotions:</strong> With your consent, we may send you promotional materials and newsletters.
              </li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>3. How We Share Your Information</h2>
            <ul>
              <li>
                <strong>Service Providers</strong>
                We use third-party service providers for payment processing, shipping, marketing, and website hosting.
              </li>
              <li>
                <strong>Business Transfers</strong>
                If Commix undergoes a business transaction, your data may be transferred.
              </li>
              <li>
                <strong>Legal Compliance</strong>
                We may disclose information if required by law.
              </li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>Contact Us</h2>
            <div className="contact-info">
              <h3>Get in Touch</h3>
              <p>Email: support@commix.com</p>
              <p>Phone: +91-XXX-XXXXXXX</p>
              <p>Address: [Company Address]</p>
            </div>
          </section>
        </div>
      </div>
      <Touch />
      <Footer />
    </>
  );
};

export default PrivacyPolicy;
