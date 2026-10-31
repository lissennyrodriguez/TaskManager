
const { z } = require('zod');

const registerSchema = z.object({
  name: z.string()
    .trim()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100),

  email: z.email('El correo electrónico no es válido'),

  password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres'),

  departmentId: z.coerce.number()
    .int()
    .positive('El departamento no es válido'),
});

const loginSchema = z.object({
  email: z.email('El correo electrónico no es válido'),

  password: z.string()
    .min(1, 'La contraseña es obligatoria'),
});

module.exports = {
  registerSchema,
  loginSchema,
};