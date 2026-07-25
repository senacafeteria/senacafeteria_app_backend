import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import type { EstadoActivoFisico } from '#models/activos/activo'

export default class HistorialEstadoActivo extends BaseModel {
  static table = 'historial_estado_activos'

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare activoId: string

  @column()
  declare estadoAnterior: EstadoActivoFisico

  @column()
  declare estadoNuevo: EstadoActivoFisico

  @column()
  declare motivo: string | null

  @column()
  declare responsableId: string

  @column()
  declare avisoUrgenteId: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
}
