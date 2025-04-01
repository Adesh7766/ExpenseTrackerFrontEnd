import React, { useState } from 'react';
import CategoryList from '../components/CategoryList/CategoryList';
import CreateCategoryForm from '../components/CreateCategoryForm/CreateCategoryForm';
import './CategoriesPage.css';

const CategoriesPage = () => {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    const handleCreateSuccess = () => {
        // Refresh the categories list
        window.location.reload();
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setShowCreateForm(true);
    };

    const handleFormClose = () => {
        setShowCreateForm(false);
        setEditingCategory(null);
    };

    return (
        <div className="categories-page">
            <div className="page-header">
                <h1>Categories</h1>
                <button 
                    className="create-button"
                    onClick={() => setShowCreateForm(true)}
                >
                    Create Category
                </button>
            </div>

            <CategoryList onEdit={handleEdit} />

            {showCreateForm && (
                <CreateCategoryForm
                    onClose={handleFormClose}
                    onSuccess={handleCreateSuccess}
                    categoryId={editingCategory?.id}
                    initialData={editingCategory}
                />
            )}
        </div>
    );
};

export default CategoriesPage; 