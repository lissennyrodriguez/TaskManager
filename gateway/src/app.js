
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
}));

// Verificar estado del API Gateway
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'api-gateway',
  });
});

// Redirigir autenticación a Auth Service
app.use(
  '/api/auth',
  createProxyMiddleware({
    target: 'http://localhost:3001',
    changeOrigin: true,
    pathRewrite: {
      '^/': '/api/auth/',
    },
  })
);

// Redirigir usuarios a Auth Service
app.use(
  '/api/users',
  createProxyMiddleware({
    target: 'http://localhost:3001',
    changeOrigin: true,
    pathRewrite: {
      '^/': '/api/users/',
    },
  })
);

// Redirigir tareas a Tasks Service
app.use(
  '/api/tasks',
  createProxyMiddleware({
    target: 'http://localhost:3002',
    changeOrigin: true,
    pathRewrite: {
      '^/': '/api/tasks/',
    },
  })
);

module.exports = app;
