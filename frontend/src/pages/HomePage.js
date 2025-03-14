import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="home-page">
            <h1>Bienvenue sur notre plateforme</h1>
            <p>Connectez-vous ou inscrivez-vous pour accéder à votre espace.</p>
            <div className="buttons">
                <button onClick={() => navigate('/login')}>Se Connecter</button>
                <button onClick={() => navigate('/register')}>S'inscrire</button>
            </div>
        </div>
    );
};

export default HomePage;
