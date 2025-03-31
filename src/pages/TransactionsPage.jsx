import React, { useState, useEffect } from 'react';
import { transactionService } from '../Services/transactionService';
import CreateTransactionForm from '../components/CreateTransactionForm/CreateTransactionForm';
import './TransactionsPage.css';

const TransactionsPage = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingTransactionId, setEditingTransactionId] = useState(null);
    const [filters, setFilters] = useState({
        name: '',
        statusCode: '',
        categoryCode: ''
    });

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const response = await transactionService.getAllTransactions(
                filters.name,
                filters.statusCode,
                filters.categoryCode
            );
            console.log('API Response:', response);
            
            if (response && response.success && Array.isArray(response.transactions)) {
                setTransactions(response.transactions);
            } else {
                throw new Error('Invalid response format');
            }
        } catch (err) {
            console.error('Error fetching transactions:', err);
            setError('Failed to fetch transactions. Please try again.');
            setTransactions([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
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
        fetchTransactions();
    };

    const handleCreateSuccess = () => {
        fetchTransactions();
    };

    const handleEdit = (transaction) => {
        setEditingTransactionId(transaction.id);
        setShowCreateForm(true);
    };

    const handleFormClose = () => {
        setShowCreateForm(false);
        setEditingTransactionId(null);
    };

    const handleDelete = async (transaction) => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            try {
                const response = await transactionService.deleteTransaction(transaction.id);
                if (response.success) {
                    // Show success message
                    alert(response.message);
                    // Refresh the transactions list
                    fetchTransactions();
                } else {
                    throw new Error('Failed to delete transaction');
                }
            } catch (error) {
                console.error('Error deleting transaction:', error);
                setError('Failed to delete transaction');
            }
        }
    };

    return (
        <div className="transactions-page">
            <div className="page-header">
                <h1>Transactions</h1>
                <button 
                    className="create-button"
                    onClick={() => setShowCreateForm(true)}
                >
                    Create Transaction
                </button>
            </div>

            <div className="filter-section">
                <form className="filter-form" onSubmit={handleFilterSubmit}>
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
            </div>

            {error && <div className="error">{error}</div>}

            {loading ? (
                <div className="loading">Loading transactions...</div>
            ) : transactions.length === 0 ? (
                <div className="no-data">No transactions found</div>
            ) : (
                <div className="transactions-table">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Status</th>
                                <th>Category</th>
                                <th>Created By</th>
                                <th>Created Date</th>
                                <th>Amount</th>
                                <th>Is Active</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((transaction) => (
                                <tr key={transaction.id}>
                                    <td>{transaction.id}</td>
                                    <td>{transaction.status}</td>
                                    <td>{transaction.category}</td>
                                    <td>{transaction.createdBy}</td>
                                    <td>{new Date(transaction.createdDate).toLocaleDateString()}</td>
                                    <td>${transaction.amount}</td>
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
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showCreateForm && (
                <CreateTransactionForm
                    onClose={handleFormClose}
                    onSuccess={handleCreateSuccess}
                    transactionId={editingTransactionId}
                />
            )}
        </div>
    );
};

export default TransactionsPage; 