import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Usuario from '#models/auth/usuario'

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

  @belongsTo(() => Usuario, { foreignKey: 'usuarioId' })
  declare usuario: BelongsTo<typeof Usuario>
}
