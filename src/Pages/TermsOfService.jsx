import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import Touch from '../Components/Touch';
import '../Assets/Css/Policy.scss';

const TermsOfService = () => {
  return (
    <>
      <Header />
      <div className="policy-container">
        <div className="policy-header">
          <h1>Terms of Service</h1>
          <nav className="policy-breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item active">Terms of Service</li>
            </ol>
          </nav>
        </div>

        <div className="policy-content">
          <section className="policy-section">
            <h2>1. Introduction</h2>
            <p>These Terms and Conditions govern your use of our website and the purchase of our products. By accessing our website or purchasing from us, you accept these terms and agree to abide by them.</p>
          </section>

          <section className="policy-section">
            <h2>2. Product Information</h2>
            <ul>
              <li>
                <strong>Descriptions</strong>
                We strive to provide accurate descriptions, images, and details of our products. However, due to monitor display differences, colors may appear slightly different from the actual product.
              </li>
              <li>
                <strong>Ingredients</strong>
                Our products contain various ingredients listed on the packaging. Please review these ingredients to ensure suitability.
              </li>
              <li>
                <strong>Usage</strong>
                Please read the instructions carefully and discontinue use if any adverse reaction occurs.
              </li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>3. Orders and Payment</h2>
            <ul>
              <li>
                <strong>Order Acceptance</strong>
                All orders are subject to acceptance. We reserve the right to refuse or cancel an order at our discretion.
              </li>
              <li>
                <strong>Pricing</strong>
                Prices are listed in Indian Currency and include applicable taxes.
              </li>
              <li>
                <strong>Payment Methods</strong>
                We accept payments via various methods including Credit/Debit Cards, Digital Wallets, and UPI.
              </li>
            </ul>
            <p className="note">Please note that order confirmation emails do not signify acceptance of your order but only acknowledge that we have received it.</p>
          </section>

          <section className="policy-section">
            <h2>4. Shipping and Delivery</h2>
            <ul>
              <li>
                <strong>Processing Time</strong>
                Orders are typically processed within 2-3 business days.
              </li>
              <li>
                <strong>Shipping Charges</strong>
                Fees vary based on order size and delivery location.
              </li>
              <li>
                <strong>International Shipping</strong>
                Additional duties and taxes may apply for international orders.
              </li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>Contact Information</h2>
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

export default TermsOfService;
