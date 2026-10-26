
import { useState } from 'react';

function TaskEditForm({ task, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: task.Title ?? task.title ?? '',
    description: task.Description ?? task.description ?? '',
    departmentId: String(task.DepartmentId ?? task.departmentId ?? 2),
    assignedTo: String(task.AssignedTo ?? task.assignedTo ?? 1),
    priority: task.Priority ?? task.priority ?? 'media',
    status: task.Status ?? task.status ?? 'pendiente',
    dueDate: String(task.DueDate ?? task.dueDate ?? '').slice(0, 10),
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError('');

    try {
      await onSave({
        ...form,
        departmentId: Number(form.departmentId),
        assignedTo: Number(form.assignedTo),
        dueDate: form.dueDate || null,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section>
      <h2>Editar tarea</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="edit-title">Título</label>
          <input
            id="edit-title"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="edit-description">Descripción</label>
          <textarea
            id="edit-description"
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="edit-department">Departamento</label>
          <select
            id="edit-department"
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

        <div>
          <label htmlFor="edit-assigned">ID del usuario asignado</label>
          <input
            id="edit-assigned"
            name="assignedTo"
            type="number"
            min="1"
            value={form.assignedTo}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="edit-priority">Prioridad</label>
          <select
            id="edit-priority"
            name="priority"
            value={form.priority}
            onChange={handleChange}
          >
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
            <option value="urgente">Urgente</option>
          </select>
        </div>

        <div>
          <label htmlFor="edit-status">Estado</label>
          <select
            id="edit-status"
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option value="pendiente">Pendiente</option>
            <option value="en_progreso">En progreso</option>
            <option value="completada">Completada</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>

        <div>
          <label htmlFor="edit-due-date">Fecha límite</label>
          <input
            id="edit-due-date"
            name="dueDate"
            type="date"
            value={form.dueDate}
            onChange={handleChange}
          />
        </div>

        {error && <p role="alert">{error}</p>}

        
              <button
                  type="submit"
                  className="btn-guardar"
                  disabled={saving}
              >
                  {saving ? 'Guardando...' : 'Guardar cambios'}
              </button>

              <button
                  type="button"
                  className="btn-cancelar"
                  onClick={onCancel}
                  disabled={saving}
              >
                  Cancelar
              </button>

      </form>
    </section>
  );
}

export default TaskEditForm;
