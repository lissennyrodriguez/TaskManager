
const { sql, getSQLPool } = require('../database/sqlserver');

async function findUserByEmail(email) {
  const pool = await getSQLPool();

  const result = await pool.request()
    .input('email', sql.NVarChar(254), email)
    .query(`
      SELECT Id, Name, Email, PasswordHash, DepartmentId, Role
      FROM Users
      WHERE Email = @email
    `);

  return result.recordset[0] || null;
}

async function findUserById(id) {
  const pool = await getSQLPool();

  const result = await pool.request()
    .input('id', sql.Int, id)
    .query(`
      SELECT Id, Name, Email, DepartmentId, Role
      FROM Users
      WHERE Id = @id
    `);

  return result.recordset[0] || null;
}

async function createUser(user) {
  const pool = await getSQLPool();

  const result = await pool.request()
    .input('name', sql.NVarChar(100), user.name)
    .input('email', sql.NVarChar(254), user.email)
    .input('passwordHash', sql.NVarChar(255), user.passwordHash)
    .input('departmentId', sql.Int, user.departmentId)
    .input('role', sql.VarChar(20), 'employee')
    .query(`
      INSERT INTO Users
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

// Consultar todos los usuarios, sin mostrar contraseñas
async function findAllUsers() {
  const pool = await getSQLPool();

  const result = await pool.request().query(`
    SELECT Id, Name, Email, DepartmentId, Role
    FROM Users
    ORDER BY Id ASC
  `);

  return result.recordset;
}

// Actualizar el rol de un usuario
async function updateUserRole(id, role) {
  const pool = await getSQLPool();

  const result = await pool.request()
    .input('id', sql.Int, id)
    .input('role', sql.VarChar(20), role)
    .query(`
      UPDATE Users
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
  findUserById,
  createUser,
  findAllUsers,
  updateUserRole,
};
