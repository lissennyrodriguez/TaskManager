
const jwt = require('jsonwebtoken');
const env = require('../config/env');

const authRepository = require(
  '../infrastructure/repositories/auth.repository'
);

async function authenticateToken(req, res, next) {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'Debes iniciar sesión para acceder a este recurso',
    });
  }

  const token = authorization.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      message: 'Token no proporcionado',
    });
  }

  let decoded;

  try {
    decoded = jwt.verify(token, env.jwtSecret);
  } catch {
    return res.status(401).json({
      message: 'Token inválido o vencido',
    });
  }

  try {
    const userId = Number(decoded.sub);

    if (!Number.isSafeInteger(userId) || userId <= 0) {
      return res.status(401).json({
        message: 'Token de usuario inválido',
      });
    }

    const user = await authRepository.findUserById(userId);

    if (!user) {
      return res.status(401).json({
        message: 'El usuario ya no existe',
      });
    }

    // Utilizar los permisos actuales de SQL Server
    req.user = {
      ...decoded,
      id: user.Id,
      email: user.Email,
      role: user.Role,
      departmentId: user.DepartmentId,
    };

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  authenticateToken,
};
