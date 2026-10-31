
const { sql, getSQLPool } = require('../database/sqlserver');

// Obtener todas las tareas
async function findAll() {
  const pool = await getSQLPool();

  const result = await pool.request().query(`
    SELECT
      t.*,
      d.Name AS Department
    FROM dbo.Tasks t
    INNER JOIN dbo.Departments d
      ON t.DepartmentId = d.Id
    ORDER BY t.Id DESC
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
        t.*,
        d.Name AS Department
      FROM dbo.Tasks t
      INNER JOIN dbo.Departments d
        ON t.DepartmentId = d.Id
      WHERE t.Id = @id
    `);

  return result.recordset[0] || null;
}

// Crear una tarea
async function create(task) {
  const pool = await getSQLPool();

  const result = await pool.request()
    .input('title', sql.NVarChar(150), task.title)
    .input('description', sql.NVarChar(2000), task.description || '')
    .input('departmentId', sql.Int, task.departmentId)
    .input('assignedTo', sql.Int, task.assignedTo)
    .input('createdBy', sql.Int, task.createdBy)
    .input('priority', sql.VarChar(20), task.priority || 'media')
    .input('status', sql.VarChar(20), task.status || 'pendiente')
    .input('dueDate', sql.Date, task.dueDate || null)
    .query(`
      INSERT INTO dbo.Tasks (
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

// Actualizar una tarea existente
async function update(id, task) {
  const pool = await getSQLPool();

  const result = await pool.request()
    .input('id', sql.Int, id)
    .input('title', sql.NVarChar(150), task.title)
    .input('description', sql.NVarChar(2000), task.description ?? '')
    .input('departmentId', sql.Int, task.departmentId)
    .input('assignedTo', sql.Int, task.assignedTo)
    .input('priority', sql.VarChar(20), task.priority)
    .input('status', sql.VarChar(20), task.status)
    .input('dueDate', sql.Date, task.dueDate || null)
    .query(`
      UPDATE dbo.Tasks
      SET
        Title = @title,
        Description = @description,
        DepartmentId = @departmentId,
        AssignedTo = @assignedTo,
        Priority = @priority,
        Status = @status,
        DueDate = @dueDate,
        UpdatedAt = GETUTCDATE()
      WHERE Id = @id
    `);

  if (result.rowsAffected[0] === 0) {
    return null;
  }

  return findById(id);
}

// Eliminar una tarea por ID
async function remove(id) {
  const pool = await getSQLPool();

  const result = await pool.request()
    .input('id', sql.Int, id)
    .query(`
      DELETE FROM dbo.Tasks
      WHERE Id = @id
    `);

  return result.rowsAffected[0] > 0;
}

// Exportar las funciones del repositorio
module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
};
