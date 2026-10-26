
const API_URL = 'http://localhost:3000/api/tasks';

// Consultar tareas
export async function getTasks() {
  const token = sessionStorage.getItem('token');

  if (!token) {
    throw new Error('Debes iniciar sesión primero');
  }

  const response = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'No se pudieron cargar las tareas');
  }

  return data;
}

// Crear tarea
export async function createTask(task) {
  const token = sessionStorage.getItem('token');

  if (!token) {
    throw new Error('Debes iniciar sesión primero');
  }

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(task),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'No se pudo crear la tarea');
  }

  return data;
}

// Actualizar tarea
export async function updateTask(id, task) {
  const token = sessionStorage.getItem('token');

  if (!token) {
    throw new Error('Debes iniciar sesión primero');
  }

  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(task),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'No se pudo actualizar la tarea');
  }

  return data;
}

// Eliminar tarea
export async function deleteTask(id) {
  const token = sessionStorage.getItem('token');

  if (!token) {
    throw new Error('Debes iniciar sesión primero');
  }

  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || 'No se pudo eliminar la tarea');
  }

  return true;
}

