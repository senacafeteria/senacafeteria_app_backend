import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class SesionActiva extends BaseModel {
  static table = 'sesiones_activas'

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare usuarioId: string

  @column()
  declare token: string

  @column()
  declare ipAddress: string | null

  @column()
  declare dispositivo: string | null

  @column.dateTime()
  declare iniciadaAt: DateTime

  @column.dateTime()
  declare expiraAt: DateTime
}
