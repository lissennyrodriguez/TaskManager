const authRepository = require(
  '../infrastructure/repositories/auth.repository'
);

const Activity = require('../models/Activity');

const MAIN_ADMIN_EMAIL = 'prueba.taskmanager@example.com';

const VALID_ROLES = ['employee', 'manager', 'admin'];

// Consultar todos los usuarios
async function getUsers(req, res, next) {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        message: 'Solo los administradores pueden consultar usuarios',
      });
    }

    const users = await authRepository.findAllUsers();

    return res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
}

// Obtener usuarios disponibles para asignar tareas
async function getAssignableUsers(req, res, next) {
  try {
    if (!['admin', 'manager'].includes(req.user.role)) {
      return res.status(403).json({
        message: 'No tienes permisos para asignar tareas',
      });
    }

    const users = await authRepository.findAllUsers();

    return res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
}

// Cambiar el rol de un usuario
async function changeRole(req, res, next) {
  try {
    // Verificar permisos
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        message: 'Solo los administradores pueden cambiar roles',
      });
    }

    const userId = Number(req.params.id);
    const role = req.body?.role;

    // Validar ID
    if (!Number.isSafeInteger(userId) || userId <= 0) {
      return res.status(400).json({
        message: 'ID de usuario inválido',
      });
    }

    // Validar rol
    if (!VALID_ROLES.includes(role)) {
      return res.status(400).json({
        message: 'Rol inválido. Usa employee, manager o admin',
      });
    }

    // Evitar que un administrador cambie su propio rol
    if (userId === Number(req.user.id)) {
      return res.status(403).json({
        message: 'No puedes cambiar tu propio rol',
      });
    }

    // Buscar usuario
    const targetUser = await authRepository.findUserById(userId);

    if (!targetUser) {
      return res.status(404).json({
        message: 'Usuario no encontrado',
      });
    }

    // Proteger al administrador principal
    if (targetUser.Email.toLowerCase() === MAIN_ADMIN_EMAIL) {
      return res.status(403).json({
        message: 'No se puede modificar al administrador principal',
      });
    }

    // Evitar actualizaciones innecesarias
    if (targetUser.Role === role) {
      return res.status(200).json({
        message: 'El usuario ya tiene ese rol',
        user: targetUser,
      });
    }

    // Actualizar el rol en SQL Server
    const updatedUser = await authRepository.updateUserRole(
      userId,
      role
    );

    if (!updatedUser) {
      return res.status(404).json({
        message: 'No se pudo actualizar el usuario',
      });
    }

    // Registrar actividad en MongoDB
    try {
      await Activity.create({
        action: 'USER_ROLE_CHANGED',
        entityType: 'User',
        entityId: String(userId),
        userId: Number(req.user.id),
        details: {
          previousRole: targetUser.Role,
          newRole: role,
        },
      });
    } catch (activityError) {
      console.error(
        'Error al registrar actividad:',
        activityError.message
      );
    }

    return res.status(200).json({
      message: 'Rol actualizado correctamente',
      user: updatedUser,
    });

  } catch (error) {
    next(error);
  }
}

module.exports = {
  getUsers,
  getAssignableUsers,
  changeRole,
};