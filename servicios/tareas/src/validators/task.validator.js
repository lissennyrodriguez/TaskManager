
const { z } = require('zod');

const createTaskSchema = z.object({
  title: z.string().trim().min(1).max(150),

  description: z.string().max(2000).optional().default(''),

  departmentId: z.number().int().positive(),

  assignedTo: z.number().int().positive(),

  priority: z.enum([
    'baja',
    'media',
    'alta',
    'urgente'
  ]).optional().default('media'),

  status: z.enum([
    'pendiente',
    'en_progreso',
    'completada',
    'cancelada'
  ]).optional().default('pendiente'),

  dueDate: z.union([
    z.iso.date(),
    z.null()
  ]).optional().default(null)
});

module.exports = {
  createTaskSchema
};
