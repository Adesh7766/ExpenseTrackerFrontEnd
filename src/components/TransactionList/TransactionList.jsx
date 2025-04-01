import React, { useState, useEffect } from 'react';
import { transactionService } from '../../Services/transactionService';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';
import './TransactionList.css';

const TransactionList = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        name: '',
        statusCode: '',
        categoryCode: ''
    });
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        transaction: null
    });

    const fetchTransactions = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await transactionService.getAllTransactions(
                filters.name,
                filters.statusCode,
                filters.categoryCode
            );
            
            // Debug the response
            console.log('API Response:', response);
            
            // Check if response has the expected structure
            if (response && response.success && Array.isArray(response.transactions)) {
                setTransactions(response.transactions);
            } else {
                throw new Error('Invalid response format from API');
            }
        } catch (err) {
            setError('Failed to fetch transactions');
            console.error('Error:', err);
            setTransactions([]); // Reset transactions on error
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []); // Fetch on component mount

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        fetchTransactions();
    };

    const handleDelete = (transaction) => {
        setDeleteModal({
            isOpen: true,
            transaction: transaction
        });
    };

    const confirmDelete = async () => {
        try {
            const response = await transactionService.deleteTransaction(deleteModal.transaction.id);
            if (response.success) {
                alert(response.message);
                fetchTransactions();
            } else {
                throw new Error('Failed to delete transaction');
            }
        } catch (err) {
            console.error('Error deleting transaction:', err);
            setError('Failed to delete transaction');
        } finally {
            setDeleteModal({
                isOpen: false,
                transaction: null
            });
        }
    };

    const closeDeleteModal = () => {
        setDeleteModal({
            isOpen: false,
            transaction: null
        });
    };

    if (loading) return <div>Loading transactions...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="transaction-list-container">
            <h2>Transactions</h2>
            
            {/* Filter Form */}
            <form onSubmit={handleFilterSubmit} className="filter-form">
                <div className="filter-group">
                    <label htmlFor="name">Transacted By:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={filters.name}
                        onChange={handleFilterChange}
                        placeholder="Filter by transaction creator"
                    />
                </div>
                <div className="filter-group">
                    <label htmlFor="statusCode">Status:</label>
                    <input
                        type="text"
                        id="statusCode"
                        name="statusCode"
                        value={filters.statusCode}
                        onChange={handleFilterChange}
                        placeholder="e.g., PEND"
                    />
                </div>
                <div className="filter-group">
                    <label htmlFor="categoryCode">Category:</label>
                    <input
                        type="text"
                        id="categoryCode"
                        name="categoryCode"
                        value={filters.categoryCode}
                        onChange={handleFilterChange}
                        placeholder="e.g., FOOD"
                    />
                </div>
                <button type="submit" className="filter-button">
                    Apply Filters
                </button>
            </form>

            {/* Transactions Table */}
            <div className="transactions-table">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Description</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Category</th>
                            <th>Created By</th>
                            <th>Created Date</th>
                            <th>Is Active</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions && transactions.length > 0 ? (
                            transactions.map((transaction) => (
                                <tr key={transaction.id}>
                                    <td>{transaction.id}</td>
                                    <td>{transaction.description}</td>
                                    <td>${transaction.amount}</td>
                                    <td>{transaction.status}</td>
                                    <td>{transaction.category}</td>
                                    <td>{transaction.createdBy}</td>
                                    <td>{new Date(transaction.createdDate).toLocaleDateString()}</td>
                                    <td>{transaction.isActive ? 'Yes' : 'No'}</td>
                                    <td className="actions-cell">
                                        <button 
                                            className="action-button edit-button"
                                            onClick={() => handleEdit(transaction)}
                                            title="Edit"
                                        >
                                            ✎
                                        </button>
                                        <button 
                                            className="action-button delete-button"
                                            onClick={() => handleDelete(transaction)}
                                            title="Delete"
                                        >
                                            ×
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9" className="no-data">No transactions found</td>
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
                title="Delete Transaction"
                message={`Are you sure you want to delete the transaction "${deleteModal.transaction?.description}"?`}
            />
        </div>
    );
};

export default TransactionList; 