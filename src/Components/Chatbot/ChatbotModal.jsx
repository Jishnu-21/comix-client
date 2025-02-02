import React, { useState, useEffect } from 'react';
import { ChevronRight, Send, X, MessageCircle } from 'lucide-react';
import botImage from '../../Assets/Image/Group 6.png';
import messageSound from '../../Assets/Sounds/message-sound.mp3';
import axios from 'axios';
import { API_URL } from '../../config/api';

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
  const handleSendMessage = async () => {
    if (inputMessage.trim() !== '') {
      setMessages([...messages, { text: inputMessage, sender: 'user' }]);
      setInputMessage('');
  
      try {
        const response = await axios.post('http://localhost:5000/api/groq/chat', {
          message: inputMessage
        });
  
        setMessages(prevMessages => [...prevMessages, { text: response.data.response, sender: 'bot' }]);
  
        const botAudio = new Audio(messageSound);
        botAudio.play();
      } catch (error) {
        console.error('Error getting AI response:', error);
        setMessages(prevMessages => [...prevMessages, { 
          text: "I'm sorry, I'm having trouble processing your request at the moment. Please try again later.", 
          sender: 'bot' 
        }]);
      }
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