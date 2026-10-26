
import { useEffect, useState } from 'react';

const API_URL = 'http://localhost:3000/api';

const initialForm = {
  title: '',
  description: '',
  departmentId: '',
  assignedTo: '',
  priority: 'media',
  status: 'pendiente',
  dueDate: '',
};

const roleLabels = {
  admin: 'Administrador',
  manager: 'Gerente',
  employee: 'Empleado',
};

const departmentLabels = {
  1: 'Recursos Humanos',
  2: 'Tecnología',
  3: 'Finanzas',
  4: 'Operaciones',
};

function TaskForm({ onCreate }) {
  const [form, setForm] = useState({ ...initialForm });
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [usersError, setUsersError] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadUsers() {
      setLoadingUsers(true);
      setUsersError('');

      try {
        const token = sessionStorage.getItem('token');

        if (!token) {
          throw new Error('Debes iniciar sesión nuevamente.');
        }

        const response = await fetch(
          `${API_URL}/users/assignable`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || 'No se pudieron cargar los usuarios'
          );
        }

        if (active) {
          setUsers(Array.isArray(data.users) ? data.users : []);
        }
      } catch (err) {
        if (active) {
          setUsersError(err.message);
        }
      } finally {
        if (active) {
          setLoadingUsers(false);
        }
      }
    }

    loadUsers();

    return () => {
      active = false;
    };
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    // Limpiar el mensaje de error al corregir un campo
    setError('');

    if (name === 'assignedTo') {
      const selectedUser = users.find(
        (user) => String(user.Id ?? user.id) === value
      );

      const departmentId = selectedUser
        ? selectedUser.DepartmentId ?? selectedUser.departmentId
        : '';

      setForm((previous) => ({
        ...previous,
        assignedTo: value,
        departmentId: String(departmentId ?? ''),
      }));

      return;
    }

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    // Validar los campos obligatorios
    if (!form.title.trim() || !form.assignedTo) {
      setError('Por favor, completa los campos obligatorios.');
      return;
    }

    const selectedUser = users.find(
      (user) =>
        String(user.Id ?? user.id) === form.assignedTo
    );

    if (!selectedUser) {
      setError('Selecciona un usuario válido.');
      return;
    }

    const departmentId = Number(
      selectedUser.DepartmentId ?? selectedUser.departmentId
    );

    if (!Number.isInteger(departmentId) || departmentId <= 0) {
      setError(
        'El usuario seleccionado no tiene un departamento válido.'
      );
      return;
    }

    setLoading(true);

    try {
      await onCreate({
        ...form,
        title: form.title.trim(),
        departmentId,
        assignedTo: Number(form.assignedTo),
        dueDate: form.dueDate || null,
      });

      // Limpiar el formulario después de crear la tarea
      setForm({ ...initialForm });
      setError('');
    } catch (err) {
      setError(err.message || 'No se pudo crear la tarea');
    } finally {
      setLoading(false);
    }
  }

  const selectedUser = users.find(
    (user) =>
      String(user.Id ?? user.id) === form.assignedTo
  );

  const selectedDepartmentName =
    departmentLabels[form.departmentId] ||
    'Selecciona primero una persona';

  return (
    <section>
      <h2>Crear nueva tarea</h2>

      <form
        onSubmit={handleSubmit}
        noValidate
      >
        <label>
          Título
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Descripción
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </label>

        <label>
          Asignar tarea a
          <select
            name="assignedTo"
            value={form.assignedTo}
            onChange={handleChange}
            disabled={loadingUsers || !!usersError || loading}
            required
          >
            <option value="">
              {loadingUsers
                ? 'Cargando usuarios...'
                : 'Selecciona un usuario'}
            </option>

            {users.map((user) => {
              const id = user.Id ?? user.id;
              const name = user.Name ?? user.name;
              const role = user.Role ?? user.role;
              const departmentId =
                user.DepartmentId ?? user.departmentId;

              return (
                <option key={id} value={id}>
                  {name} - {roleLabels[role] || role}
                  {' - '}
                  {departmentLabels[departmentId] ||
                    'Sin departamento'}
                </option>
              );
            })}
          </select>
        </label>

        <label>
          Departamento de destino
          <input
            type="text"
            value={selectedDepartmentName}
            readOnly
          />
        </label>

        {selectedUser && (
          <p>
            Esta tarea se asignará a{' '}
            <strong>
              {selectedUser.Name ?? selectedUser.name}
            </strong>
            {' '}del departamento de{' '}
            <strong>{selectedDepartmentName}</strong>.
          </p>
        )}

        {usersError && (
          <p role="alert">{usersError}</p>
        )}

        {!loadingUsers &&
          !usersError &&
          users.length === 0 && (
            <p>No hay usuarios registrados disponibles.</p>
          )}

        <label>
          Prioridad
          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
          >
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
            <option value="urgente">Urgente</option>
          </select>
        </label>

        <label>
          Fecha límite
          <input
            name="dueDate"
            type="date"
            value={form.dueDate}
            onChange={handleChange}
          />
        </label>

        {error && <p role="alert">{error}</p>}

        <button
          type="submit"
          disabled={
            loading ||
            loadingUsers ||
            !!usersError ||
            users.length === 0
          }
        >
          {loading ? 'Creando...' : 'Crear tarea'}
        </button>
      </form>
    </section>
  );
}

export default TaskForm;
