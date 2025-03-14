import axios from 'axios';

const API_URL = 'http://localhost:5000';

/**
 * Login the user and store the JWT token in localStorage.
 * @param {string} email - The email of the user.
 * @param {string} password - The password of the user.
 * @returns {Promise<object>} - The response data including the token.
 */
export const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { email, password });

        if (response.data?.token) {
            localStorage.setItem('token', response.data.token);
        }

        return response.data;
    } catch (err) {
        console.error('Login error:', err.message);
        throw new Error(err.response?.data?.error || 'Failed to login. Please try again.');
    }
};

export const register = async (username,email, password) => {
    try {
        const response = await axios.post(`${API_URL}/register`, { username,email, password });
        return response.data;

    } catch (err) {
        console.error('Register error:', err.message);
        throw new Error(err.response?.data?.error || 'Failed to register. Please try again.');
    }
};

/**
 * Logout the user and remove the JWT token from localStorage.
 */
export const logout = () => {
    localStorage.removeItem('token');
};

/**
 * Get the JWT token from localStorage.
 * @returns {string | null} - The token if available, otherwise null.
 */
export const getToken = () => {
    return localStorage.getItem('token');
};

/**
 * Decode the JWT token to extract user information.
 * @returns {object | null} - The decoded token payload or null if invalid.
 */
export const decodeToken = () => {
    const token = getToken();
    if (!token) return null;

    try {
        const base64Payload = token.split('.')[1];
        if (!base64Payload) throw new Error("Invalid token format");

        const payload = JSON.parse(atob(base64Payload));
        return payload;
    } catch (err) {
        console.error('Invalid token:', err.message);
        return null;
    }
};
