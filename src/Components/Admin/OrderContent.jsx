import React, { useState, useEffect } from 'react';
import { FaSpinner, FaDownload, FaEye, FaTimes } from 'react-icons/fa';
import api from '../../utils/api';
import { toast } from 'sonner';
import '../../Assets/Css/Admin/OrderContent.scss';

export default function OrderContent() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [downloading, setDownloading] = useState(false);
  
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/orders');
      if (response.data.success) {
        setOrders(response.data.orders || []);
      } else {
        throw new Error(response.data.message || 'Failed to fetch orders');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message || 'Failed to fetch orders');
      toast.error('Error loading orders');
    } finally {
      setLoading(false);
    }
  };

  const downloadInvoice = async (orderId) => {
    try {
      setDownloading(true);
      const response = await api.get(`/admin/orders/${orderId}/invoice`, {
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Invoice downloaded successfully');
    } catch (err) {
      console.error('Failed to download invoice:', err);
      toast.error('Failed to download invoice');
    } finally {
      setDownloading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };
    return new Date(dateString).toLocaleString('en-IN', options);
  };

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) {
      return '₹0.00';
    }
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const getCustomerName = (order) => {
    if (order.is_guest) {
      const firstName = order.guest_info?.firstName || '';
      const lastName = order.guest_info?.lastName || '';
      return `${firstName} ${lastName}`.trim() || 'Guest User';
    }
    
    if (order.user) {
      const firstName = order.user.first_name || '';
      const lastName = order.user.last_name || '';
      return `${firstName} ${lastName}`.trim() || order.user.email || 'N/A';
    }
    
    return 'N/A';
  };

  const getCustomerEmail = (order) => {
    if (order.is_guest) {
      return order.guest_info?.email || 'N/A';
    }
    return order.user?.email || 'N/A';
  };

  const viewOrderDetails = async (orderId) => {
    try {
      const response = await api.get(`/admin/orders/${orderId}`);
      if (response.data.success) {
        setSelectedOrder(response.data.order);
        setShowModal(true);
      } else {
        throw new Error(response.data.message);
      }
    } catch (err) {
      console.error('Error fetching order details:', err);
      toast.error('Failed to fetch order details');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <FaSpinner className="spinner" />
        <p>Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Error: {error}</p>
        <button className="retry-button" onClick={fetchOrders}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="orders-content">
      <div className="orders-header">
        <h2>Manage Orders</h2>
      </div>

      <div className="orders-table-container">
        <div className="table-responsive">
          {orders.length === 0 ? (
            <div className="no-orders">
              <p>No orders found.</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Order No</th>
                  <th>Customer</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const customerName = getCustomerName(order);

                  return (
                    <tr key={order._id}>
                      <td className="order-no">#{order._id.slice(-6)}</td>
                      <td className="customer-info">
                        <div className="customer-name">{customerName}</div>
                        {order.is_guest && (
                          <div className="guest-details">
                            <small>{getCustomerEmail(order)}</small>
                          </div>
                        )}
                      </td>
                      <td className="order-date">{formatDate(order.createdAt)}</td>
                      <td className="order-status">
                        <span className={`status-badge ${order.order_status.toLowerCase()}`}>
                          {order.order_status}
                        </span>
                      </td>
                      <td className="payment-status">
                        <span className={`status-badge ${order.payment_status.toLowerCase()}`}>
                          {order.payment_status}
                        </span>
                      </td>
                      <td className="order-amount">{formatCurrency(order.total_amount)}</td>
                      <td className="actions">
                        <button
                          className="action-btn view"
                          onClick={() => viewOrderDetails(order._id)}
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        <button
                          className="action-btn download"
                          onClick={() => downloadInvoice(order._id)}
                          disabled={downloading}
                          title="Download Invoice"
                        >
                          <FaDownload />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showModal && selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="order-details">
              <div className="modal-header">
                <h3>Order Details</h3>
                <button className="close-btn" onClick={() => setShowModal(false)}>
                  <FaTimes />
                </button>
              </div>

              <div className="order-info">
                <div className="info-group">
                  <label>Order Number</label>
                  <p>#{selectedOrder._id.slice(-6)}</p>
                </div>
                <div className="info-group">
                  <label>Order Date</label>
                  <p>{formatDate(selectedOrder.createdAt)}</p>
                </div>
                <div className="info-group">
                  <label>Order Status</label>
                  <p>
                    <span className={`status-badge ${selectedOrder.order_status.toLowerCase()}`}>
                      {selectedOrder.order_status}
                    </span>
                  </p>
                </div>
                <div className="info-group">
                  <label>Payment Status</label>
                  <p>
                    <span className={`status-badge ${selectedOrder.payment_status.toLowerCase()}`}>
                      {selectedOrder.payment_status}
                    </span>
                  </p>
                </div>
              </div>

              <div className="customer-details">
                <h4>Customer Information</h4>
                <p>
                  <strong>Name:</strong> {getCustomerName(selectedOrder)}
                </p>
                <p>
                  <strong>Email:</strong> {getCustomerEmail(selectedOrder)}
                </p>
                <p>
                  <strong>Type:</strong> {selectedOrder.is_guest ? 'Guest User' : 'Registered User'}
                </p>
              </div>

              <div className="shipping-details">
                <h4>Shipping Address</h4>
                <p>
                  {selectedOrder.shipping_address?.street}<br />
                  {selectedOrder.shipping_address?.city}, {selectedOrder.shipping_address?.state}<br />
                  {selectedOrder.shipping_address?.country} - {selectedOrder.shipping_address?.pincode}
                </p>
              </div>

              <div className="order-items">
                <h4>Order Items</h4>
                <table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items?.map((item) => (
                      <tr key={item._id}>
                        <td>
                          <div className="item-details">
                            {item.product_id?.image && (
                              <img 
                                src={item.product_id.image} 
                                alt={item.product_id?.title || 'Product'} 
                                onError={(e) => {
                                  e.target.src = '/placeholder-image.jpg';
                                  e.target.onerror = null;
                                }}
                              />
                            )}
                            <div className="item-info">
                              <div className="item-name">
                                {item.product_id?.title || 'Product Not Available'}
                              </div>
                              <div className="item-meta">
                                SKU: {item.product_id?.sku || 'N/A'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="quantity">{item.quantity || 0}</td>
                        <td className="price">{formatCurrency(item.price)}</td>
                        <td className="subtotal">{formatCurrency(item.total || (item.quantity * item.price))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="order-summary">
                <div className="summary-row">
                  <label>Subtotal</label>
                  <div className="amount">{formatCurrency(selectedOrder.subtotal)}</div>
                </div>
                {selectedOrder.shipping_fee > 0 && (
                  <div className="summary-row">
                    <label>Shipping</label>
                    <div className="amount">{formatCurrency(selectedOrder.shipping_fee)}</div>
                  </div>
                )}
                {selectedOrder.tax > 0 && (
                  <div className="summary-row">
                    <label>Tax</label>
                    <div className="amount">{formatCurrency(selectedOrder.tax)}</div>
                  </div>
                )}
                {selectedOrder.discount > 0 && (
                  <div className="summary-row">
                    <label>Discount</label>
                    <div className="amount">-{formatCurrency(selectedOrder.discount)}</div>
                  </div>
                )}
                <div className="summary-row total">
                  <label>Total</label>
                  <div className="amount">{formatCurrency(selectedOrder.total_amount)}</div>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="close-btn"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
              <button
                className="download-btn"
                onClick={() => downloadInvoice(selectedOrder._id)}
                disabled={downloading}
              >
                {downloading ? 'Downloading...' : 'Download Invoice'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
