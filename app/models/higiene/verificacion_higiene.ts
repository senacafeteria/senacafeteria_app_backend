import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export type EstadoVerificacion = 'completo' | 'con_faltante'

export default class VerificacionHigiene extends BaseModel {
  static table = 'verificaciones_higiene'

  @column({ isPrimary: true })
  declare id: string

  @column.date()
  declare fecha: DateTime

  @column()
  declare personasEnCocina: number

  @column()
  declare observaciones: string | null

  @column()
  declare estado: EstadoVerificacion

  @column()
  declare verificadoPor: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
}
