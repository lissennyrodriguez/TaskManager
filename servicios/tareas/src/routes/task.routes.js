

const express = require('express');
const router = express.Router();

const taskController = require('../controllers/task.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

// Obtener todas las tareas
router.get('/', authenticateToken, taskController.listTasks);

// Obtener una tarea por ID
router.get('/:id', authenticateToken, taskController.getTask);

// Crear una nueva tarea
router.post('/', authenticateToken, taskController.createTask);

// Actualizar una tarea existente
router.put('/:id', authenticateToken, taskController.updateTask);

// Eliminar una tarea existente
router.delete('/:id', authenticateToken, taskController.deleteTask);

module.exports = router;
