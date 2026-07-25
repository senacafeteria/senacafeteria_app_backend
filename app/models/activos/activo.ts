import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import CategoriaActivo from '#models/activos/categoria_activo'
import HistorialEstadoActivo from '#models/activos/historial_estado_activo'
import MantenimientoProgramado from '#models/activos/mantenimiento_programado'
import AvisoUrgente from '#models/avisos/aviso_urgente'
import Usuario from '#models/auth/usuario'

export type EstadoActivoFisico =
  | 'operativo'
  | 'en_mantenimiento'
  | 'fuera_servicio'
  | 'requiere_reposicion'

export default class Activo extends BaseModel {
  static table = 'activos'

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare codigo: string

  @column()
  declare nombre: string

  @column()
  declare categoriaId: string

  @column()
  declare cantidad: number

  @column()
  declare unidad: string | null

  @column()
  declare ubicacion: string

  @column()
  declare estado: EstadoActivoFisico

  @column.date()
  declare fechaIngreso: DateTime

  @column()
  declare responsableId: string | null

  @column()
  declare fotoUrl: string | null

  @column()
  declare observaciones: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @column.dateTime()
  declare deletedAt: DateTime | null // soft delete

  // Relaciones "belongsTo"
  @belongsTo(() => CategoriaActivo, { foreignKey: 'categoriaId' })
  declare categoria: BelongsTo<typeof CategoriaActivo>

  @belongsTo(() => Usuario, { foreignKey: 'responsableId' })
  declare responsable: BelongsTo<typeof Usuario>

  // Relaciones "hasMany"
  @hasMany(() => HistorialEstadoActivo, { foreignKey: 'activoId' })
  declare historialEstados: HasMany<typeof HistorialEstadoActivo>

  @hasMany(() => MantenimientoProgramado, { foreignKey: 'activoId' })
  declare mantenimientos: HasMany<typeof MantenimientoProgramado>

  @hasMany(() => AvisoUrgente, { foreignKey: 'activoId' })
  declare avisosUrgentes: HasMany<typeof AvisoUrgente>
}
