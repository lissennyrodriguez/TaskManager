
import { useState } from 'react';
import { registerUser } from '../services/auth.service';

function Register({ onGoToLogin }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    departmentId: '2',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await registerUser({
        ...form,
        departmentId: Number(form.departmentId),
      });

      setSuccess('Cuenta creada correctamente. Ya puedes iniciar sesión.');

      setForm({
        name: '',
        email: '',
        password: '',
        departmentId: '2',
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <h1>TaskManager</h1>
      <h2>Registro de nuevos usuarios</h2>

      <p>Completa tus datos para crear una cuenta.</p>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="register-name">Nombre completo</label>
          <input
            id="register-name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="register-email">Correo electrónico</label>
          <input
            id="register-email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="register-password">Contraseña</label>
          <input
            id="register-password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="register-department">Departamento</label>
          <select
            id="register-department"
            name="departmentId"
            value={form.departmentId}
            onChange={handleChange}
          >
            <option value="1">Recursos Humanos</option>
            <option value="2">Tecnología</option>
            <option value="3">Finanzas</option>
            <option value="4">Operaciones</option>
          </select>
        </div>

        <p>Tu cuenta se creará con el rol de empleado.</p>

        {error && <p role="alert">{error}</p>}
        {success && <p role="status">{success}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Registrando...' : 'Crear cuenta'}
        </button>
      </form>

      <p>¿Ya tienes una cuenta?</p>

      <button type="button" onClick={onGoToLogin}>
        Iniciar sesión
      </button>
    </main>
  );
}

export default Register;
