
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
    method: 'GET',
    headers: getHeaders(),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message || 'No se pudieron consultar los usuarios'
    );
  }

  // Reconocer diferentes formatos de respuesta del Gateway.
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data.users)) {
    return data.users;
  }

  if (Array.isArray(data.data)) {
    return data.data;
  }

  if (Array.isArray(data.data?.users)) {
    return data.data.users;
  }

  if (Array.isArray(data.results)) {
    return data.results;
  }

  console.log('Respuesta recibida al consultar usuarios:', data);

  return [];
}

export async function changeUserRole(id, role) {
  const response = await fetch(`${API_URL}/${id}/role`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify({ role }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message || 'No se pudo cambiar el rol'
    );
  }

  return data.user ?? data.data?.user ?? data.data ?? data;
}
