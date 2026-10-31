
const {
  findAllUsers,
  findUserById,
  updateUserRole,
} = require('../infrastructure/repositories/auth.repository');

const ROLES = ['employee', 'manager', 'admin'];

// Comprobar si el usuario es administrador o gerente.
function canManageUsers(user) {
  const role = String(user?.Role ?? user?.role ?? '')
    .trim()
    .toLowerCase();

  return ['admin', 'manager', 'gerente'].includes(role);
}

// Consultar usuarios registrados.
async function getUsers(req, res, next) {
  try {
    const currentUser = await findUserById(req.user.id);

    if (!currentUser || !canManageUsers(currentUser)) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para consultar los usuarios',
      });
    }

    const users = await findAllUsers();

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    next(error);
  }
}

// Cambiar el rol de un usuario.
async function changeUserRole(req, res, next) {
  try {
    const currentUser = await findUserById(req.user.id);

    if (!currentUser || !canManageUsers(currentUser)) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para cambiar roles',
      });
    }

    const id = Number(req.params.id);

    const role = String(req.body?.role ?? '')
      .trim()
      .toLowerCase();

    if (!Number.isSafeInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: 'ID de usuario no válido',
      });
    }

    if (!ROLES.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Rol no válido. Utiliza employee, manager o admin',
      });
    }

    // Evitar que un usuario cambie su propio rol.
    if (Number(req.user.id) === id) {
      return res.status(403).json({
        success: false,
        message: 'No puedes cambiar tu propio rol',
      });
    }

    const user = await updateUserRole(id, role);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Rol actualizado correctamente',
      user,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getUsers,
  changeUserRole,
};
