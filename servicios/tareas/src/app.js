
const express = require('express');
const cors = require('cors');

const taskRoutes = require('./routes/task.routes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta de salud
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'tasks-service',
    message: 'Microservicio de tareas funcionando',
  });
});

// Rutas de tareas
app.use('/api/tasks', taskRoutes);

// Manejo de rutas inexistentes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.message);

  res.status(err.status || 500).json({
    success: false,
    message: err.status ? err.message : 'Error interno del servidor',
  });
});

module.exports = app;
