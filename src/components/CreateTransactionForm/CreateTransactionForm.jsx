import React, { useState, useEffect } from 'react';
import { transactionService } from '../../Services/transactionService';
import { userService } from '../../Services/userService';
import { statusService } from '../../Services/statusService';
import { categoryService } from '../../Services/categoryService';
import './CreateTransactionForm.css';

const CreateTransactionForm = ({ onClose, onSuccess, transactionId }) => {
    const [formData, setFormData] = useState({
        createdBy: '',
        status: '',
        amount: '',
        description: '',
        category: '',
        isActive: true
    });
    const [users, setUsers] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchUsers();
        fetchStatuses();
        fetchCategories();
        if (transactionId) {
            fetchTransaction();
        }
    }, [transactionId]);

    const fetchUsers = async () => {
        try {
            const response = await userService.getAllUsers('');
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
        }
    };

    const fetchStatuses = async () => {
        try {
            const response = await statusService.getAllStatuses('', '');
            if (response && response.success && Array.isArray(response.status)) {
                setStatuses(response.status);
            } else {
                throw new Error('Invalid response format from API');
            }
        } catch (err) {
            console.error('Error fetching statuses:', err);
            setError('Failed to fetch statuses');
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await categoryService.getAllCategories('', '');
            if (response && response.success && Array.isArray(response.categories)) {
                setCategories(response.categories);
            } else {
                throw new Error('Invalid response format from API');
            }
        } catch (err) {
            console.error('Error fetching categories:', err);
            setError('Failed to fetch categories');
        }
    };

    const fetchTransaction = async () => {
        try {
            setLoading(true);
            const transaction = await transactionService.getTransactionById(transactionId);
            setFormData({
                createdBy: transaction.createdBy,
                status: transaction.status,
                amount: transaction.amount,
                description: transaction.description,
                category: transaction.category,
                isActive: transaction.isActive
            });
            setIsEditing(true);
        } catch (err) {
            setError('Failed to fetch transaction details');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response = await transactionService.createTransaction(formData);
            if (response && response.success) {
                onSuccess();
                onClose();
            } else {
                throw new Error('Failed to create transaction');
            }
        } catch (err) {
            setError('Failed to create transaction. Please try again.');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>{isEditing ? 'Edit Transaction' : 'Create New Transaction'}</h2>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>
                
                {error && <div className="error-message">{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="createdBy">Created By:</label>
                        <select
                            id="createdBy"
                            name="createdBy"
                            value={formData.createdBy}
                            onChange={handleChange}
                            required
                            className="form-select"
                        >
                            <option value="">Select a user</option>
                            {users.map(user => (
                                <option key={user.id} value={user.fullName}>
                                    {user.fullName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="status">Status:</label>
                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            required
                            className="form-select"
                        >
                            <option value="">Select a status</option>
                            {statuses.map(status => (
                                <option key={status.id} value={status.code}>
                                    {status.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="amount">Amount:</label>
                        <input
                            type="number"
                            id="amount"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            required
                            min="0"
                            step="0.01"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description:</label>
                        <input
                            type="text"
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="category">Category:</label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            className="form-select"
                        >
                            <option value="">Select a category</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.code}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group checkbox-group">
                        <label>
                            <input
                                type="checkbox"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleChange}
                            />
                            Is Active
                        </label>
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={onClose} className="cancel-button">
                            Cancel
                        </button>
                        <button type="submit" className="submit-button" disabled={loading}>
                            {loading ? 'Saving...' : isEditing ? 'Update Transaction' : 'Create Transaction'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTransactionForm; 