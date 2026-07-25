import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Producto from '#models/inventario/producto'
import Ubicacion from '#models/inventario/ubicacion'
import MovimientoInventario from '#models/inventario/movimiento_inventario'
import Merma from '#models/inventario/merma'
import Proveedor from '#models/proveedores/proveedor'
import Recepcion from '#models/proveedores/recepcion'
import EventoTrazabilidad from '#models/trazabilidad/evento_trazabilidad'
import Usuario from '#models/auth/usuario'

export type EstadoLote = 'en_stock' | 'agotado' | 'con_merma' | 'vencido'

const decimalTransform = {
  consume: (value: string | null) => (value === null ? null : Number(value)),
}

export default class LoteProducto extends BaseModel {
  static table = 'lotes_producto'

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare productoId: string

  @column()
  declare numeroLote: string | null

  @column()
  declare proveedorId: string | null

  @column()
  declare recepcionId: string | null

  @column(decimalTransform)
  declare cantidadInicial: number

  @column(decimalTransform)
  declare cantidadActual: number

  @column.date()
  declare fechaIngreso: DateTime

  @column.date()
  declare fechaVencimientoEstimada: DateTime | null

  @column()
  declare ubicacionId: string | null

  @column()
  declare responsableId: string

  @column()
  declare estado: EstadoLote

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  // Relaciones "belongsTo"
  @belongsTo(() => Producto, { foreignKey: 'productoId' })
  declare producto: BelongsTo<typeof Producto>

  @belongsTo(() => Proveedor, { foreignKey: 'proveedorId' })
  declare proveedor: BelongsTo<typeof Proveedor>

  @belongsTo(() => Recepcion, { foreignKey: 'recepcionId' })
  declare recepcion: BelongsTo<typeof Recepcion>

  @belongsTo(() => Ubicacion, { foreignKey: 'ubicacionId' })
  declare ubicacion: BelongsTo<typeof Ubicacion>

  @belongsTo(() => Usuario, { foreignKey: 'responsableId' })
  declare responsable: BelongsTo<typeof Usuario>

  // Relaciones "hasMany"
  @hasMany(() => MovimientoInventario, { foreignKey: 'loteId' })
  declare movimientos: HasMany<typeof MovimientoInventario>

  @hasMany(() => Merma, { foreignKey: 'loteId' })
  declare mermas: HasMany<typeof Merma>

  @hasMany(() => EventoTrazabilidad, { foreignKey: 'loteId' })
  declare eventosTrazabilidad: HasMany<typeof EventoTrazabilidad>
}
