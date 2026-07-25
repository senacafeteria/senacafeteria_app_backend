import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Usuario from '#models/auth/usuario'

export type FormatoReporte = 'pdf' | 'excel'

export default class ReporteGenerado extends BaseModel {
  static table = 'reportes_generados'

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare nombre: string

  @column()
  declare modulo: string

  @column()
  declare tipoReporte: string | null

  @column()
  declare generadoPor: string

  @column.date()
  declare periodoInicio: DateTime | null

  @column.date()
  declare periodoFin: DateTime | null

  @column()
  declare formato: FormatoReporte

  @column()
  declare archivoUrl: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @belongsTo(() => Usuario, { foreignKey: 'generadoPor' })
  declare generadoPorUsuario: BelongsTo<typeof Usuario>
}
