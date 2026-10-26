const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const env = require('../config/env');
const authRepository = require('../infrastructure/repositories/auth.repository');
const { registerSchema, loginSchema } = require('../validators/auth.validator');
const Activity = require('../models/Activity');

async function recordActivity(data) {
  try {
    await Activity.create(data);
  } catch (error) {
    console.error('No se pudo registrar la actividad:', error.message);
  }
}

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

    const user = await authRepository.createUser({
      name,
      email,
      passwordHash,
      departmentId,
    });

    await recordActivity({
      action: 'USER_REGISTERED',
      entityType: 'User',
      entityId: String(user.Id),
      userId: user.Id,
    });

    res.status(201).json({
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
      user.PasswordHash,
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
      },
    );

    await recordActivity({
      action: 'USER_LOGIN',
      entityType: 'User',
      entityId: String(user.Id),
      userId: user.Id,
    });

    res.json({
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