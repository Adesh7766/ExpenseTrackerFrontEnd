import React, { useState } from 'react';
import StatusList from '../components/StatusList/StatusList';
import CreateStatusForm from '../components/CreateStatusForm/CreateStatusForm';
import './StatusesPage.css';

const StatusesPage = () => {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingStatus, setEditingStatus] = useState(null);

    const handleCreateSuccess = () => {
        setShowCreateForm(false);
    };

    const handleEdit = (status) => {
        setEditingStatus(status);
        setShowCreateForm(true);
    };

    const handleFormClose = () => {
        setShowCreateForm(false);
        setEditingStatus(null);
    };

    return (
        <div className="statuses-page">
            <div className="page-header">
                <h1>Statuses</h1>
                <button 
                    className="create-button"
                    onClick={() => setShowCreateForm(true)}
                >
                    Create Status
                </button>
            </div>

            <StatusList onEdit={handleEdit} />

            {showCreateForm && (
                <CreateStatusForm
                    onClose={handleFormClose}
                    onSuccess={handleCreateSuccess}
                    initialData={editingStatus}
                />
            )}
        </div>
    );
};

export default StatusesPage; 