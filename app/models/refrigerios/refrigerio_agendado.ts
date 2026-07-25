import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export type OrigenRefrigerio = 'cafeteria' | 'panaderia'
export type EstadoAgendamiento = 'programado' | 'por_confirmar' | 'entregado' | 'cancelado'

const decimalTransform = {
  consume: (value: string | null) => (value === null ? null : Number(value)),
}

export default class RefrigerioAgendado extends BaseModel {
  static table = 'refrigerios_agendados'

  @column({ isPrimary: true })
  declare id: string

  @column.date()
  declare fechaEntrega: DateTime

  @column()
  declare recetaId: string

  @column(decimalTransform)
  declare cantidad: number

  @column()
  declare origen: OrigenRefrigerio

  @column()
  declare fichaId: string

  @column()
  declare notas: string | null

  @column()
  declare estado: EstadoAgendamiento

  @column()
  declare createdBy: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
