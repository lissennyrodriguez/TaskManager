
const { sql, getSQLPool } = require('../database/sqlserver');

// Obtener todas las tareas
async function findAll() {
  const pool = await getSQLPool();

  const result = await pool.request().query(`
    SELECT
      t.Id,
      t.Title,
      t.Description,
      t.DepartmentId,
      d.Name AS DepartmentName,
      t.AssignedTo,
      u.Name AS AssignedToName,
      t.CreatedBy,
      t.Priority,
      t.Status,
      t.DueDate,
      t.CreatedAt,
      t.UpdatedAt
    FROM Tasks t
    INNER JOIN Departments d
      ON d.Id = t.DepartmentId
    INNER JOIN Users u
      ON u.Id = t.AssignedTo
    ORDER BY t.CreatedAt DESC
  `);

  return result.recordset;
}

// Obtener una tarea por ID
async function findById(id) {
  const pool = await getSQLPool();

  const result = await pool.request()
    .input('id', sql.Int, id)
    .query(`
      SELECT
        t.Id,
        t.Title,
        t.Description,
        t.DepartmentId,
        d.Name AS DepartmentName,
        t.AssignedTo,
        u.Name AS AssignedToName,
        t.CreatedBy,
        t.Priority,
        t.Status,
        t.DueDate,
        t.CreatedAt,
        t.UpdatedAt
      FROM Tasks t
      INNER JOIN Departments d
        ON d.Id = t.DepartmentId
      INNER JOIN Users u
        ON u.Id = t.AssignedTo
      WHERE t.Id = @id
    `);

  return result.recordset[0] || null;
}

// Crear una nueva tarea
async function create(data) {
  const pool = await getSQLPool();

  const result = await pool.request()
    .input('title', sql.NVarChar(150), data.title)
    .input('description', sql.NVarChar(2000), data.description)
    .input('departmentId', sql.Int, data.departmentId)
    .input('assignedTo', sql.Int, data.assignedTo)
    .input('createdBy', sql.Int, data.createdBy)
    .input('priority', sql.VarChar(20), data.priority)
    .input('status', sql.VarChar(20), data.status)
    .input('dueDate', sql.Date, data.dueDate)
    .query(`
      INSERT INTO Tasks (
        Title,
        Description,
        DepartmentId,
        AssignedTo,
        CreatedBy,
        Priority,
        Status,
        DueDate
      )
      OUTPUT INSERTED.Id
      VALUES (
        @title,
        @description,
        @departmentId,
        @assignedTo,
        @createdBy,
        @priority,
        @status,
        @dueDate
      )
    `);

  return findById(result.recordset[0].Id);
}

// Actualizar una tarea
async function update(id, data) {
  const pool = await getSQLPool();

  await pool.request()
    .input('id', sql.Int, id)
    .input('title', sql.NVarChar(150), data.title)
    .input('description', sql.NVarChar(2000), data.description)
    .input('departmentId', sql.Int, data.departmentId)
    .input('assignedTo', sql.Int, data.assignedTo)
    .input('priority', sql.VarChar(20), data.priority)
    .input('status', sql.VarChar(20), data.status)
    .input('dueDate', sql.Date, data.dueDate)
    .query(`
      UPDATE Tasks
      SET
        Title = @title,
        Description = @description,
        DepartmentId = @departmentId,
        AssignedTo = @assignedTo,
        Priority = @priority,
        Status = @status,
        DueDate = @dueDate,
        UpdatedAt = SYSUTCDATETIME()
      WHERE Id = @id
    `);

  return findById(id);
}

// Eliminar una tarea
async function remove(id) {
  const pool = await getSQLPool();

  const result = await pool.request()
    .input('id', sql.Int, id)
    .query(`
      DELETE FROM Tasks
      OUTPUT DELETED.Id
      WHERE Id = @id
    `);

  return result.recordset.length > 0;
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
};
