function notFound(req, res, next) {
  const error = new Error(`Ruta no encontrada: ${req.method} ${req.originalUrl}`);
  error.status = 404;
  next(error);
}

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  let status = err.status || 500;
  let message = err.message || 'Error interno del servidor';

  if (err.name === 'ZodError') {
    status = 400;
    message = 'Los datos enviados no son válidos';
  }

  if (err.name === 'ValidationError') {
    status = 400;
    message = 'Error de validación';
  }

  if (err.number === 2627 || err.number === 2601) {
    status = 409;
    message = 'El registro ya existe';
  }

  if (err.number === 547) {
    status = 400;
    message = 'La operación viola una relación entre registros';
  }

  if (status < 400 || status > 599) {
    status = 500;
  }

  console.error(err);

  res.status(status).json({
    message: status === 500 && process.env.NODE_ENV === 'production'
      ? 'Error interno del servidor'
      : message,
  });
}

module.exports = {
  notFound,
  errorHandler,
};