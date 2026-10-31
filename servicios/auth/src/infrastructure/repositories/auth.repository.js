
const { sql, getSQLPool } = require('../database/sqlserver');

// Buscar usuario por correo
async function findUserByEmail(email) {
  const pool = await getSQLPool();

  const result = await pool.request()
    .input('email', sql.NVarChar(254), email)
    .query(`
      SELECT Id, Name, Email, PasswordHash, DepartmentId, Role
      FROM dbo.Users
      WHERE Email = @email
    `);

  return result.recordset[0] || null;
}

// Registrar un nuevo usuario
async function createUser(user) {
  const pool = await getSQLPool();

  const result = await pool.request()
    .input('name', sql.NVarChar(100), user.name)
    .input('email', sql.NVarChar(254), user.email)
    .input('passwordHash', sql.NVarChar(255), user.passwordHash)
    .input('departmentId', sql.Int, user.departmentId)
    .input('role', sql.VarChar(20), 'employee')
    .query(`
      INSERT INTO dbo.Users
        (Name, Email, PasswordHash, DepartmentId, Role)
      OUTPUT
        INSERTED.Id,
        INSERTED.Name,
        INSERTED.Email,
        INSERTED.DepartmentId,
        INSERTED.Role
      VALUES
        (@name, @email, @passwordHash, @departmentId, @role)
    `);

  return result.recordset[0];
}

// Obtener todos los usuarios
async function findAllUsers() {
  const pool = await getSQLPool();

  const result = await pool.request().query(`
    SELECT Id, Name, Email, DepartmentId, Role
    FROM dbo.Users
    ORDER BY Name ASC
  `);

  return result.recordset;
}

// Buscar usuario por ID
async function findUserById(id) {
  const pool = await getSQLPool();

  const result = await pool.request()
    .input('id', sql.Int, id)
    .query(`
      SELECT Id, Name, Email, DepartmentId, Role
      FROM dbo.Users
      WHERE Id = @id
    `);

  return result.recordset[0] || null;
}

// Actualizar el rol de un usuario
async function updateUserRole(id, role) {
  const pool = await getSQLPool();

  const result = await pool.request()
    .input('id', sql.Int, id)
    .input('role', sql.VarChar(20), role)
    .query(`
      UPDATE dbo.Users
      SET Role = @role
      OUTPUT
        INSERTED.Id,
        INSERTED.Name,
        INSERTED.Email,
        INSERTED.DepartmentId,
        INSERTED.Role
      WHERE Id = @id
    `);

  return result.recordset[0] || null;
}

module.exports = {
  findUserByEmail,
  createUser,
  findAllUsers,
  findUserById,
  updateUserRole,
};
