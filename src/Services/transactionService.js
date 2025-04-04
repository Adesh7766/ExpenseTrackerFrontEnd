const API_BASE_URL = 'https://localhost:7122/api'; // Updated API base URL

export const transactionService = {
    // Get all transactions with query parameters
    getAllTransactions: async (name, statusCode, categoryCode) => {
        try {
            const queryParams = new URLSearchParams({
                name: name || '',
                statusCode: statusCode || '',
                categoryCode: categoryCode || ''
            });

            const response = await fetch(`${API_BASE_URL}/Transactions/GetAllTransactions?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch transactions');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching transactions:', error);
            throw error;
        }
    },

    // Add a new transaction
    addTransaction: async (transactionData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/transactions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(transactionData),
            });
            
            if (!response.ok) {
                throw new Error('Failed to add transaction');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error adding transaction:', error);
            throw error;
        }
    },

    // Get categories
    getCategories: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/categories`);
            if (!response.ok) {
                throw new Error('Failed to fetch categories');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    },

    createTransaction: async (transactionData) => {
        try {
            const response = await fetch('https://localhost:7122/api/Transactions/CreateTransaction', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(transactionData)
            });

            if (!response.ok) {
                throw new Error('Failed to create transaction');
            }

            // Read the response text first
            const responseText = await response.text();
            
            // Try to parse as JSON if possible
            try {
                return JSON.parse(responseText);
            } catch (e) {
                // If it's not JSON, return success with the text message
                return {
                    success: true,
                    message: responseText
                };
            }
        } catch (error) {
            console.error('Error creating transaction:', error);
            throw error;
        }
    },

    getTransactionById: async (id) => {
        try {
            const response = await fetch(`https://localhost:7122/api/Transactions/GetTransactionById?id=${id}`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch transaction');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching transaction:', error);
            throw error;
        }
    },

    deleteTransaction: async (id) => {
        try {
            const response = await fetch(`https://localhost:7122/api/Transactions/DeleteTransaction?id=${id}`, {
                method: 'GET'
            });

            if (!response.ok) {
                throw new Error('Failed to delete transaction');
            }

            // Read the response text
            const responseText = await response.text();
            return {
                success: true,
                message: responseText
            };
        } catch (error) {
            console.error('Error deleting transaction:', error);
            throw error;
        }
    },

    getTransactionsByCategory: async () => {
        try {
            const response = await fetch('https://localhost:7122/api/Transactions/GetTransactionByCategory');
            if (!response.ok) {
                throw new Error('Failed to fetch transactions by category');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching transactions by category:', error);
            throw error;
        }
    }
}; 