
const express = require('express');
const cors = require('cors');

const taskRoutes = require('./routes/task.routes');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');

const {
  notFound,
  errorHandler,
} = require('./middlewares/error.middleware');

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
}));

app.use(express.json({ limit: '1mb' }));

// Ruta principal
app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenido a TaskManager API',
    status: 'ok',
  });
});

// Estado de la API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    application: 'TaskManager API',
  });
});

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

// Manejo de errores
app.use(notFound);
app.use(errorHandler);

module.exports = app;
