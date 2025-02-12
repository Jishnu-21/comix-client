import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import api from '../../utils/api';
import '../../Assets/Css/Profile/MyOrders.scss';
import { useNavigate } from 'react-router-dom';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const userString = localStorage.getItem('user');
      const accessToken = localStorage.getItem('accessToken');
      
      if (!userString || !accessToken) {
        toast.error('Please log in to view orders');
        setIsLoading(false);
        return;
      }

      const user = JSON.parse(userString);
      const userId = user._id || user.id || (user.user && (user.user._id || user.user.id));

      if (!userId) {
        console.error('No user ID found:', user);
        toast.error('Unable to fetch orders. Please try logging in again.');
        setIsLoading(false);
        return;
      }

      console.log('Fetching orders for user ID:', userId);
      const response = await api.get(`/orders/history/${userId}`);
      
      if (response.data.success) {
        setOrders(response.data.orders || []);
      } else {
        toast.error('Failed to load orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error(error.response?.data?.message || 'Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const getOrderStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'text-yellow-600';
      case 'processing':
        return 'text-blue-600';
      case 'shipped':
        return 'text-purple-600';
      case 'delivered':
        return 'text-green-600';
      case 'cancelled':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FontAwesomeIcon icon={faSpinner} spin size="2x" />
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold mb-4">My Orders</h2>
        <p>You haven't placed any orders yet.</p>
        <button 
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => navigate('/product')}
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="my-orders-container p-4">
      <h2 className="text-xl font-semibold mb-6">My Orders</h2>
      <div className="orders-list space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="order-card bg-white p-4 rounded-lg shadow">
            <div className="order-header flex justify-between items-center mb-4">
              <div>
                <p className="font-semibold">Order #{order.order_no}</p>
                <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
              </div>
              <div className={`order-status ${getOrderStatusColor(order.order_status)}`}>
                {order.order_status}
              </div>
            </div>
            
            <div className="order-items space-y-4">
              {order.items.map((item) => (
                <div key={item._id} className="item-card flex items-center p-2 border-b">
                  <img 
                    src={item.product.image} 
                    alt={item.product_name} 
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="ml-4 flex-grow">
                    <p className="font-medium">{item.product_name}</p>
                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity} {item.variant_name && `- ${item.variant_name}`}
                    </p>
                    <p className="text-sm font-medium">₹{item.total_price}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="order-footer mt-4 pt-4 border-t flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Payment Method: {order.payment_method}</p>
                <p className="text-sm text-gray-600">Status: {order.payment_status}</p>
              </div>
              <div className="text-lg font-semibold">
                Total: ₹{order.total_amount}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
