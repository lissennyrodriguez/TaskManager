
const express = require('express');
const { authenticateToken } = require('../middlewares/auth.middleware');
const userController = require('../controllers/user.controller');

const router = express.Router();

router.use(authenticateToken);

// Empleados disponibles para asignar tareas
router.get('/assignable', userController.getAssignableUsers);

// Administración de usuarios
router.get('/', userController.getUsers);

// Cambiar roles
router.patch('/:id/role', userController.changeRole);

module.exports = router;

