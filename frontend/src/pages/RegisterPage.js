import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register, login } from "../services/authService";

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegistration = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // Inscription de l'utilisateur
            await register(username, email, password);

            // Connexion automatique après l'inscription
            const loginResponse = await login(email, password);

            if (loginResponse.token) {
                navigate('/dashboard'); // Redirection vers la page après connexion (à adapter)
            } else {
                setError("Échec de la connexion après l'inscription.");
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="register-page">
            <h2>Registration</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleRegistration}>
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        id="username"
                        type="text"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="form-input"
                    />
                </div>
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
                <button type="submit" className="submit-button">Register</button>
            </form>
        </div>
    );
};

export default RegisterPage;
