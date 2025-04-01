import React, { useState, useEffect } from 'react';
import { statusService } from '../../Services/statusService';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';
import './StatusList.css';

const StatusList = ({ onEdit }) => {
    const [statuses, setStatuses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        name: '',
        code: ''
    });
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        status: null
    });

    const fetchStatuses = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await statusService.getAllStatuses(
                filters.name,
                filters.code
            );
            
            if (response && response.success && Array.isArray(response.status)) {
                setStatuses(response.status);
            } else {
                throw new Error('Invalid response format from API');
            }
        } catch (err) {
            setError('Failed to fetch statuses');
            console.error('Error:', err);
            setStatuses([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatuses();
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        fetchStatuses();
    };

    const handleDelete = (status) => {
        setDeleteModal({
            isOpen: true,
            status: status
        });
    };

    const confirmDelete = async () => {
        try {
            const response = await statusService.deleteStatus(deleteModal.status.id);
            if (response.success) {
                alert(response.message);
                fetchStatuses(); // Refresh the list
            } else {
                throw new Error('Failed to delete status');
            }
        } catch (err) {
            console.error('Error deleting status:', err);
            setError('Failed to delete status');
        } finally {
            closeDeleteModal();
        }
    };

    const closeDeleteModal = () => {
        setDeleteModal({
            isOpen: false,
            status: null
        });
    };

    if (loading) return <div className="loading">Loading statuses...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="status-list-container">
            <h2>Statuses</h2>
            
            {/* Filter Form */}
            <form onSubmit={handleFilterSubmit} className="filter-form">
                <div className="filter-group">
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={filters.name}
                        onChange={handleFilterChange}
                        placeholder="Enter status name"
                    />
                </div>
                <div className="filter-group">
                    <label htmlFor="code">Code:</label>
                    <input
                        type="text"
                        id="code"
                        name="code"
                        value={filters.code}
                        onChange={handleFilterChange}
                        placeholder="Enter status code"
                    />
                </div>
                <button type="submit" className="filter-button">
                    Apply Filters
                </button>
            </form>

            {/* Statuses Table */}
            <div className="statuses-table">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Code</th>
                            <th>Description</th>
                            <th>Is Active</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {statuses && statuses.length > 0 ? (
                            statuses.map((status) => (
                                <tr key={status.id}>
                                    <td>{status.id}</td>
                                    <td>{status.name}</td>
                                    <td>{status.code}</td>
                                    <td>{status.description}</td>
                                    <td>{status.isActive ? 'Yes' : 'No'}</td>
                                    <td className="actions-cell">
                                        <button 
                                            className="action-button edit-button"
                                            onClick={() => onEdit(status)}
                                            title="Edit"
                                        >
                                            ✎
                                        </button>
                                        <button 
                                            className="action-button delete-button"
                                            onClick={() => handleDelete(status)}
                                            title="Delete"
                                        >
                                            ×
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="no-data">No statuses found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={closeDeleteModal}
                onConfirm={confirmDelete}
                title="Delete Status"
                message={`Are you sure you want to delete the status "${deleteModal.status?.name}"?`}
            />
        </div>
    );
};

export default StatusList; 