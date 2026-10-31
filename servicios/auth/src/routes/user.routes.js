const express = require('express');

const {
  getUsers,
  changeUserRole,
} = require('../controllers/user.controller');

const {
  authenticateToken,
} = require('../middlewares/auth.middleware');

const router = express.Router();

// Consultar usuarios registrados
router.get('/', authenticateToken, getUsers);

// Cambiar el rol de un usuario
router.patch('/:id/role', authenticateToken, changeUserRole);

module.exports = router;