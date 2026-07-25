import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Producto from '#models/inventario/producto'
import LoteProducto from '#models/inventario/lote_producto'
import Usuario from '#models/auth/usuario'
import AvisoUrgente from '#models/avisos/aviso_urgente'

export type MotivoMerma =
  | 'vencimiento'
  | 'mal_estado'
  | 'error_preparacion'
  | 'deterioro_empaque'
  | 'otro'

export type OrigenMerma = 'directo' | 'aviso_urgente'

const decimalTransform = {
  consume: (value: string | null) => (value === null ? null : Number(value)),
}

export default class Merma extends BaseModel {
  static table = 'mermas'

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare productoId: string

  @column()
  declare loteId: string | null

  @column(decimalTransform)
  declare cantidad: number

  @column()
  declare unidad: string

  @column()
  declare motivo: MotivoMerma

  @column.date()
  declare fecha: DateTime

  @column()
  declare responsableId: string

  @column()
  declare observaciones: string | null

  @column()
  declare origen: OrigenMerma

  @column()
  declare avisoUrgenteId: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @belongsTo(() => Producto, { foreignKey: 'productoId' })
  declare producto: BelongsTo<typeof Producto>

  @belongsTo(() => LoteProducto, { foreignKey: 'loteId' })
  declare lote: BelongsTo<typeof LoteProducto>

  @belongsTo(() => Usuario, { foreignKey: 'responsableId' })
  declare responsable: BelongsTo<typeof Usuario>

  @belongsTo(() => AvisoUrgente, { foreignKey: 'avisoUrgenteId' })
  declare avisoUrgente: BelongsTo<typeof AvisoUrgente>
}
