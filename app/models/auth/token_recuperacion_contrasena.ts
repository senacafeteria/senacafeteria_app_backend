import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class TokenRecuperacionContrasena extends BaseModel {
  static table = 'tokens_recuperacion_contrasena'

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare usuarioId: string

  @column()
  declare token: string

  @column.dateTime()
  declare expiraAt: DateTime

  @column()
  declare usado: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
}
