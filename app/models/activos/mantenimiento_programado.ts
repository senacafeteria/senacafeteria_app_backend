import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Activo from '#models/activos/activo'
import Usuario from '#models/auth/usuario'

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

  @belongsTo(() => Activo, { foreignKey: 'activoId' })
  declare activo: BelongsTo<typeof Activo>

  @belongsTo(() => Usuario, { foreignKey: 'createdBy' })
  declare creadoPor: BelongsTo<typeof Usuario>
}
