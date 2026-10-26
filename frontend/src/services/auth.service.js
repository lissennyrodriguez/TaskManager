
const API_URL = 'http://localhost:3000/api/auth';

// Iniciar sesión
export async function loginUser(email, password) {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message || 'No se pudo iniciar sesión'
    );
  }

  return data;
}

// Registrar nuevos usuarios
export async function registerUser(user) {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const validationMessage = data.errors
      ?.map((issue) => issue.message)
      .join(', ');

    throw new Error(
      validationMessage ||
      data.message ||
      'No se pudo registrar el usuario'
    );
  }

  return data;
}
