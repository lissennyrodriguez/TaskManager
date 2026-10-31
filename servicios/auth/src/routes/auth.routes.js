const express = require('express');
const router = express.Router();

const {
  register,
  login,
} = require('../controllers/auth.controller');

const {
  authenticateToken,
} = require('../middlewares/auth.middleware');

// Registrar usuario
router.post('/register', register);

// Iniciar sesión
router.post('/login', login);

// Ruta protegida con JWT
router.get('/me', authenticateToken, (req, res) => {
  res.status(200).json({
    message: 'Acceso autorizado',
    user: req.user,
  });
});

module.exports = router;