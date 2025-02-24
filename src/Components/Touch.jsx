import React, { useState } from 'react';
import { toast } from 'sonner';
import axios from 'axios';
import '../Assets/Css/Touch.scss'
import { API_URL } from '../config/api';
import SectionTitle from '../Components/SectionTitle';

const Touch = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(`${API_URL}/newsletter/subscribe`, { email });
      
      if (response.data.success) {
        toast.success('Thank you for subscribing to our newsletter!');
        setEmail(''); // Clear the input
      } else {
        toast.error(response.data.message || 'Failed to subscribe. Please try again.');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to subscribe. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const backgroundStyle = {
    backgroundImage: `url(${process.env.PUBLIC_URL}/images/touchbg.png)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  return (
    <section className='touch-subscribe-section' style={backgroundStyle}>
     <SectionTitle title="LET'S STAY IN TOUCH" />
      <div className='touch-content'>
        <p className='touch-section-description'>
          Get The Latest Beauty Tips Straight To Your Inbox. Can't Wait To Connect
        </p>

        <form onSubmit={handleSubscribe} className='touch-subscribe-form'>
          <input 
            type="email" 
            placeholder='Enter Email' 
            className='touch-email-input'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
          />
          <button 
            type="submit" 
            className='touch-subscribe-button'
            disabled={isSubmitting}
          >
            {isSubmitting ? 'SUBSCRIBING...' : 'SUBSCRIBE'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Touch;