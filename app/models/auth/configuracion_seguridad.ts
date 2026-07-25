import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class ConfiguracionSeguridad extends BaseModel {
  static table = 'configuracion_seguridad'

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare longitudMinContrasena: number

  @column()
  declare requiereLetrasNumeros: boolean

  @column()
  declare diasExpiracionContrasena: number

  @column()
  declare maxIntentosFallidos: number

  @column()
  declare minutosBloqueo: number

  @column()
  declare minutosInactividadSesion: number

  @column()
  declare rateLimitingActivo: boolean

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
