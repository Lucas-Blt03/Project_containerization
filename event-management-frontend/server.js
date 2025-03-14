const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

// Servir les fichiers statiques
app.use(express.static('public'));

// Configurer les proxys
app.use('/api/auth', createProxyMiddleware({
  target: 'http://backend-auth:5000',
  changeOrigin: true,
  pathRewrite: {'^/api/auth': ''}
}));

app.use('/api/events', createProxyMiddleware({
  target: 'http://backend-events:8000',
  changeOrigin: true,
  pathRewrite: {'^/api/events': ''}
}));

// Gérer toutes les autres routes
app.get('*', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.listen(80, () => console.log('Server running on port 80'));