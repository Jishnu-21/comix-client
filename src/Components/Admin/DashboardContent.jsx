import React, { useState, useEffect } from 'react';
import { FaUsers, FaShoppingCart, FaMoneyBillWave, FaBox, FaSpinner } from 'react-icons/fa';
import '../../Assets/Css/Admin/Dashboard.scss';
import api from '../../utils/api';
import { toast } from 'sonner';

export default function DashboardContent() {
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/admin/dashboard');
        
        if (response.data.success) {
          setDashboardData(response.data.data || {
            totalUsers: 0,
            totalOrders: 0,
            totalRevenue: 0,
            pendingOrders: 0,
            completedOrders: 0,
            recentOrders: []
          });
        } else {
          throw new Error(response.data.message || 'Failed to fetch dashboard data');
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message);
        toast.error('Error loading dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <FaSpinner className="spinner" />
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <p>Error: {error}</p>
        <button 
          className="retry-button"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  const formatNumber = (number) => {
    return (number || 0).toLocaleString();
  };

  const formatCurrency = (amount) => {
    return (amount || 0).toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'completed';
      case 'pending':
        return 'pending';
      case 'cancelled':
        return 'cancelled';
      default:
        return '';
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Dashboard Overview</h2>
        <p>Welcome to your admin dashboard</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon users">
            <FaUsers />
          </div>
          <div className="stat-details">
            <h3>Total Users</h3>
            <p className="stat-value">{formatNumber(dashboardData.totalUsers)}</p>
            <p className="stat-change positive">Active customers</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orders">
            <FaShoppingCart />
          </div>
          <div className="stat-details">
            <h3>Total Orders</h3>
            <p className="stat-value">{formatNumber(dashboardData.totalOrders)}</p>
            <p className="stat-change">
              {formatNumber(dashboardData.pendingOrders)} pending
            </p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon revenue">
            <FaMoneyBillWave />
          </div>
          <div className="stat-details">
            <h3>Total Revenue</h3>
            <p className="stat-value">{formatCurrency(dashboardData.totalRevenue)}</p>
            <p className="stat-change">
              {formatNumber(dashboardData.completedOrders)} completed
            </p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon products">
            <FaBox />
          </div>
          <div className="stat-details">
            <h3>Recent Orders</h3>
            <p className="stat-value">{formatNumber(dashboardData.recentOrders.length)}</p>
            <p className="stat-change">Latest transactions</p>
          </div>
        </div>
      </div>

      <div className="recent-orders-section">
        <div className="section-header">
          <h3>Recent Orders</h3>
          <button className="view-all">View All Orders</button>
        </div>
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.recentOrders.map((order) => (
                <tr key={order._id}>
                  <td>#{order._id.slice(-6)}</td>
                  <td>
                    {order.user ? (
                      <div className="customer-info">
                        <span className="name">
                          {`${order.user.first_name} ${order.user.last_name}`}
                        </span>
                        <span className="email">{order.user.email}</span>
                      </div>
                    ) : (
                      'Guest User'
                    )}
                  </td>
                  <td>{formatCurrency(order.total_amount)}</td>
                  <td>
                    <span className={`status-badge ${getStatusColor(order.order_status)}`}>
                      {order.order_status}
                    </span>
                  </td>
                  <td>
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </td>
                </tr>
              ))}
              {dashboardData.recentOrders.length === 0 && (
                <tr>
                  <td colSpan="5" className="no-orders">
                    No recent orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
