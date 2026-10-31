
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const env = require('../config/env');
const authRepository = require('../infrastructure/repositories/auth.repository');

const {
  publishUserCreated,
} = require('../infrastructure/messaging/rabbitmq');

const {
  registerSchema,
  loginSchema,
} = require('../validators/auth.validator');

// Registrar usuario
async function register(req, res, next) {
  try {
    const validation = registerSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        message: 'Datos de registro no válidos',
        errors: validation.error.issues,
      });
    }

    const { name, email, password, departmentId } = validation.data;

    const existingUser = await authRepository.findUserByEmail(email);

    if (existingUser) {
      return res.status(409).json({
        message: 'Ya existe un usuario con ese correo electrónico',
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    // Guardar usuario en SQL Server
    const user = await authRepository.createUser({
      name,
      email,
      passwordHash,
      departmentId,
    });

    // Publicar evento en RabbitMQ
    try {
      await publishUserCreated(user);
    } catch (error) {
      console.error(
        'No se pudo publicar el evento usuario.creado:',
        error.message
      );
    }

    return res.status(201).json({
      message: 'Usuario registrado correctamente',
      user,
    });
  } catch (error) {
    if (error.number === 2627 || error.number === 2601) {
      return res.status(409).json({
        message: 'El correo electrónico ya está registrado',
      });
    }

    next(error);
  }
}

// Iniciar sesión
async function login(req, res, next) {
  try {
    const validation = loginSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        message: 'Datos de inicio de sesión no válidos',
        errors: validation.error.issues,
      });
    }

    const { email, password } = validation.data;

    const user = await authRepository.findUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        message: 'Correo electrónico o contraseña incorrectos',
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.PasswordHash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        message: 'Correo electrónico o contraseña incorrectos',
      });
    }

    if (!env.jwtSecret || env.jwtSecret.length < 32) {
      throw new Error('JWT_SECRET debe tener al menos 32 caracteres');
    }

    const token = jwt.sign(
      {
        id: user.Id,
        email: user.Email,
        role: user.Role,
        departmentId: user.DepartmentId,
      },
      env.jwtSecret,
      {
        expiresIn: env.jwtExpiresIn,
        subject: String(user.Id),
      }
    );

    return res.status(200).json({
      message: 'Inicio de sesión correcto',
      token,
      expiresIn: env.jwtExpiresIn,
      user: {
        id: user.Id,
        name: user.Name,
        email: user.Email,
        departmentId: user.DepartmentId,
        role: user.Role,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
};
