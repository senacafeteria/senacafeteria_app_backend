import vine from '@vinejs/vine'

const motivosMerma = [
  'vencimiento',
  'mal_estado',
  'error_preparacion',
  'deterioro_empaque',
  'otro',
] as const

/**
 * Validador para "Registrar Merma y Dar de Baja" (Gestión de Insumos →
 * pestaña Mermas y Desperdicios).
 */
export const registrarMermaValidator = vine.create({
  productoId: vine.string().uuid(),
  loteId: vine.string().uuid().optional(),
  cantidad: vine.number().positive(),
  motivo: vine.enum(motivosMerma),
  fecha: vine.date({ formats: ['YYYY-MM-DD'] }),
  responsableId: vine.string().uuid(),
  observaciones: vine.string().trim().optional(),
})
