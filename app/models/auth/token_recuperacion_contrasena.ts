import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Usuario from '#models/auth/usuario'

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

  @belongsTo(() => Usuario, { foreignKey: 'usuarioId' })
  declare usuario: BelongsTo<typeof Usuario>
}
