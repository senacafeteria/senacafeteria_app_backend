import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

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
}
