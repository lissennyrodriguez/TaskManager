
const { z } = require('zod');

const taskSchema = z.object({
  title: z.string()
    .trim()
    .min(1, 'El título es obligatorio')
    .max(150),

  description: z.string()
    .max(2000)
    .optional()
    .default(''),

  departmentId: z.coerce.number()
    .int()
    .positive('El departamento no es válido'),

  assignedTo: z.coerce.number()
    .int()
    .positive('El responsable no es válido'),

  priority: z.enum([
    'baja',
    'media',
    'alta',
    'urgente',
  ]).optional().default('media'),

  status: z.enum([
    'pendiente',
    'en_progreso',
    'completada',
    'cancelada',
  ]).optional().default('pendiente'),

  dueDate: z.union([
    z.iso.date(),
    z.literal(''),
    z.null(),
  ]).optional().transform((value) => value || null),
}).strict();

// Para permitir que un empleado envíe únicamente el nuevo estado.
const taskStatusSchema = z.object({
  status: z.enum([
    'pendiente',
    'en_progreso',
    'completada',
    'cancelada',
  ]),
}).strict();

module.exports = {
  taskSchema,
  taskStatusSchema,
};
