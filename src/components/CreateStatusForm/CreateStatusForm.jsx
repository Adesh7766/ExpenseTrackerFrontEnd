import React, { useState, useEffect } from 'react';
import { statusService } from '../../Services/statusService';
import './CreateStatusForm.css';

const CreateStatusForm = ({ onClose, onSuccess, initialData }) => {
    const [formData, setFormData] = useState({
        id: 0,
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
            setFormData({
                id: initialData.id || 0,
                name: initialData.name || '',
                code: initialData.code || '',
                description: initialData.description || '',
                isActive: initialData.isActive ?? true
            });
            setIsEditing(true);
        }
    }, [initialData]);

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
            const response = await statusService.registerStatus(formData);
            if (response && response.success) {
                alert(response.message);
                onSuccess();
                onClose();
            } else {
                throw new Error('Failed to save status');
            }
        } catch (err) {
            setError('Failed to save status. Please try again.');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>{isEditing ? 'Edit Status' : 'Create New Status'}</h2>
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
                            {loading ? 'Saving...' : isEditing ? 'Update Status' : 'Create Status'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateStatusForm; 