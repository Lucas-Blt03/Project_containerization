const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pool = require('./db');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());

const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey"; // Ajout d'une valeur par défaut
const expiresIn = '1h';

function createToken(payload) {
    return jwt.sign(payload, SECRET_KEY, { expiresIn });
}

function verifyToken(req, res, next) {
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Invalid authorization format' });
    }

    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        console.log("Token vérifié pour", req.user.email);
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}


function verifyRole(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Accès interdit' });
        }
        next();
    };
}

app.post('/register', async (req, res) => {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Tous les champs sont obligatoires' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const allowedRoles = ['user', 'organizer'];
    const userRole = allowedRoles.includes(role) ? role : 'user';

    try {
        const result = await pool.query(
            'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, username, email, role',
            [username, email, hashedPassword, userRole]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = createToken({ id: user.id, email: user.email, role: user.role });
        res.json({ token });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/protected', verifyToken, (req, res) => {
    console.log("Requête reçue sur /protected pour", req.user.email);

    setTimeout(() => {
        console.log("Réponse envoyée pour", req.user.email);
        res.json({ message: `Bienvenue, ${req.user.email}` });
    }, 2000);
});

app.get('/admin', verifyToken, verifyRole('moderator'), (req, res) => {
    res.json({ message: `Bienvenue, modérateur ${req.user.email}` });
});

app.get('/organizer', verifyToken, verifyRole('organizer'), (req, res) => {
    res.json({ message: `Bienvenue, organisateur ${req.user.email}` });
});

app.use(/^(?!\/auth).*$/, verifyToken);

app.listen(5000, () => console.log('Auth service running on port 5000'));
