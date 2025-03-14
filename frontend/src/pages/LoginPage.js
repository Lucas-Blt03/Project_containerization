import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, decodeToken } from '../services/authService'; // Utilise l'export nommé


const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const roleRedirects = {
                user: '/user-dashboard',
                organizer: '/organizer-dashboard',
                admin: '/admin-dashboard',
            };
            const { token } = await login(email, password);

            if (token) {
                localStorage.setItem('token', token);
                const user = decodeToken(); // Décode le token pour récupérer les infos utilisateur
                navigate(roleRedirects[user?.role] || '/dashboard');
                navigate('/dashboard')
            }

        } catch (err) {
            console.error('Login error:', err.message);
            setError('Invalid credentials. Please try again.');
        }
    };

    return (
        <div className="login-page">
            <h2>Login</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleLogin}>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="form-input"
                    />
                </div>
                <button type="submit" className="submit-button">Login</button>
            </form>
        </div>
    );
};

export default LoginPage;