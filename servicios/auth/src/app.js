
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');

const app = express();

app.use(cors());
app.use(express.json());

// Verificar que el servicio funciona
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'auth-service',
    message: 'Microservicio de autenticación funcionando',
  });
});

// Rutas de autenticación
app.use('/api/auth', authRoutes);

// Rutas de usuarios
app.use('/api/users', userRoutes);

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    message: 'Error interno del servidor',
  });
});

module.exports = app;
