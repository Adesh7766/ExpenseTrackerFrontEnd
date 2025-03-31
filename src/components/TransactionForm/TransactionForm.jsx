import React, { useState, useEffect } from 'react';
import { transactionService } from '../../Services/transactionService';
import './TransactionForm.css';

const TransactionForm = () => {
    // State to manage form data
    const [formData, setFormData] = useState({
        amount: '',
        description: '',
        category: '',
        type: 'expense', // 'expense' or 'income'
        date: new Date().toISOString().split('T')[0] // Current date as default
    });

    // Add validation state
    const [errors, setErrors] = useState({});
    
    // Add loading state
    const [isLoading, setIsLoading] = useState(false);
    
    // Add categories state
    const [categories, setCategories] = useState([]);

    // Fetch categories on component mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await transactionService.getCategories();
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
                alert('Failed to load categories. Please try again later.');
            }
        };
        fetchCategories();
    }, []);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};
        if (!formData.amount || formData.amount <= 0) {
            newErrors.amount = 'Please enter a valid amount';
        }
        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        }
        if (!formData.category) {
            newErrors.category = 'Please select a category';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        try {
            await transactionService.addTransaction(formData);
            
            // Clear form after successful submission
            setFormData({
                amount: '',
                description: '',
                category: '',
                type: 'expense',
                date: new Date().toISOString().split('T')[0]
            });
            
            // Add success message
            alert('Transaction added successfully!');
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to add transaction. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="transaction-form-container">
            <h2>Add New Transaction</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="type">Type</label>
                    <select 
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                    >
                        <option value="expense">Expense</option>
                        <option value="income">Income</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="amount">Amount</label>
                    <input
                        type="number"
                        id="amount"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        required
                        className={errors.amount ? 'error' : ''}
                    />
                    {errors.amount && <span className="error-message">{errors.amount}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <input
                        type="text"
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        className={errors.description ? 'error' : ''}
                    />
                    {errors.description && <span className="error-message">{errors.description}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                        className={errors.category ? 'error' : ''}
                    >
                        <option value="">Select Category</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    {errors.category && <span className="error-message">{errors.category}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="date">Date</label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Adding...' : 'Add Transaction'}
                </button>
            </form>
        </div>
    );
};

export default TransactionForm;
