import React, { useState, useEffect } from 'react';
import { categoryService } from '../../Services/categoryService';
import './CreateCategoryForm.css';

const CreateCategoryForm = ({ onClose, onSuccess, categoryId, initialData }) => {
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        description: '',
        isActive: true
    });

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
            setIsEditing(true);
        } else if (categoryId) {
            fetchCategory();
        }
    }, [categoryId, initialData]);

    const fetchCategory = async () => {
        try {
            setLoading(true);
            const response = await categoryService.getCategoryById(categoryId);
            // Directly use the response data as it matches our form structure
            setFormData({
                name: response.name,
                code: response.code,
                description: response.description,
                isActive: response.isActive
            });
            setIsEditing(true);
        } catch (err) {
            setError('Failed to fetch category details');
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
            const categoryToSave = {
                ...formData,
                id: isEditing ? initialData.id : 0
            };

            console.log('Submitting category:', categoryToSave); // Debug log

            const response = await categoryService.saveCategory(categoryToSave);
            console.log('Save response:', response); // Debug log

            if (response && response.success) {
                // Show success message if provided
                if (response.message) {
                    alert(response.message);
                }
                onSuccess();
                onClose();
            } else {
                throw new Error('Failed to save category');
            }
        } catch (err) {
            const errorMessage = err.message || 'Failed to save category. Please try again.';
            setError(errorMessage);
            console.error('Error in handleSubmit:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="modal-overlay">
                <div className="modal-content">
                    <div>Loading...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>{isEditing ? 'Edit Category' : 'Create New Category'}</h2>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>
                
                {error && <div className="error-message">{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Name:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="code">Code:</label>
                        <input
                            type="text"
                            id="code"
                            name="code"
                            value={formData.code}
                            onChange={handleChange}
                            required
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
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCategoryForm; 