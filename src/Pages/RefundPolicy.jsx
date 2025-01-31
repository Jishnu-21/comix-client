import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import Touch from '../Components/Touch';
import '../Assets/Css/Policy.scss';

const RefundPolicy = () => {
  return (
    <>
      <Header />
      <div className="policy-container">
        <div className="policy-header">
          <h1>Returns & Refunds Policy</h1>
          <nav className="policy-breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item active">Returns & Refunds</li>
            </ol>
          </nav>
        </div>

        <div className="policy-content">
          <section className="policy-section">
            <h2>1. Returns and Eligibility</h2>
            <p>We accept returns under the following conditions:</p>
            <ul>
              <li>
                <strong>Damaged or Defective Items</strong>
                Notify us within 7 days of receiving your order. We will arrange for a return and offer a replacement or refund based on your preference.
              </li>
              <li>
                <strong>Incorrect Products</strong>
                Contact us within 7 days of delivery for wrong items received. We will arrange for the return and replacement at no additional cost.
              </li>
              <li>
                <strong>Non-Returnable Items</strong>
                For hygiene reasons, we don't accept returns for opened products unless defective.
              </li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>2. Return Process</h2>
            <ol className="numbered-list">
              <li>
                <strong>Contact Us</strong>
                Email our customer service team within 7 days of receiving the item.
              </li>
              <li>
                <strong>Return Approval</strong>
                Our team will review your request and provide instructions.
              </li>
              <li>
                <strong>Shipping</strong>
                Pack the product securely and ship it back to the provided address.
              </li>
            </ol>
            <p className="note">Please ensure items are returned in original packaging with all accessories.</p>
          </section>

          <section className="policy-section">
            <h2>3. Refunds</h2>
            <ul>
              <li>
                <strong>Processing Time</strong>
                Refunds are processed within 5-7 business days after inspection.
              </li>
              <li>
                <strong>Payment Method</strong>
                Refunds will be issued to the original payment method.
              </li>
              <li>
                <strong>Store Credit</strong>
                Optional store credit available for future purchases.
              </li>
            </ul>
            <p className="note">Note: Shipping charges are non-refundable unless the item is defective.</p>
          </section>

          <section className="policy-section">
            <h2>4. Cancellations</h2>
            <ul>
              <li>
                <strong>Time Window</strong>
                Orders can be cancelled within 24 hours of placing.
              </li>
              <li>
                <strong>Process</strong>
                Contact customer service immediately for cancellation.
              </li>
              <li>
                <strong>Refund</strong>
                Full refund issued for cancelled orders.
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

export default RefundPolicy;
