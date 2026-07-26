import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Activo, { type EstadoActivoFisico } from '#models/activos/activo'
import Usuario from '#models/auth/usuario'
import AvisoUrgente from '#models/avisos/aviso_urgente'

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
  declare registradoPor: string | null

  @column()
  declare avisoUrgenteId: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @belongsTo(() => Activo, { foreignKey: 'activoId' })
  declare activo: BelongsTo<typeof Activo>

  @belongsTo(() => Usuario, { foreignKey: 'responsableId' })
  declare responsable: BelongsTo<typeof Usuario>

  @belongsTo(() => Usuario, { foreignKey: 'registradoPor' })
  declare registradoPorUsuario: BelongsTo<typeof Usuario>

  @belongsTo(() => AvisoUrgente, { foreignKey: 'avisoUrgenteId' })
  declare avisoUrgente: BelongsTo<typeof AvisoUrgente>
}
