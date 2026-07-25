import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export type EstadoMantenimiento = 'pendiente' | 'en_proceso' | 'completado'

export default class MantenimientoProgramado extends BaseModel {
  static table = 'mantenimientos_programados'

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare activoId: string

  @column()
  declare titulo: string

  @column.date()
  declare fechaProgramada: DateTime

  @column()
  declare responsableTexto: string | null

  @column()
  declare estado: EstadoMantenimiento

  @column()
  declare notas: string | null

  @column()
  declare createdBy: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
