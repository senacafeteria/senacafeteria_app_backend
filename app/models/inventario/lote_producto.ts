import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

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
}
