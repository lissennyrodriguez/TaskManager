
import { useState } from 'react';
import { loginUser } from '../services/auth.service';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError('');
    setLoading(true);

    try {
      const data = await loginUser(email, password);

      if (!data.token) {
        throw new Error('El servidor no devolvió un token JWT');
      }

      if (!data.user) {
        throw new Error('El servidor no devolvió los datos del usuario');
      }

      // Guardar token JWT
      sessionStorage.setItem('token', data.token);

      // Mostrar Dashboard mediante App.jsx
      onLogin(data.user);

    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <h1>TaskManager</h1>
      <h2>Iniciar sesión</h2>

      <p>Ingresa tus credenciales para continuar.</p>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">
            Correo electrónico
          </label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password">
            Contraseña
          </label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        {error && <p role="alert">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Ingresando...' : 'Iniciar sesión'}
        </button>
      </form>
    </main>
  );
}

export default Login;

