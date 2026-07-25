import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

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
}
