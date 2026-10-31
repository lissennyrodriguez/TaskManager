const jwt = require('jsonwebtoken');
const env = require('../config/env');

function authenticateToken(req, res, next) {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'Debes iniciar sesión para acceder a este recurso',
    });
  }

  const token = authorization.slice(7);

  try {
    const decoded = jwt.verify(token, env.jwtSecret);

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Token inválido o expirado',
    });
  }
}

module.exports = { authenticateToken };