import React, { useState, useEffect } from 'react';
import { ChevronRight, Send, X, MessageCircle } from 'lucide-react';
import botImage from '../../Assets/Image/Group 6.png';
import messageSound from '../../Assets/Sounds/message-sound.mp3';

const ChatbotModal = ({ isOpen, onClose, is404Page }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [showWhatsAppButton, setShowWhatsAppButton] = useState(false);

  const questions = [
    "What is your return policy?",
    "Where do you ship to?",
    "What is your shipping policy?",
    "Do you work with wholesalers?",
    "What are the ingredients in your products?",
    "Are your products cruelty-free?",
    "How do I track my order?",
    "What payment methods do you accept?",
    "Do you offer international shipping?",
    "How long does shipping take?",
    "Can I modify my order after placing it?",
    "What if I receive a damaged product?",
    "Do you have gift wrapping options?",
    "Are your products vegan?",
    "What's your best-selling product?",
    "How do I contact customer support?"
  ];

  useEffect(() => {
    if (isOpen) {
      if (is404Page) {
        setMessages([
          { 
            text: "Oops! It looks like you've landed on a page that doesn't exist. How can I help you find what you're looking for?", 
            sender: 'bot' 
          }
        ]);
      } else {
        setMessages([
          { 
            text: "Hi, I'm Alia from Comix. How can I help you?", 
            sender: 'bot' 
          }
        ]);
      }
    }
  }, [isOpen, is404Page]);

  const handleSendMessage = () => {
    if (inputMessage.trim() !== '') {
      setMessages([...messages, { text: inputMessage, sender: 'user' }]);
      setInputMessage('');

      setTimeout(() => {
        let botResponse;
        const lowerMessage = inputMessage.toLowerCase();
        
        if (lowerMessage.includes('hi') || lowerMessage.includes('hello')) {
          botResponse = "Hi there! How can I assist you today?";
        }
        else if (lowerMessage.includes('return') || lowerMessage.includes('exchange')) {
          botResponse = "We offer a 30-day return policy. Items must be unopened and in original packaging. Please contact our support team to initiate a return.";
        }
        else if (lowerMessage.includes('ship') || lowerMessage.includes('deliver')) {
          botResponse = "We currently ship to all major Indian cities. Domestic shipping takes 3-5 business days. International shipping available to 15+ countries with 7-10 business day delivery.";
        }
        else if (lowerMessage.includes('wholesale') || lowerMessage.includes('bulk')) {
          botResponse = "Yes! We work with wholesalers. Please email wholesale@comix.com with your business details and order requirements. Minimum order quantity is ₹50,000.";
        }
        else if (lowerMessage.includes('ingredient') || lowerMessage.includes('formula')) {
          botResponse = "Our products use natural, plant-based ingredients. All formulas are free from parabens, sulfates, and phthalates. Full ingredient lists are available on each product page.";
        }
        else if (lowerMessage.includes('cruelty') || lowerMessage.includes('animal')) {
          botResponse = "All Comix products are 100% cruelty-free and certified by PETA. We never test on animals and use only vegan-friendly testing methods.";
        }
        else if (lowerMessage.includes('track')) {
          botResponse = "You'll receive a tracking number via email/SMS once your order ships. You can also track your order through our website's order status page.";
        }
        else if (lowerMessage.includes('payment')) {
          botResponse = "We accept all major credit/debit cards, UPI, NetBanking, and wallets like Paytm/PhonePe. COD available for orders under ₹5000. All transactions are SSL-secured.";
        }
        else if (lowerMessage.includes('purchase') || lowerMessage.includes('buy')) {
          botResponse = "Great! I'd be happy to assist you with your purchase. Would you like to continue on WhatsApp for a more personalized shopping experience?";
          setShowWhatsAppButton(true);
        }
        else if (lowerMessage.includes('vegan')) {
          botResponse = "95% of our products are vegan-certified. Look for the green vegan badge on product pages. We're working to make all products 100% vegan by 2024!";
        }
        else if (lowerMessage.includes('damage') || lowerMessage.includes('broken')) {
          botResponse = "We're sorry to hear that! Please send photos of the damaged product to support@comix.com within 48 hours of delivery. We'll arrange a free replacement or refund.";
        }
        else if (lowerMessage.includes('gift')) {
          botResponse = "Yes! Add gift wrapping during checkout for ₹50. Includes premium eco-friendly packaging and a personalized message. Perfect for special occasions!";
        }
        else if (lowerMessage.includes('contact')) {
          botResponse = "You can reach us through:\n- Email: support@comix.com\n- Phone: +91 12345 67890\n- WhatsApp: +91 98765 43210\n- Live Chat: Available 9AM-9PM IST";
        }
        else if (is404Page) {
          botResponse = "I'm sorry you're having trouble finding what you're looking for. Can you tell me more about what you need? I'd be happy to help guide you to the right place.";
        }
        else {
          botResponse = "Here are some frequently asked questions that might help:";
        }

        setMessages(prevMessages => [...prevMessages, { text: botResponse, sender: 'bot' }]);
        
        const botAudio = new Audio(messageSound);
        botAudio.play();
      }, 500);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleWhatsAppPurchase = () => {
    const whatsappNumber = '+912345678901'; // Replace with actual number
    const message = encodeURIComponent('Hi Comix team, I want to make a purchase');
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className={`chatbot-modal ${isOpen ? 'open' : ''}`}>
      <div className="chatbot-header">
        <div className="header-content">
          <img src={botImage} alt="Bot Avatar" className="bot-avatar" />
          <span className="header-text">Ask Alia</span>
        </div>
        <button 
          className="modal-close-button" 
          onClick={onClose}
          aria-label="Close chat"
        >
          ×
        </button>
      </div>
      <div className="chatbot-content">
        <div className="chatbot-messages">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.sender}`}>
              <p>{message.text}</p>
              {message.sender === 'bot' && message.text.includes("frequently asked questions") && (
                <div className="faq-section">
                  {questions.map((question, qIndex) => (
                    <div key={qIndex} className="faq-item" onClick={() => setInputMessage(question)}>
                      {question}
                      <ChevronRight className="arrow-icon" size={16} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        {showWhatsAppButton && (
          <div className="chatbot-actions">
            <button className="whatsapp-button" onClick={handleWhatsAppPurchase}>
              <MessageCircle size={18} />
              Continue on WhatsApp
            </button>
          </div>
        )}
        <div className="leave-message">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question..."
            className="leave-message-input"
          />
          <Send className="send-icon" size={18} onClick={handleSendMessage} />
        </div>
      </div>
      <div className="chatbot-footer">
        <button className="close-chat-button" onClick={onClose}>
          Close Chat
        </button>
      </div>
    </div>
  );
};

export default ChatbotModal;