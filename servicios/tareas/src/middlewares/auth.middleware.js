
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Debes iniciar sesión para acceder a este recurso'
    });
  }

  const token = authorization.split(' ')[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET,
      { algorithms: ['HS256'] }
    );

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token inválido o expirado'
    });
  }
}

module.exports = {
  authenticateToken
};
