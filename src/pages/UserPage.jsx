import React, { useState, useEffect } from 'react';
import { userService } from '../Services/userService';
import ConfirmationModal from '../components/ConfirmationModal/ConfirmationModal';
import './UserPage.css';

const UserPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterName, setFilterName] = useState('');
    const [showRegisterForm, setShowRegisterForm] = useState(false);
    const [editingUserId, setEditingUserId] = useState(null);
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        user: null
    });
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        isActive: true
    });

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await userService.getAllUsers(filterName);
            console.log('Users API Response:', response); // Debug log
            
            // Check if response is an array, if not, try to get the users array from the response
            if (Array.isArray(response)) {
                setUsers(response);
            } else if (response && Array.isArray(response.users)) {
                setUsers(response.users);
            } else {
                throw new Error('Invalid response format from API');
            }
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('Failed to fetch users');
            setUsers([]); // Set empty array on error
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleFilterChange = (e) => {
        setFilterName(e.target.value);
    };

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        fetchUsers();
    };

    const handleEdit = async (user) => {
        try {
            const userData = await userService.getUserById(user.id);
            setFormData({
                fullName: userData.fullName,
                email: userData.email,
                password: '',
                confirmPassword: '',
                isActive: userData.isActive
            });
            setEditingUserId(user.id);
            setShowRegisterForm(true);
        } catch (err) {
            console.error('Error fetching user details:', err);
            setError('Failed to fetch user details');
        }
    };

    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        
        // Validate passwords match only if password is provided
        if (formData.password && formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await userService.registerUser({
                fullName: formData.fullName,
                email: formData.email,
                password: formData.password,
                isActive: formData.isActive
            });

            // Show success message
            alert(response);
            
            // Close form and reset data
            setShowRegisterForm(false);
            setEditingUserId(null);
            setFormData({
                fullName: '',
                email: '',
                password: '',
                confirmPassword: '',
                isActive: true
            });
            
            // Refresh the user list
            fetchUsers();
        } catch (err) {
            console.error('Error registering user:', err);
            setError(err.message || 'Failed to register user');
        }
    };

    const handleDelete = (user) => {
        console.log('Setting delete modal for user:', user); // Debug log
        setDeleteModal({
            isOpen: true,
            user: user
        });
    };

    const confirmDelete = async () => {
        try {
            if (!deleteModal.user || !deleteModal.user.id) {
                console.error('No user selected for deletion');
                setError('No user selected for deletion');
                return;
            }

            console.log('Confirming delete for user:', deleteModal.user); // Debug log
            const response = await userService.deleteUser(deleteModal.user.id);
            console.log('Delete response:', response); // Debug log
            
            // Show success message
            alert(response);
            // Refresh the user list
            fetchUsers();
        } catch (err) {
            console.error('Error deleting user:', err);
            setError(err.message || 'Failed to delete user. Please check if the API server is running.');
            // Don't close the modal on error
        } finally {
            closeDeleteModal();
        }
    };

    const closeDeleteModal = () => {
        console.log('Closing delete modal'); // Debug log
        setDeleteModal({
            isOpen: false,
            user: null
        });
    };

    return (
        <div className="user-page">
            <div className="page-header">
                <h1>Users</h1>
            </div>

            {/* Filter Form */}
            <form onSubmit={handleFilterSubmit} className="filter-form">
                <div className="filter-group">
                    <label htmlFor="name">Filter by Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={filterName}
                        onChange={handleFilterChange}
                        placeholder="Enter user name"
                    />
                </div>
                <button type="submit" className="filter-button">
                    Apply Filter
                </button>
                <button 
                    type="button" 
                    className="register-button"
                    onClick={() => setShowRegisterForm(true)}
                >
                    Register User
                </button>
            </form>

            {error && <div className="error-message">{error}</div>}

            {loading ? (
                <div className="loading">Loading users...</div>
            ) : users.length === 0 ? (
                <div className="no-data">No users found</div>
            ) : (
                <div className="users-table">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Full Name</th>
                                <th>Email</th>
                                <th>Is Active</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.fullName}</td>
                                    <td>{user.email}</td>
                                    <td>{user.isActive ? 'Yes' : 'No'}</td>
                                    <td className="actions-cell">
                                        <button 
                                            className="action-button edit-button"
                                            onClick={() => handleEdit(user)}
                                            title="Edit"
                                        >
                                            ✎
                                        </button>
                                        <button 
                                            className="action-button delete-button"
                                            onClick={() => handleDelete(user)}
                                            title="Delete"
                                        >
                                            ×
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Register User Modal */}
            {showRegisterForm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>{editingUserId ? 'Edit User' : 'Register New User'}</h2>
                            <button className="close-button" onClick={() => {
                                setShowRegisterForm(false);
                                setEditingUserId(null);
                            }}>&times;</button>
                        </div>
                        <form onSubmit={handleRegisterSubmit} className="register-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="fullName">Full Name:</label>
                                    <input
                                        type="text"
                                        id="fullName"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleFormChange}
                                        required
                                        placeholder="Enter full name"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email:</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleFormChange}
                                        required
                                        placeholder="Enter email"
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="password">Password:</label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleFormChange}
                                        required={!editingUserId}
                                        placeholder={editingUserId ? "Leave blank to keep current password" : "Enter password"}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="confirmPassword">Confirm Password:</label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleFormChange}
                                        required={!editingUserId}
                                        placeholder={editingUserId ? "Leave blank to keep current password" : "Confirm password"}
                                    />
                                </div>
                            </div>
                            <div className="form-group checkbox-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        name="isActive"
                                        checked={formData.isActive}
                                        onChange={handleFormChange}
                                    />
                                    Is Active
                                </label>
                            </div>
                            <div className="form-actions">
                                <button type="button" className="cancel-button" onClick={() => {
                                    setShowRegisterForm(false);
                                    setEditingUserId(null);
                                }}>
                                    Cancel
                                </button>
                                <button type="submit" className="submit-button">
                                    {editingUserId ? 'Update' : 'Register'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={closeDeleteModal}
                onConfirm={confirmDelete}
                title="Delete User"
                message={`Are you sure you want to delete user "${deleteModal.user?.fullName}"?`}
            />
        </div>
    );
};

export default UserPage; 