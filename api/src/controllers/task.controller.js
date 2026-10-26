
const { createTaskUseCases } = require('../application/tasks/task.use-cases');

const {
  taskSchema,
  taskStatusSchema,
} = require('../validators/task.validator');

const Activity = require('../models/Activity');

const taskUseCases = createTaskUseCases();

// Registrar actividad en MongoDB
async function recordActivity(data) {
  try {
    await Activity.create(data);
  } catch (error) {
    console.error(
      'No se pudo registrar la actividad:',
      error.message
    );
  }
}

// Validar ID de tarea
function getTaskId(req, res) {
  const id = Number(req.params.id);

  if (!Number.isSafeInteger(id) || id <= 0) {
    res.status(400).json({
      message: 'ID no válido',
    });

    return null;
  }

  return id;
}

// Administradores y gerentes pueden gestionar tareas
function canManageTasks(user) {
  return ['admin', 'manager'].includes(user.role);
}

// Permisos para visualizar tareas
function canViewTask(user, task) {
  if (canManageTasks(user)) {
    return true;
  }

  // Los empleados solo visualizan tareas asignadas
  return Number(user.id) === Number(task.AssignedTo);
}

// Listar tareas
async function listTasks(req, res, next) {
  try {
    const tasks = await taskUseCases.listTasks();

    const visibleTasks = tasks.filter((task) =>
      canViewTask(req.user, task)
    );

    res.json(visibleTasks);
  } catch (error) {
    next(error);
  }
}

// Consultar una tarea
async function getTask(req, res, next) {
  try {
    const id = getTaskId(req, res);

    if (id === null) return;

    const task = await taskUseCases.getTask(id);

    if (!canViewTask(req.user, task)) {
      return res.status(403).json({
        message: 'No tienes permiso para consultar esta asignación',
      });
    }

    res.json(task);
  } catch (error) {
    next(error);
  }
}

// Crear tarea
async function createTask(req, res, next) {
  try {
    const user = req.user;

    if (!canManageTasks(user)) {
      return res.status(403).json({
        message: 'No tienes permiso para crear asignaciones',
      });
    }

    const validation = taskSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        message: 'Datos de la asignación no válidos',
        errors: validation.error.issues,
      });
    }

    const data = validation.data;

    // No restringir por departamento.
    // Un gerente puede asignar tareas a cualquier departamento.
    const task = await taskUseCases.createTask(
      data,
      user.id
    );

    await recordActivity({
      action: 'TASK_CREATED',
      entityType: 'Task',
      entityId: String(task.Id),
      userId: user.id,
      details: {
        title: task.Title,
        departmentId: task.DepartmentId,
        assignedTo: task.AssignedTo,
      },
    });

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
}

// Actualizar tarea
async function updateTask(req, res, next) {
  try {
    const id = getTaskId(req, res);

    if (id === null) return;

    const user = req.user;

    const existingTask = await taskUseCases.getTask(id);

    if (!canViewTask(user, existingTask)) {
      return res.status(403).json({
        message: 'No tienes permiso para modificar esta asignación',
      });
    }

    let data;

    if (user.role === 'employee') {
      // Los empleados solo pueden cambiar el estado
      // de sus propias tareas.
      if (
        Number(existingTask.AssignedTo) !== Number(user.id)
      ) {
        return res.status(403).json({
          message: 'Solo puedes actualizar tus propias asignaciones',
        });
      }

      const validation = taskStatusSchema.safeParse(req.body);

      if (!validation.success) {
        return res.status(400).json({
          message: 'Solo puedes enviar un estado válido',
          errors: validation.error.issues,
        });
      }

      data = {
        title: existingTask.Title,
        description: existingTask.Description || '',
        departmentId: existingTask.DepartmentId,
        assignedTo: existingTask.AssignedTo,
        priority: existingTask.Priority,
        status: validation.data.status,
        dueDate: existingTask.DueDate
          ? new Date(existingTask.DueDate)
              .toISOString()
              .slice(0, 10)
          : null,
      };
    } else {
      // Solo administradores y gerentes pueden
      // modificar todos los datos de una tarea.
      if (!canManageTasks(user)) {
        return res.status(403).json({
          message: 'No tienes permiso para administrar esta asignación',
        });
      }

      const validation = taskSchema.safeParse(req.body);

      if (!validation.success) {
        return res.status(400).json({
          message: 'Datos de la asignación no válidos',
          errors: validation.error.issues,
        });
      }

      // Se permiten cambios de departamento.
      data = validation.data;
    }

    const updatedTask = await taskUseCases.updateTask(
      id,
      data
    );

    await recordActivity({
      action:
        user.role === 'employee'
          ? 'TASK_STATUS_UPDATED'
          : 'TASK_UPDATED',
      entityType: 'Task',
      entityId: String(updatedTask.Id),
      userId: user.id,
      details: {
        title: updatedTask.Title,
        departmentId: updatedTask.DepartmentId,
        assignedTo: updatedTask.AssignedTo,
        previousStatus: existingTask.Status,
        newStatus: updatedTask.Status,
      },
    });

    res.json(updatedTask);
  } catch (error) {
    next(error);
  }
}

// Eliminar tarea
async function deleteTask(req, res, next) {
  try {
    const id = getTaskId(req, res);

    if (id === null) return;

    const user = req.user;

    if (!canManageTasks(user)) {
      return res.status(403).json({
        message: 'No tienes permiso para eliminar esta asignación',
      });
    }

    const task = await taskUseCases.getTask(id);

    await taskUseCases.deleteTask(id);

    await recordActivity({
      action: 'TASK_DELETED',
      entityType: 'Task',
      entityId: String(id),
      userId: user.id,
      details: {
        title: task.Title,
        departmentId: task.DepartmentId,
        assignedTo: task.AssignedTo,
      },
    });

    res.status(204).end();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
};
