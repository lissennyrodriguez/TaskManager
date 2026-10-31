
const taskRepository = require('../../infrastructure/repositories/task.repository');

// Listar todas las tareas
async function listTasks() {
  return taskRepository.findAll();
}

// Obtener una tarea por ID
async function getTask(id) {
  const task = await taskRepository.findById(id);

  if (!task) {
    const error = new Error('Tarea no encontrada');
    error.status = 404;
    throw error;
  }

  return task;
}

// Crear una tarea
async function createTask(data) {
  return taskRepository.create(data);
}

// Actualizar una tarea existente
async function updateTask(id, data) {
  await getTask(id);

  const updatedTask = await taskRepository.update(id, data);

  if (!updatedTask) {
    const error = new Error('Tarea no encontrada');
    error.status = 404;
    throw error;
  }

  return updatedTask;
}

// Eliminar una tarea existente
async function deleteTask(id) {
  await getTask(id);

  const deleted = await taskRepository.remove(id);

  if (!deleted) {
    const error = new Error('Tarea no encontrada');
    error.status = 404;
    throw error;
  }

  return true;
}

// Exportar los casos de uso
module.exports = {
  listTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
};
