import React, { useState, useEffect } from 'react';
import { FaSearch, FaSpinner, FaUserEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import api from '../../utils/api';
import { toast } from 'sonner';
import '../../Assets/Css/Admin/UserContent.scss';

export default function UsersContent() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/users');
      if (response.data.success) {
        // Format users data with proper default values
        const formattedUsers = (response.data.users || []).map(user => ({
          ...user,
          name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Unknown',
          status: user.isBlocked ? 'Blocked' : 'Active'
        }));
        setUsers(formattedUsers);
      } else {
        throw new Error(response.data.message || 'Failed to fetch users');
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.message);
      toast.error('Error loading users');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter(user => {
    if (!user) return false;
    const searchLower = searchTerm.toLowerCase();
    const nameMatch = user.name?.toLowerCase()?.includes(searchLower) || false;
    const emailMatch = user.email?.toLowerCase()?.includes(searchLower) || false;
    return nameMatch || emailMatch;
  });

  const handleStatusChange = async (userId, newStatus) => {
    try {
      const isBlocked = newStatus === 'Blocked';
      const response = await api.patch(`/admin/users/${userId}/block`, {
        isBlocked
      });
      
      if (response.data.success) {
        setUsers(users.map(user =>
          user._id === userId ? { ...user, status: newStatus } : user
        ));
        toast.success('User status updated successfully');
      } else {
        throw new Error(response.data.message);
      }
    } catch (err) {
      console.error('Error updating user status:', err);
      toast.error('Failed to update user status');
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const response = await api.delete(`/admin/users/${userId}`);
      if (response.data.success) {
        setUsers(users.filter(user => user._id !== userId));
        setShowModal(false);
        toast.success('User deleted successfully');
      } else {
        throw new Error(response.data.message);
      }
    } catch (err) {
      console.error('Error deleting user:', err);
      toast.error('Failed to delete user');
    }
  };

  const openModal = (user, action) => {
    setSelectedUser(user);
    setModalAction(action);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <FaSpinner className="spinner" />
        <p>Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Error: {error}</p>
        <button className="retry-button" onClick={fetchUsers}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="users-content">
      <div className="users-header">
        <h2>Manage Users</h2>
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      <div className="users-table-container">
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Join Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <tr key={user._id}>
                    <td className="user-name">
                      <div className="user-info">
                        <div className="avatar">
                          {(user.name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <span>{user.name}</span>
                      </div>
                    </td>
                    <td className="user-email">{user.email || 'No email'}</td>
                    <td className="join-date">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                    </td>
                    <td className="status">
                      <span className={`status-badge ${(user.status || '').toLowerCase()}`}>
                        {user.status || 'Unknown'}
                      </span>
                    </td>
                    <td className="actions">
                      <button
                        className="action-btn edit"
                        onClick={() => openModal(user, 'edit')}
                        title="Edit User"
                      >
                        <FaUserEdit />
                      </button>
                      <button
                        className="action-btn status"
                        onClick={() => handleStatusChange(user._id, user.status === 'Active' ? 'Blocked' : 'Active')}
                        title={user.status === 'Active' ? 'Block User' : 'Activate User'}
                      >
                        {user.status === 'Active' ? <FaTimes /> : <FaCheck />}
                      </button>
                      <button
                        className="action-btn delete"
                        onClick={() => openModal(user, 'delete')}
                        title="Delete User"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-results">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            {modalAction === 'delete' ? (
              <div className="delete-confirmation">
                <h3>Delete User</h3>
                <p>Are you sure you want to delete {selectedUser.name}?</p>
                <p className="warning">This action cannot be undone.</p>
                <div className="modal-actions">
                  <button 
                    className="cancel-btn"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDeleteUser(selectedUser._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <div className="edit-user">
                <h3>Edit User</h3>
                <div className="user-details">
                  <div className="detail-group">
                    <label>Name:</label>
                    <p>{selectedUser.name}</p>
                  </div>
                  <div className="detail-group">
                    <label>Email:</label>
                    <p>{selectedUser.email}</p>
                  </div>
                  <div className="detail-group">
                    <label>Status:</label>
                    <select
                      value={selectedUser.status || 'Active'}
                      onChange={(e) => handleStatusChange(selectedUser._id, e.target.value)}
                    >
                      <option value="Active">Active</option>
                      <option value="Blocked">Blocked</option>
                    </select>
                  </div>
                </div>
                <div className="modal-actions">
                  <button 
                    className="cancel-btn"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
