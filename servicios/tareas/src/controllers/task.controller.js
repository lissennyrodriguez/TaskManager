
const taskUseCases = require('../application/tasks/task.use-cases');
const { createTaskSchema } = require('../validators/task.validator');

// Listar todas las tareas
async function listTasks(req, res, next) {
  try {
    const tasks = await taskUseCases.listTasks();

    return res.status(200).json({
      success: true,
      total: tasks.length,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
}

// Obtener una tarea por ID
async function getTask(req, res, next) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: 'El ID de la tarea no es válido',
      });
    }

    const task = await taskUseCases.getTask(id);

    return res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
}

// Crear una tarea
async function createTask(req, res, next) {
  try {
    const validation = createTaskSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: 'Datos de la tarea no válidos',
        errors: validation.error.issues,
      });
    }

    const userId = Number(req.user?.id);

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(403).json({
        success: false,
        message: 'El token no contiene un usuario válido',
      });
    }

    const task = await taskUseCases.createTask({
      ...validation.data,
      createdBy: userId,
    });

    return res.status(201).json({
      success: true,
      message: 'Tarea creada correctamente',
      data: task,
    });
  } catch (error) {
    next(error);
  }
}

// Actualizar una tarea existente
async function updateTask(req, res, next) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: 'El ID de la tarea no es válido',
      });
    }

    // Validar los datos recibidos
    const validation = createTaskSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: 'Datos de la tarea no válidos',
        errors: validation.error.issues,
      });
    }

    // Actualizar la tarea
    const task = await taskUseCases.updateTask(
      id,
      validation.data
    );

    return res.status(200).json({
      success: true,
      message: 'Tarea actualizada correctamente',
      data: task,
    });
  } catch (error) {
    next(error);
  }
}

// Eliminar una tarea por ID
async function deleteTask(req, res, next) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: 'El ID de la tarea no es válido',
      });
    }

    await taskUseCases.deleteTask(id);

    return res.status(200).json({
      success: true,
      message: 'Tarea eliminada correctamente',
    });
  } catch (error) {
    next(error);
  }
}

// Exportar los controladores
module.exports = {
  listTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
};
