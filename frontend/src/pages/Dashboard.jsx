
import { useState } from 'react';
import TaskForm from '../components/TaskForm';
import TaskEditForm from '../components/TaskEditForm';

import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from '../services/task.service';

import {
  getUsers,
  changeUserRole,
} from '../services/user.service';

function Dashboard({ user, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [showTasks, setShowTasks] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [modal, setModal] = useState(null);
  const [modalBusy, setModalBusy] = useState(false);

  const [section, setSection] = useState('tasks');
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [savingUserId, setSavingUserId] = useState(null);

  const isAdmin = user?.role === 'admin';
  const isManager = user?.role === 'manager';
  const canManageTasks = isAdmin || isManager;

  const mainAdminEmail = 'prueba.taskmanager@example.com';

  async function loadTasks({ preserveFeedback = false } = {}) {
    setLoading(true);
    if (!preserveFeedback) setError('');

    try {
      const data = await getTasks();
      setTasks(Array.isArray(data) ? data : data.tasks || []);
      setShowTasks(true);
    } catch (err) {
      setError(err.message || 'No se pudieron cargar las tareas');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateTask(task) {
    setError('');
    setSuccess('');

    try {
      await createTask(task);
      await loadTasks({ preserveFeedback: true });
      setModal({ type: 'success', message: '¡La tarea se ha creado con éxito!' });
    } catch (err) {
      const message = err?.message || 'No se pudo crear la tarea';
      setError(message);
      throw err;
    }
  }

  async function handleUpdateTask(data) {
    const id = editingTask.Id ?? editingTask.id;
    setError('');
    setSuccess('');

    try {
      await updateTask(id, data);
      setEditingTask(null);
      await loadTasks({ preserveFeedback: true });
      setModal({ type: 'success', message: '¡Los cambios se han guardado con éxito!' });
    } catch (err) {
      setError(err?.message || 'No se pudieron guardar los cambios');
      throw err;
    }
  }

  function handleDeleteTask(task) {
    const title = task.Title ?? task.title;
    setModal({
      type: 'confirm',
      message: `¿Estás seguro de que deseas eliminar la tarea "${title}"?`,
      action: () => performDeleteTask(task),
      confirmText: 'Eliminar',
    });
  }

  async function performDeleteTask(task) {
    const id = task.Id ?? task.id;
    setDeletingId(id);
    setError('');
    setSuccess('');
    try {
      await deleteTask(id);
      setModal({ type: 'success', message: '¡La tarea se ha eliminado con éxito!' });
      await loadTasks({ preserveFeedback: true });
    } catch (err) {
      setError(err?.message || 'No se pudo eliminar la tarea');
      setModal({ type: 'error', message: err?.message || 'No se pudo eliminar la tarea' });
    } finally {
      setDeletingId(null);
    }
  }

  async function loadUsers() {
    setUsersLoading(true);
    setError('');

    try {
      const data = await getUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setUsersLoading(false);
    }
  }

  function handleChangeRole(id, role) {
    setModal({
      type: 'confirm',
      message: `¿Deseas cambiar el rol de este usuario a "${role}"?`,
      action: () => performChangeRole(id, role),
      confirmText: 'Confirmar',
    });
  }

  async function performChangeRole(id, role) {
    setSavingUserId(id);
    setError('');
    setSuccess('');
    try {
      await changeUserRole(id, role);
      setModal({ type: 'success', message: '¡El rol del usuario se ha actualizado con éxito!' });
      await loadUsers();
    } catch (err) {
      setError(err?.message || 'No se pudo actualizar el rol');
      setModal({ type: 'error', message: err?.message || 'No se pudo actualizar el rol' });
    } finally {
      setSavingUserId(null);
    }
  }

  async function confirmModalAction() {
    if (!modal?.action || modalBusy) return;
    const action = modal.action;
    setModalBusy(true);
    setModal(null);
    try {
      await action();
    } finally {
      setModalBusy(false);
    }
  }

  function openUsers() {
    setSection('users');
    setError('');
    setSuccess('');
    loadUsers();
  }

  function openTasks() {
    setSection('tasks');
    setError('');
    setSuccess('');
  }

  return (
    <main>
      <header>
        <h1>TaskManager - Panel principal</h1>

        <p>
          Bienvenido, {user?.name || user?.Name || user?.email}
        </p>

        <p>
          Rol: <strong>{user?.role}</strong>
        </p>

        <nav className="menu-principal">
          <button
            type="button"
            className="btn-tareas"
            onClick={openTasks}
          >
            Tareas
          </button>

          {isAdmin && (
            <button
              type="button"
              className="btn-usuarios"
              onClick={openUsers}
            >
              Administrar usuarios
            </button>
          )}

          <button
            type="button"
            className="btn-salir"
            onClick={onLogout}
          >
            Cerrar sesión
          </button>
        </nav>


      </header>

      <hr />

      {modal && (
        <div
          className="modal d-block"
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-labelledby="taskmanager-modal-title"
          style={{ backgroundColor: 'rgba(15, 23, 42, 0.45)', zIndex: 1055 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="taskmanager-modal-title">
                  {modal.type === 'success'
                    ? 'Operación exitosa'
                    : modal.type === 'error'
                      ? 'Ocurrió un error'
                      : 'Confirmar acción'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Cerrar"
                  onClick={() => setModal(null)}
                  disabled={modalBusy}
                />
              </div>
              <div className="modal-body">
                <p className="mb-0">{modal.message}</p>
              </div>
              <div className="modal-footer">
                {modal.type === 'confirm' ? (
                  <>
                    <button type="button" className="btn btn-secondary" onClick={() => setModal(null)} disabled={modalBusy}>
                      Cancelar
                    </button>
                    <button type="button" className="btn btn-primary" onClick={confirmModalAction} disabled={modalBusy}>
                      {modalBusy ? 'Procesando...' : modal.confirmText || 'Confirmar'}
                    </button>
                  </>
                ) : (
                  <button type="button" className="btn btn-primary" onClick={() => setModal(null)}>
                    Aceptar
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {success && <p role="status">{success}</p>}
      {error && <p role="alert">{error}</p>}

      {section === 'tasks' && (
        <>
          {canManageTasks && (
            <>
              <TaskForm onCreate={handleCreateTask} />
              <hr />
            </>
          )}

          {editingTask && (
            <TaskEditForm
              key={editingTask.Id ?? editingTask.id}
              task={editingTask}
              onSave={handleUpdateTask}
              onCancel={() => setEditingTask(null)}
            />
          )}

          <section>
            <h2>Tareas registradas</h2>

            <button
              type="button"
              onClick={loadTasks}
              disabled={loading}
            >
              {loading ? 'Consultando...' : 'Ver tareas registradas'}
            </button>

            {showTasks && !loading && (
              <>
                <p>Total de tareas visibles: {tasks.length}</p>

                {tasks.length === 0 ? (
                  <p>No hay tareas registradas.</p>
                ) : (
                  <table border="1" cellPadding="10">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Título</th>
                        <th>Departamento</th>
                        <th>Asignado a</th>
                        <th>Estado</th>
                        <th>Prioridad</th>
                        <th>Fecha límite</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>

                    <tbody>
                      {tasks.map((task) => {
                        const id = task.Id ?? task.id;

                        return (
                          <tr key={id}>
                            <td>{id}</td>
                            <td>{task.Title ?? task.title}</td>
                            <td>
                              {task.DepartmentName ??
                                task.departmentName ??
                                task.DepartmentId ??
                                task.departmentId}
                            </td>
                            <td>
                              {task.AssignedToName ??
                                task.assignedToName ??
                                task.AssignedTo ??
                                task.assignedTo}
                            </td>
                            <td>{task.Status ?? task.status}</td>
                            <td>{task.Priority ?? task.priority}</td>
                            <td>
                              {String(
                                task.DueDate ?? task.dueDate ?? ''
                              ).slice(0, 10) || 'Sin fecha'}
                            </td>
                            <td>

                              <button
                                type="button"
                                className="btn-editar"
                                onClick={() => {
                                  setEditingTask(task);
                                  setSuccess('');
                                }}
                              >
                                Editar
                              </button>

                              {canManageTasks && (
                                <button
                                  type="button"
                                  className="btn-eliminar"
                                  onClick={() => handleDeleteTask(task)}
                                  disabled={deletingId === id}
                                >
                                  {deletingId === id
                                    ? 'Eliminando...'
                                    : 'Eliminar'}
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </>
            )}
          </section>
        </>
      )}

      {section === 'users' && isAdmin && (
        <section>
          <h2>Administrar usuarios</h2>

          <button
            type="button"
            onClick={loadUsers}
            disabled={usersLoading}
          >
            {usersLoading ? 'Consultando...' : 'Actualizar usuarios'}
          </button>

          {!usersLoading && (
            <table border="1" cellPadding="10">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Departamento</th>
                  <th>Rol actual</th>
                  <th>Cambiar rol</th>
                </tr>
              </thead>

              <tbody>
                {users.map((registeredUser) => {
                  const id = registeredUser.Id ?? registeredUser.id;
                  const email = registeredUser.Email ?? registeredUser.email;
                  const role = registeredUser.Role ?? registeredUser.role;

                  const isMainAdmin =
                    email?.toLowerCase() === mainAdminEmail;

                  const isOwnAccount =
                    id === (user?.id ?? user?.Id);

                  return (
                    <tr key={id}>
                      <td>{id}</td>
                      <td>
                        {registeredUser.Name ?? registeredUser.name}
                      </td>
                      <td>{email}</td>
                      <td>
                        {({
                          1: 'Recursos Humanos',
                          2: 'Tecnología',
                          3: 'Finanzas',
                          4: 'Operaciones',
                        })[registeredUser.DepartmentId ?? registeredUser.departmentId] || 'Sin departamento'}
                      </td>
                      <td>{role}</td>
                      <td>
                        {isMainAdmin ? (
                          <strong>Administrador principal</strong>
                        ) : isOwnAccount ? (
                          <span>No puedes cambiar tu propio rol</span>
                        ) : (
                          <select
                            value={role}
                            disabled={savingUserId === id}
                            onChange={(event) =>
                              handleChangeRole(id, event.target.value)
                            }
                          >
                            <option value="employee">Empleado</option>
                            <option value="manager">Gerente</option>
                            <option value="admin">Administrador</option>
                          </select>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </section>
      )}
    </main>
  );
}

export default Dashboard;