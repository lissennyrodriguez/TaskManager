
const express = require('express');

const authController = require('../controllers/auth.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

const router = express.Router();

// Rutas públicas: no requieren iniciar sesión
router.post('/register', authController.register);
router.post('/login', authController.login);

// Ruta protegida
router.get('/me', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
