import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import RefrigerioAgendado from '#models/refrigerios/refrigerio_agendado'
import RefrigerioDespacho from '#models/refrigerios/refrigerio_despacho'

export type EstadoFicha = 'activo' | 'inactivo'

export default class FichaGrupo extends BaseModel {
  static table = 'fichas_grupos'

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare numeroFicha: string

  @column()
  declare nombrePrograma: string

  @column()
  declare instructorNombre: string

  @column()
  declare instructorCorreo: string | null

  @column()
  declare instructorExtension: string | null

  @column()
  declare numeroAprendices: number | null

  @column()
  declare estado: EstadoFicha

  @column()
  declare observaciones: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @column.dateTime()
  declare deletedAt: DateTime | null // soft delete

  @hasMany(() => RefrigerioAgendado, { foreignKey: 'fichaId' })
  declare agendamientos: HasMany<typeof RefrigerioAgendado>

  @hasMany(() => RefrigerioDespacho, { foreignKey: 'fichaId' })
  declare despachos: HasMany<typeof RefrigerioDespacho>
}
