import React, { useState, useEffect } from 'react';
import { categoryService } from '../../Services/categoryService';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';
import './CategoryList.css';

const CategoryList = ({ onEdit }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        name: '',
        code: ''
    });
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        category: null
    });

    const fetchCategories = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await categoryService.getAllCategories(
                filters.name,
                filters.code
            );
            
            if (response && response.success && Array.isArray(response.categories)) {
                setCategories(response.categories);
            } else {
                throw new Error('Invalid response format from API');
            }
        } catch (err) {
            setError('Failed to fetch categories');
            console.error('Error:', err);
            setCategories([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
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
        fetchCategories();
    };

    const handleEdit = (category) => {
        onEdit(category);
    };

    const handleDelete = async (category) => {
        setDeleteModal({
            isOpen: true,
            category: category
        });
    };

    const confirmDelete = async () => {
        try {
            const response = await categoryService.deleteCategory(deleteModal.category.id);
            if (response.success) {
                alert(response.message);
                fetchCategories();
            } else {
                throw new Error('Failed to delete category');
            }
        } catch (err) {
            console.error('Error deleting category:', err);
            setError('Failed to delete category');
        } finally {
            setDeleteModal({
                isOpen: false,
                category: null
            });
        }
    };

    const closeDeleteModal = () => {
        setDeleteModal({
            isOpen: false,
            category: null
        });
    };

    if (loading) return <div>Loading categories...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="category-list-container">
            <h2>Categories</h2>
            
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
                        placeholder="Enter category name"
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
                        placeholder="Enter category code"
                    />
                </div>
                <button type="submit">Apply Filters</button>
            </form>

            {/* Categories Table */}
            <div className="categories-table">
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
                        {categories && categories.length > 0 ? (
                            categories.map((category) => (
                                <tr key={category.id}>
                                    <td>{category.id}</td>
                                    <td>{category.name}</td>
                                    <td>{category.code}</td>
                                    <td>{category.description}</td>
                                    <td>{category.isActive ? 'Yes' : 'No'}</td>
                                    <td className="actions-cell">
                                        <button 
                                            className="action-button edit-button"
                                            onClick={() => handleEdit(category)}
                                            title="Edit"
                                        >
                                            ✎
                                        </button>
                                        <button 
                                            className="action-button delete-button"
                                            onClick={() => handleDelete(category)}
                                            title="Delete"
                                        >
                                            ×
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="no-data">No categories found</td>
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
                title="Delete Category"
                message={`Are you sure you want to delete the category "${deleteModal.category?.name}"?`}
            />
        </div>
    );
};

export default CategoryList; 