import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Recepcion from '#models/proveedores/recepcion'
import Producto from '#models/inventario/producto'
import LoteProducto from '#models/inventario/lote_producto'

export type EstadoDiferencia = 'sin_diferencia' | 'excedente' | 'faltante'

const decimalTransform = {
  consume: (value: string | null) => (value === null ? null : Number(value)),
}

export default class RecepcionItem extends BaseModel {
  static table = 'recepcion_items'

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare recepcionId: string

  @column()
  declare productoId: string

  @column(decimalTransform)
  declare cantidadSolicitada: number | null

  @column(decimalTransform)
  declare cantidadRecibida: number

  @column()
  declare unidad: string

  @column()
  declare estadoDiferencia: EstadoDiferencia

  @column()
  declare loteId: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @belongsTo(() => Recepcion, { foreignKey: 'recepcionId' })
  declare recepcion: BelongsTo<typeof Recepcion>

  @belongsTo(() => Producto, { foreignKey: 'productoId' })
  declare producto: BelongsTo<typeof Producto>

  @belongsTo(() => LoteProducto, { foreignKey: 'loteId' })
  declare lote: BelongsTo<typeof LoteProducto>
}
