import vine from '@vinejs/vine'

export const crearUbicacionValidator = vine.create({
  nombre: vine.string().trim().maxLength(150).unique({ table: 'ubicaciones', column: 'nombre' }),
  descripcion: vine.string().trim().optional(),
  activa: vine.boolean().optional(),
})

export const actualizarUbicacionValidator = vine.create({
  nombre: vine.string().trim().maxLength(150).optional(),
  descripcion: vine.string().trim().optional(),
  activa: vine.boolean().optional(),
})
