const API_BASE_URL = 'https://localhost:7122/api';

export const categoryService = {
    // Get all categories with optional filters
    getAllCategories: async (name, code) => {
        try {
            const queryParams = new URLSearchParams({
                name: name || '',
                code: code || ''
            });

            const response = await fetch(`${API_BASE_URL}/Category/GetAllCategory?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch categories');
            }
            const data = await response.json();
            
            // Return the categories array from the response
            return {
                success: data.success,
                categories: data.category // Map the 'category' array to 'categories'
            };
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    },

    // Get a single category by ID
    getCategoryById: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/Category/GetCategoryById?id=${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch category');
            }
            const data = await response.json();
            return data.category; // Return the category object
        } catch (error) {
            console.error('Error fetching category:', error);
            throw error;
        }
    },

    // Save category (create or update)
    saveCategory: async (categoryData) => {
        try {
            console.log('Saving category with data:', categoryData); // Debug log

            const response = await fetch(`${API_BASE_URL}/Category/RegisterCategory`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: categoryData.id || 0,
                    name: categoryData.name,
                    code: categoryData.code,
                    description: categoryData.description,
                    isActive: categoryData.isActive
                })
            });

            console.log('Response status:', response.status); // Debug log

            if (!response.ok) {
                throw new Error('Failed to save category');
            }

            // Read the response text
            const responseText = await response.text();
            console.log('Response text:', responseText); // Debug log

            return {
                success: true,
                message: responseText
            };
        } catch (error) {
            console.error('Error saving category:', error);
            throw error;
        }
    },

    // Delete a category
    deleteCategory: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/Category/DeleteCategory?id=${id}`, {
                method: 'GET'
            });

            if (!response.ok) {
                throw new Error('Failed to delete category');
            }

            // Read the response text which is the message
            const message = await response.text();
            return {
                success: true,
                message: message
            };
        } catch (error) {
            console.error('Error deleting category:', error);
            throw error;
        }
    }
}; 