import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '../../config/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import '../../Assets/Css/Profile/AddressBook.scss';

const AddressBook = () => {
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    address_name: 'Home',
    street: '',
    state: '',
    house: '',
    postcode: '',
    location: '',
    country: '',
    phone_number: '',
    firstName: '',
    lastName: ''
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const userString = localStorage.getItem('user');
      if (!userString) {
        toast.error('Please log in to view addresses');
        return;
      }

      const response = await axios.get(`${API_URL}/user/addresses`);
      if (response.data.success) {
        setAddresses(response.data.addresses || []);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
      toast.error('Failed to load addresses');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAddress) {
        await axios.put(`${API_URL}/user/address/${editingAddress._id}`, formData);
        toast.success('Address updated successfully');
      } else {
        await axios.post(`${API_URL}/user/address`, formData);
        toast.success('Address added successfully');
      }
      
      setShowAddForm(false);
      setEditingAddress(null);
      setFormData({
        address_name: 'Home',
        street: '',
        state: '',
        house: '',
        postcode: '',
        location: '',
        country: '',
        phone_number: '',
        firstName: '',
        lastName: ''
      });
      fetchAddresses();
    } catch (error) {
      console.error('Error saving address:', error);
      toast.error(error.response?.data?.message || 'Failed to save address');
    }
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setFormData({
      address_name: address.address_name,
      street: address.street,
      state: address.state,
      house: address.house,
      postcode: address.postcode,
      location: address.location,
      country: address.country,
      phone_number: address.phone_number,
      firstName: address.firstName,
      lastName: address.lastName
    });
    setShowAddForm(true);
  };

  const handleDelete = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/user/address/${addressId}`);
      toast.success('Address deleted successfully');
      fetchAddresses();
    } catch (error) {
      console.error('Error deleting address:', error);
      toast.error('Failed to delete address');
    }
  };

  if (isLoading) {
    return <div className="loading">Loading addresses...</div>;
  }

  return (
    <div className="address-book">
      <div className="address-book-header">
        <h2>My Addresses</h2>
        <button 
          className="add-address-btn"
          onClick={() => {
            setShowAddForm(true);
            setEditingAddress(null);
            setFormData({
              address_name: 'Home',
              street: '',
              state: '',
              house: '',
              postcode: '',
              location: '',
              country: '',
              phone_number: '',
              firstName: '',
              lastName: ''
            });
          }}
        >
          <FontAwesomeIcon icon={faPlus} /> Add New Address
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="address-form">
          <h3>{editingAddress ? 'Edit Address' : 'Add New Address'}</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>Address Type</label>
              <select 
                name="address_name" 
                value={formData.address_name}
                onChange={handleInputChange}
                required
              >
                <option value="Home">Home</option>
                <option value="Work">Work</option>
                <option value="Office">Office</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Street</label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>House/Apartment</label>
              <input
                type="text"
                name="house"
                value={formData.house}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Postal Code</label>
              <input
                type="text"
                name="postcode"
                value={formData.postcode}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="save-btn">
              {editingAddress ? 'Update Address' : 'Save Address'}
            </button>
            <button 
              type="button" 
              className="cancel-btn"
              onClick={() => {
                setShowAddForm(false);
                setEditingAddress(null);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="addresses-list">
        {addresses.length === 0 ? (
          <p className="no-addresses">No addresses found. Add your first address!</p>
        ) : (
          addresses.map((address) => (
            <div key={address._id} className="address-card">
              <div className="address-type">{address.address_name}</div>
              <div className="address-details">
                <p className="name">{address.firstName} {address.lastName}</p>
                <p className="street">{address.house}, {address.street}</p>
                <p className="location">{address.location}</p>
                <p className="state-post">{address.state}, {address.postcode}</p>
                <p className="country">{address.country}</p>
                <p className="phone">{address.phone_number}</p>
              </div>
              <div className="address-actions">
                <button 
                  className="edit-btn"
                  onClick={() => handleEdit(address)}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => handleDelete(address._id)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AddressBook;
