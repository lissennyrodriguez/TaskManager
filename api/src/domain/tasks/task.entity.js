const PRIORITIES = ['baja', 'media', 'alta', 'urgente'];

const STATUSES = [
  'pendiente',
  'en_progreso',
  'completada',
  'cancelada',
];

function createTask(data) {
  if (!data.title || !data.title.trim()) {
    throw new Error('El título es obligatorio');
  }

  if (!data.departmentId) {
    throw new Error('El departamento es obligatorio');
  }

  if (!data.assignedTo) {
    throw new Error('Debes indicar el empleado responsable');
  }

  const priority = data.priority || 'media';
  const status = data.status || 'pendiente';

  if (!PRIORITIES.includes(priority)) {
    throw new Error('La prioridad no es válida');
  }

  if (!STATUSES.includes(status)) {
    throw new Error('El estado no es válido');
  }

  return {
    title: data.title.trim(),
    description: data.description?.trim() || '',
    departmentId: Number(data.departmentId),
    assignedTo: Number(data.assignedTo),
    createdBy: Number(data.createdBy),
    priority,
    status,
    dueDate: data.dueDate || null,
  };
}

module.exports = {
  createTask,
  PRIORITIES,
  STATUSES,
};