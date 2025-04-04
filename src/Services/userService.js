const API_BASE_URL = 'https://localhost:7122/api';

export const userService = {
    getAllUsers: async (name = '') => {
        try {
            const response = await fetch(`${API_BASE_URL}/User/GetAllUsers?name=${encodeURIComponent(name)}`);
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    },

    getUserById: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/User/GetUserById?id=${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch user details');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching user details:', error);
            throw error;
        }
    },

    registerUser: async (userData) => {
        try {
            const response = await fetch('https://localhost:7122/api/Users/RegisterUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                throw new Error('Failed to register user');
            }

            // First try to read the response as text
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
            console.error('Error registering user:', error);
            throw error;
        }
    },

    deleteUser: async (userId) => {
        try {
            console.log('Sending delete request for user ID:', userId); // Debug log
            const response = await fetch(`${API_BASE_URL}/User/DeleteUser?id=${userId}`);
            if (!response.ok) {
                throw new Error(`Failed to delete user: ${response.status} ${response.statusText}`);
            }
            const data = await response.text();
            console.log('Delete API Response:', data); // Debug log
            return data;
        } catch (error) {
            console.error('Error deleting user:', error);
            throw new Error(`Failed to delete user: ${error.message}`);
        }
    }
}; 