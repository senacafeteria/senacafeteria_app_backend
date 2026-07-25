import vine from '@vinejs/vine'

const unidadesMedida = [
  'litros',
  'kilogramos',
  'gramos',
  'mililitros',
  'unidades',
  'cajas',
  'paquetes',
] as const

/**
 * Validador para crear un producto (Catálogo de Productos → "+ Agregar
 * Nuevo Producto"). Solo Administrador y SuperAdmin pueden usarlo.
 */
export const crearProductoValidator = vine.create({
  nombre: vine.string().trim().maxLength(150),
  descripcion: vine.string().trim().optional(),
  categoriaId: vine.string().uuid(),
  unidadMedida: vine.enum(unidadesMedida),
  esPerecedero: vine.boolean(),

  // Solo obligatorio si esPerecedero = true
  diasVencimientoEstimado: vine
    .number()
    .positive()
    .optional()
    .requiredWhen('esPerecedero', '=', true),

  stockMinimo: vine.number().min(0),
  ubicacionAutomaticaId: vine.string().uuid().optional(),
  proveedorId: vine.string().uuid().optional(),
  fotoUrl: vine.string().trim().optional(),
})

/**
 * Validador para editar un producto existente. Todos los campos son
 * opcionales porque puede ser una edición parcial.
 */
export const actualizarProductoValidator = vine.create({
  nombre: vine.string().trim().maxLength(150).optional(),
  descripcion: vine.string().trim().optional(),
  categoriaId: vine.string().uuid().optional(),
  unidadMedida: vine.enum(unidadesMedida).optional(),
  esPerecedero: vine.boolean().optional(),
  diasVencimientoEstimado: vine.number().positive().optional(),
  stockMinimo: vine.number().min(0).optional(),
  ubicacionAutomaticaId: vine.string().uuid().optional(),
  proveedorId: vine.string().uuid().optional(),
  fotoUrl: vine.string().trim().optional(),
  estado: vine.enum(['activo', 'inactivo'] as const).optional(),
})
