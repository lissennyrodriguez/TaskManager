
const taskRepository = require('../../infrastructure/repositories/task.repository');
const { createTask } = require('../../domain/tasks/task.entity');

function createTaskUseCases({ repository = taskRepository } = {}) {

  async function getTask(id) {
    const task = await repository.findById(id);

    if (!task) {
      const error = new Error('Asignación no encontrada');
      error.status = 404;
      throw error;
    }

    return task;
  }

  return {
    async listTasks() {
      return repository.findAll();
    },

    getTask,

    async createTask(data, userId) {
      const task = createTask({
        ...data,
        createdBy: userId,
      });

      return repository.create(task);
    },

    async updateTask(id, data) {
      const existingTask = await getTask(id);

      const task = createTask({
        title: data.title ?? existingTask.Title,
        description: data.description ?? existingTask.Description,
        departmentId: data.departmentId ?? existingTask.DepartmentId,
        assignedTo: data.assignedTo ?? existingTask.AssignedTo,
        priority: data.priority ?? existingTask.Priority,
        status: data.status ?? existingTask.Status,
        dueDate: data.dueDate !== undefined
          ? data.dueDate
          : existingTask.DueDate,
        createdBy: existingTask.CreatedBy,
      });

      return repository.update(id, task);
    },

    async deleteTask(id) {
      await getTask(id);

      await repository.remove(id);

      return {
        message: 'Asignación eliminada correctamente',
      };
    },
  };
}

module.exports = {
  createTaskUseCases,
};
