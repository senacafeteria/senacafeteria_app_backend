import vine from '@vinejs/vine'

const motivosSalida = ['consumo_produccion', 'despacho_grupo', 'transferencia', 'otro'] as const

/**
 * Validador para "Registrar Entrada" (Gestión de Insumos → pestaña
 * Registrar Entrada / Salida, modo Entrada).
 */
export const registrarEntradaValidator = vine.create({
  productoId: vine.string().uuid(),
  cantidad: vine.number().positive(),
  fechaOperacion: vine.date({ formats: ['YYYY-MM-DD'] }),
  responsableId: vine.string().uuid(),
  numeroLote: vine.string().trim().maxLength(100).optional(),
  numeroRemision: vine.string().trim().maxLength(100).optional(),
  observaciones: vine.string().trim().optional(),
})

/**
 * Validador para "Registrar Salida" (mismo formulario, modo Salida).
 */
export const registrarSalidaValidator = vine.create({
  productoId: vine.string().uuid(),
  cantidad: vine.number().positive(),
  fechaOperacion: vine.date({ formats: ['YYYY-MM-DD'] }),
  motivoSalida: vine.enum(motivosSalida),
  responsableId: vine.string().uuid(),
  observaciones: vine.string().trim().optional(),
})
