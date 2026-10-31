import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  const [showTasks, setShowTasks] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [modal, setModal] = useState(null);
  const [modalBusy, setModalBusy] = useState(false);

  const [section, setSection] = useState('tasks');
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [savingUserId, setSavingUserId] = useState(null);

  // Normalizar el rol.
  const currentRole = String(user?.role ?? user?.Role ?? '')
    .trim()
    .toLowerCase();

  const isAdmin = ['admin', 'administrador'].includes(currentRole);
  const isManager = ['manager', 'gerente'].includes(currentRole);

  // Permisos por rol.
  const canManageTasks = isAdmin || isManager;
  const canManageUsers = isAdmin;

  const mainAdminEmail = 'prueba.taskmanager@example.com';

  const queryClient = useQueryClient();

  // Consultar tareas.
  const {
    data: tasks = [],
    isFetching: loading,
    error: tasksError,
    refetch: refetchTasks,
  } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const response = await getTasks();

      console.log('Respuesta del Gateway:', response);

      if (Array.isArray(response)) return response;
      if (Array.isArray(response?.tasks)) return response.tasks;
      if (Array.isArray(response?.data?.tasks)) return response.data.tasks;
      if (Array.isArray(response?.data)) return response.data;

      throw new Error('Formato de respuesta de tareas no reconocido');
    },
    enabled: showTasks && section === 'tasks',
  });

  // Crear tareas.
  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });

  // Actualizar tareas.
  const updateTaskMutation = useMutation({
    mutationFn: ({ id, data }) => updateTask(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });

  // Eliminar tareas.
  const deleteTaskMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });

  async function loadTasks() {
    setError('');

    if (!showTasks) {
      setShowTasks(true);
    } else {
      await refetchTasks();
    }
  }

  async function handleCreateTask(task) {
    setError('');
    setSuccess('');

    try {
      await createTaskMutation.mutateAsync(task);
      setShowTasks(true);

      setModal({
        type: 'success',
        message: '¡La tarea se ha creado con éxito!',
      });
    } catch (err) {
      setError(err?.message || 'No se pudo crear la tarea');
      throw err;
    }
  }

  async function handleUpdateTask(data) {
    const id = editingTask.Id ?? editingTask.id;

    setError('');
    setSuccess('');

    try {
      await updateTaskMutation.mutateAsync({ id, data });

      setEditingTask(null);
      setShowTasks(true);

      setModal({
        type: 'success',
        message: '¡Los cambios se han guardado con éxito!',
      });
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
      await deleteTaskMutation.mutateAsync(id);

      setModal({
        type: 'success',
        message: '¡La tarea se ha eliminado con éxito!',
      });
    } catch (err) {
      setError(err?.message || 'No se pudo eliminar la tarea');

      setModal({
        type: 'error',
        message: err?.message || 'No se pudo eliminar la tarea',
      });
    } finally {
      setDeletingId(null);
    }
  }

  // Consultar usuarios.
  async function loadUsers() {
    setUsersLoading(true);
    setError('');

    try {
      const data = await getUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.message || 'No se pudieron consultar los usuarios');
    } finally {
      setUsersLoading(false);
    }
  }

  // Solicitar confirmación para cambiar el rol.
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

      setModal({
        type: 'success',
        message: '¡El rol del usuario se ha actualizado con éxito!',
      });

      await loadUsers();
    } catch (err) {
      setError(err?.message || 'No se pudo actualizar el rol');

      setModal({
        type: 'error',
        message: err?.message || 'No se pudo actualizar el rol',
      });
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
          Rol: <strong>{user?.role || user?.Role}</strong>
        </p>

        <nav className="menu-principal">

          {/* Solo el Administrador puede ver el botón Tareas */}
          {isAdmin && (
            <button
              type="button"
              className="btn-tareas"
              onClick={openTasks}
            >
              Tareas
            </button>
          )}

          {/* Solo el Administrador puede administrar usuarios */}
          {canManageUsers && (
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

      {/* Ventana de confirmación y mensajes */}
      {modal && (
        <div
          className="modal d-block"
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-labelledby="taskmanager-modal-title"
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.45)',
            zIndex: 1055,
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">

              <div className="modal-header">
                <h5
                  className="modal-title"
                  id="taskmanager-modal-title"
                >
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
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setModal(null)}
                      disabled={modalBusy}
                    >
                      Cancelar
                    </button>

                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={confirmModalAction}
                      disabled={modalBusy}
                    >
                      {modalBusy
                        ? 'Procesando...'
                        : modal.confirmText || 'Confirmar'}
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setModal(null)}
                  >
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

      {showTasks && section === 'tasks' && tasksError && (
        <p role="alert">
          {tasksError.message || 'No se pudieron cargar las tareas'}
        </p>
      )}

      {/* SECCIÓN DE TAREAS */}
      {section === 'tasks' && (
        <>
          {/* Solo Admin y Manager pueden crear tareas */}
          {canManageTasks && (
            <>
              <TaskForm onCreate={handleCreateTask} />
              <hr />
            </>
          )}

          {/* Solo Admin y Manager pueden editar */}
          {editingTask && canManageTasks && (
            <TaskEditForm
              key={editingTask.Id ?? editingTask.id}
              task={editingTask}
              onSave={handleUpdateTask}
              onCancel={() => setEditingTask(null)}
            />
          )}

          <section>
            <h2>Tareas registradas</h2>

            {/* Todos los roles pueden consultar tareas */}
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

                            <td>
                              {task.Title ?? task.title}
                            </td>

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

                            <td>
                              {task.Status ?? task.status}
                            </td>

                            <td>
                              {task.Priority ?? task.priority}
                            </td>

                            <td>
                              {String(
                                task.DueDate ?? task.dueDate ?? ''
                              ).slice(0, 10) || 'Sin fecha'}
                            </td>

                            <td>
                              {/* Solo Admin y Manager pueden editar y eliminar */}
                              {canManageTasks && (
                                <>
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
                                </>
                              )}

                              {!canManageTasks && (
                                <span>Solo consulta</span>
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

      {/* SECCIÓN DE ADMINISTRACIÓN DE USUARIOS */}
      {section === 'users' && canManageUsers && (
        <section>
          <h2>Administrar usuarios</h2>

          <button
            type="button"
            onClick={loadUsers}
            disabled={usersLoading}
          >
            {usersLoading
              ? 'Consultando...'
              : 'Actualizar usuarios'}
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

                  const email = (
                    registeredUser.Email ?? registeredUser.email ?? ''
                  ).trim().toLowerCase();

                  const role = String(
                    registeredUser.Role ?? registeredUser.role ?? ''
                  ).trim().toLowerCase();

                  const isMainAdmin = email === mainAdminEmail;

                  const currentUserId = user?.id ?? user?.Id;

                  const isOwnAccount =
                    String(id) === String(currentUserId);

                  const departmentId =
                    registeredUser.DepartmentId ??
                    registeredUser.departmentId;

                  const departments = {
                    1: 'Recursos Humanos',
                    2: 'Tecnología',
                    3: 'Finanzas',
                    4: 'Operaciones',
                  };

                  return (
                    <tr key={id}>
                      <td>{id}</td>

                      <td>
                        {registeredUser.Name ?? registeredUser.name}
                      </td>

                      <td>{email}</td>

                      <td>
                        {departments[departmentId] || 'Sin departamento'}
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