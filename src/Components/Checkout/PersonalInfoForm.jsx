import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addAddress } from '../../features/user/userSlice';
import { toast } from 'react-toastify';
import '../../Assets/Css/CheckOut/PersonalInfoForm.scss';

const PersonalInfoForm = ({ onSubmit, isLoggedIn }) => {
  const dispatch = useDispatch();
  const [isAddressSubmitted, setIsAddressSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone_number: '',
    address_name: 'Home', // Default value for logged-in users
    street: '',
    state: '',
    house: '',
    postcode: '',
    location: '',
    country: '',
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      'firstName', 'lastName', 'street', 'house', 
      'postcode', 'location', 'country', 'phone_number', 'state'
    ];

    requiredFields.forEach(field => {
      if (!formData[field]?.trim()) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1).replace('_', ' ')} is required`;
      }
    });

    // Validate phone number
    const phoneNumber = formData.phone_number.replace(/\D/g, '');
    if (phoneNumber.length !== 10) {
      newErrors.phone_number = 'Phone number must be 10 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const addressData = {
      ...formData,
      phone_number: formData.phone_number.replace(/\D/g, ''),
    };

    try {
      const userString = localStorage.getItem('user');
      
      if (isLoggedIn && userString) {
        // Logged in user - save to DB
        const userData = JSON.parse(userString);
        const userId = userData.user?.id || userData.id;
        
        if (userId) {
          const newAddress = await dispatch(addAddress(addressData)).unwrap();
          toast.success('Address saved successfully!');
          setIsAddressSubmitted(true);
          
          // Call the onSubmit function to update the parent component
          if (onSubmit) {
            onSubmit(newAddress); // Pass the new address to the parent
          }
        }
      } else {
        // Guest user - save to localStorage
        const guestAddresses = JSON.parse(localStorage.getItem('guestAddresses') || '[]');
        const newAddress = {
          ...addressData,
          id: Date.now().toString(),
          created_at: new Date().toISOString()
        };
        
        const isDuplicate = guestAddresses.some(addr => 
          addr.street === newAddress.street && 
          addr.house === newAddress.house &&
          addr.postcode === newAddress.postcode
        );

        if (!isDuplicate) {
          guestAddresses.push(newAddress);
          localStorage.setItem('guestAddresses', JSON.stringify(guestAddresses));
          toast.success('Address saved successfully!');
          setIsAddressSubmitted(true);
          
          // Call the onSubmit function to update the parent component
          if (onSubmit) {
            onSubmit(newAddress); // Pass the new address to the parent
          }
          localStorage.removeItem('guestAddresses');
        } else {
          toast.warning('This address already exists!');
        }
      }
    } catch (error) {
      console.error('Error saving address:', error);
      toast.error(error.message || 'Failed to save address');
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 mb-4 w-full max-w-[95%] mx-auto md:max-w-[600px] md:p-6 md:mb-6">
      <form onSubmit={handleSaveAddress} className="w-full">
        <input 
          type="text" 
          name="firstName"
          placeholder="First name*" 
          className={`w-full px-3 py-3 mb-4 border text-base bg-white rounded
            ${errors.firstName ? 'border-red-500' : 'border-gray-300'}
            ${isAddressSubmitted ? 'bg-gray-100' : 'bg-white'}
            disabled:bg-gray-100 disabled:cursor-not-allowed`}
          value={formData.firstName}
          onChange={handleChange}
          disabled={isAddressSubmitted}
        />
        {errors.firstName && <span className="text-red-500 text-xs mt-1 mb-2">{errors.firstName}</span>}
        
        <input 
          type="text" 
          name="lastName"
          placeholder="Last name*" 
          className={`w-full px-3 py-3 mb-4 border text-base bg-white rounded
            ${errors.lastName ? 'border-red-500' : 'border-gray-300'}
            ${isAddressSubmitted ? 'bg-gray-100' : 'bg-white'}
            disabled:bg-gray-100 disabled:cursor-not-allowed`}
          value={formData.lastName}
          onChange={handleChange}
          disabled={isAddressSubmitted}
        />
        {errors.lastName && <span className="text-red-500 text-xs mt-1 mb-2">{errors.lastName}</span>}
        
        <input 
          type="email" 
          name="email"
          placeholder="E-Mail" 
          className={`w-full px-3 py-3 mb-4 border text-base bg-white rounded
            ${errors.email ? 'border-red-500' : 'border-gray-300'}
            ${isAddressSubmitted ? 'bg-gray-100' : 'bg-white'}
            disabled:bg-gray-100 disabled:cursor-not-allowed`}
          value={formData.email}
          onChange={handleChange}
          disabled={isAddressSubmitted}
        />
        
        {/* Street and House inputs */}
        <div className="flex flex-col md:flex-row md:gap-4 w-full">
          <div className="w-full md:flex-[2]">
            <input 
              type="text" 
              name="street"
              placeholder="Street*" 
              className={`w-full px-3 py-3 mb-4 border text-base bg-white rounded
                ${errors.street ? 'border-red-500' : 'border-gray-300'}
                ${isAddressSubmitted ? 'bg-gray-100' : 'bg-white'}
                disabled:bg-gray-100 disabled:cursor-not-allowed`}
              value={formData.street}
              onChange={handleChange}
              disabled={isAddressSubmitted}
            />
            {errors.street && <span className="text-red-500 text-xs mt-1 mb-2">{errors.street}</span>}
          </div>
          
          <div className="w-full md:flex-1">
            <input 
              type="text" 
              name="house"
              placeholder="House*" 
              className={`w-full px-3 py-3 mb-4 border text-base bg-white rounded
                ${errors.house ? 'border-red-500' : 'border-gray-300'}
                ${isAddressSubmitted ? 'bg-gray-100' : 'bg-white'}
                disabled:bg-gray-100 disabled:cursor-not-allowed`}
              value={formData.house}
              onChange={handleChange}
              disabled={isAddressSubmitted}
            />
            {errors.house && <span className="text-red-500 text-xs mt-1 mb-2">{errors.house}</span>}
          </div>
        </div>
        
        <input 
          type="text" 
          name="postcode"
          placeholder="PostCode*" 
          className={`w-full px-3 py-3 mb-4 border text-base bg-white rounded
            ${errors.postcode ? 'border-red-500' : 'border-gray-300'}
            ${isAddressSubmitted ? 'bg-gray-100' : 'bg-white'}
            disabled:bg-gray-100 disabled:cursor-not-allowed`}
          value={formData.postcode}
          onChange={handleChange}
          disabled={isAddressSubmitted}
        />
        {errors.postcode && <span className="text-red-500 text-xs mt-1 mb-2">{errors.postcode}</span>}
        
        <input 
          type="text" 
          name="location"
          placeholder="Location*" 
          className={`w-full px-3 py-3 mb-4 border text-base bg-white rounded
            ${errors.location ? 'border-red-500' : 'border-gray-300'}
            ${isAddressSubmitted ? 'bg-gray-100' : 'bg-white'}
            disabled:bg-gray-100 disabled:cursor-not-allowed`}
          value={formData.location}
          onChange={handleChange}
          disabled={isAddressSubmitted}
        />
        {errors.location && <span className="text-red-500 text-xs mt-1 mb-2">{errors.location}</span>}
        
        <input 
          type="text" 
          name="state"
          placeholder="State*" 
          className={`w-full px-3 py-3 mb-4 border text-base bg-white rounded
            ${errors.state ? 'border-red-500' : 'border-gray-300'}
            ${isAddressSubmitted ? 'bg-gray-100' : 'bg-white'}
            disabled:bg-gray-100 disabled:cursor-not-allowed`}
          value={formData.state}
          onChange={handleChange}
          disabled={isAddressSubmitted}
        />
        {errors.state && <span className="text-red-500 text-xs mt-1 mb-2">{errors.state}</span>}
        
        <select 
          name="country"
          className={`w-full px-3 py-3 mb-4 border text-base bg-white rounded appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_0.7rem_top_50%] bg-[length:0.65rem_auto]
            ${errors.country ? 'border-red-500' : 'border-gray-300'}
            ${isAddressSubmitted ? 'bg-gray-100' : 'bg-white'}
            disabled:bg-gray-100 disabled:cursor-not-allowed`}
          value={formData.country}
          onChange={handleChange}
          disabled={isAddressSubmitted}
        >
          <option value="">Select Country</option>
          <option value="India">India</option>
          <option value="Turkey">Turkey</option>
          <option value="USA">USA</option>
          <option value="England">England</option>
          <option value="France">France</option>
          <option value="Germany">Germany</option>
        </select>
        {errors.country && <span className="text-red-500 text-xs mt-1 mb-2">{errors.country}</span>}
        
        <input 
          type="tel" 
          name="phone_number"
          placeholder="Phone Number*" 
          className={`w-full px-3 py-3 mb-4 border text-base bg-white rounded
            ${errors.phone_number ? 'border-red-500' : 'border-gray-300'}
            ${isAddressSubmitted ? 'bg-gray-100' : 'bg-white'}
            disabled:bg-gray-100 disabled:cursor-not-allowed`}
          value={formData.phone_number}
          onChange={handleChange}
          disabled={isAddressSubmitted}
        />
        {errors.phone_number && <span className="text-red-500 text-xs mt-1 mb-2">{errors.phone_number}</span>}
        
        <p className="text-sm text-gray-600 mb-4">*Required field</p>
        
        {isAddressSubmitted ? (
          <div className="flex gap-4 my-5">
            <button 
              type="button" 
              className="flex-1 px-3 py-3 bg-green-500 text-white rounded cursor-not-allowed opacity-80"
              disabled
            >
              ✓ Address Selected
            </button>
            <button 
              type="button"
              className="px-6 py-3 bg-white text-black border border-black rounded cursor-pointer transition-all duration-300 hover:bg-gray-100"
              onClick={() => setIsAddressSubmitted(false)}
            >
              Edit Address
            </button>
          </div>
        ) : (
          <button 
            type="submit" 
            className="w-full px-3 py-3 my-5 bg-black text-white rounded cursor-pointer transition-colors duration-300 hover:bg-gray-800"
          >
            Use This Address
          </button>
        )}
      </form>
    </div>
  );
};

export default PersonalInfoForm;