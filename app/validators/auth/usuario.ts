import vine from '@vinejs/vine'

/**
 * Reglas compartidas para correo y contraseña.
 */
const correo = () => vine.string().email().maxLength(150)
const contrasena = () => vine.string().minLength(8).maxLength(32)

/**
 * Validador para el registro de nuevos usuarios (lo usa el Administrador
 * o SuperAdmin desde Ajustes → Gestión de Usuarios y Roles).
 */
export const signupValidator = vine.create({
  nombreCompleto: vine.string().trim(),
  correo: correo().unique({ table: 'usuarios', column: 'correo' }),
  nombreUsuario: vine
    .string()
    .trim()
    .regex(/^[a-z0-9._]+$/) // sin espacios, solo minúsculas/números/./_
    .unique({ table: 'usuarios', column: 'nombre_usuario' }),
  rol: vine.enum(['superadmin', 'administrador', 'operario'] as const),
  contrasena: contrasena(),
  contrasenaConfirmacion: contrasena().sameAs('contrasena'),
  extensionContacto: vine.string().trim().optional(),
})

/**
 * Validador para el login. Permite ingresar con correo O nombre de
 * usuario, tal como definimos en el diseño de la pantalla de Login.
 */
export const loginValidator = vine.create({
  identificador: vine.string().trim(), // correo o nombre_usuario
  contrasena: vine.string(),
})
