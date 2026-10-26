
const API_URL = 'http://localhost:3000/api/users';

function getHeaders() {
  const token = sessionStorage.getItem('token');

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export async function getUsers() {
  const response = await fetch(API_URL, {
    headers: getHeaders(),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'No se pudieron consultar los usuarios');
  }

  return data.users;
}

export async function changeUserRole(id, role) {
  const response = await fetch(`${API_URL}/${id}/role`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify({ role }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'No se pudo cambiar el rol');
  }

  return data.user;
}
