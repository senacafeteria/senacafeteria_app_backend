import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Producto from '#models/inventario/producto'
import LoteProducto from '#models/inventario/lote_producto'
import Usuario from '#models/auth/usuario'

export type TipoMovimiento = 'entrada' | 'salida'
export type MotivoSalida = 'consumo_produccion' | 'despacho_grupo' | 'transferencia' | 'otro'

const decimalTransform = {
  consume: (value: string | null) => (value === null ? null : Number(value)),
}

export default class MovimientoInventario extends BaseModel {
  static table = 'movimientos_inventario'

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare productoId: string

  @column()
  declare loteId: string | null

  @column()
  declare tipoMovimiento: TipoMovimiento

  @column(decimalTransform)
  declare cantidad: number

  @column()
  declare unidad: string

  @column.date()
  declare fechaOperacion: DateTime

  @column()
  declare motivoSalida: MotivoSalida | null

  @column()
  declare numeroRemision: string | null

  @column()
  declare responsableId: string

  @column()
  declare observaciones: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @belongsTo(() => Producto, { foreignKey: 'productoId' })
  declare producto: BelongsTo<typeof Producto>

  @belongsTo(() => LoteProducto, { foreignKey: 'loteId' })
  declare lote: BelongsTo<typeof LoteProducto>

  @belongsTo(() => Usuario, { foreignKey: 'responsableId' })
  declare responsable: BelongsTo<typeof Usuario>
}
