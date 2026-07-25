import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

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
}
