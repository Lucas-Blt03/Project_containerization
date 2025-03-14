import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import { decodeToken, getToken } from './services/authService';

const getDashboardRoute = () => {
    const token = getToken();
    if (!token) return '/';

    const user = decodeToken();
    return user?.role === 'user'
        ? '/user-dashboard'
        : user?.role === 'organizer'
            ? '/organizer-dashboard'
            : user?.role === 'admin'
                ? '/admin-dashboard'
                : '/dashboard';
};

const ProtectedRoute = ({ element }) => {
    return getToken() ? element : <Navigate to="/" />;
};

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
                <Route path="*" element={<Navigate to={getDashboardRoute()} />} />
            </Routes>
        </Router>
    );
};

export default App;
