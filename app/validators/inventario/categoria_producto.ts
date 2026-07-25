import vine from '@vinejs/vine'

export const crearCategoriaProductoValidator = vine.create({
  nombre: vine
    .string()
    .trim()
    .maxLength(100)
    .unique({ table: 'categorias_producto', column: 'nombre' }),
  icono: vine.string().trim().maxLength(10).optional(),
  colorHex: vine
    .string()
    .trim()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .optional(),
})

export const actualizarCategoriaProductoValidator = vine.create({
  nombre: vine.string().trim().maxLength(100).optional(),
  icono: vine.string().trim().maxLength(10).optional(),
  colorHex: vine
    .string()
    .trim()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .optional(),
})
