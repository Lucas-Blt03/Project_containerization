/**
 * Vérifie si l'utilisateur est authentifié.
 * @returns {boolean} - Retourne true si le token existe et est valide, sinon false.
 */
export const isAuthenticated = () => {
    const user = decodeToken();
    if (!user || !user.exp) return false;

    const now = Math.floor(Date.now() / 1000);
    return user.exp > now;
};


/**
 * Décodage du token JWT pour extraire les informations utilisateur.
 * @returns {object | null} - Les données décodées du token ou null si le token est invalide.
 */
export const decodeToken = () => {
    const token = localStorage.getItem('token');

    if (!token) return null;

    try {
        const payload = JSON.parse(atob(token.split('.')[1])); // Décodage du payload du JWT
        return payload;
    } catch (err) {
        console.error('Invalid token:', err.message);
        return null;
    }
};