const API_URL = 'https://localhost:7122/api';

export const statusService = {
    getAllStatuses: async (name = '', code = '') => {
        try {
            const response = await fetch(`${API_URL}/Status/GetAllStatus?name=${name}&code=${code}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching statuses:', error);
            throw error;
        }
    },

    registerStatus: async (statusData) => {
        try {
            const response = await fetch(`${API_URL}/Status/RegisterStatus`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(statusData)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const message = await response.text();
            return { success: true, message };
        } catch (error) {
            console.error('Error registering status:', error);
            throw error;
        }
    },

    deleteStatus: async (id) => {
        try {
            const response = await fetch(`${API_URL}/Status/DeleteStatus?id=${id}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const message = await response.text();
            return { success: true, message };
        } catch (error) {
            console.error('Error deleting status:', error);
            throw error;
        }
    }
}; 