import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

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
}
