import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Usuario from '#models/auth/usuario'
import RecetaInsumo from '#models/produccion/receta_insumo'
import ProduccionDiaria from '#models/produccion/produccion_diaria'
import Minuta from '#models/minuta/minuta'
import RefrigerioAgendado from '#models/refrigerios/refrigerio_agendado'
import RefrigerioDespacho from '#models/refrigerios/refrigerio_despacho'

export type CategoriaReceta = 'refrigerio' | 'almuerzo' | 'postre' | 'preparacion_interna' | 'otro'

const decimalTransform = {
  consume: (value: string | null) => (value === null ? null : Number(value)),
}

export default class Receta extends BaseModel {
  static table = 'recetas'

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare nombre: string

  @column()
  declare categoria: CategoriaReceta

  @column(decimalTransform)
  declare rendimientoBase: number

  @column()
  declare rendimientoUnidad: string

  @column()
  declare fotoUrl: string | null

  @column()
  declare createdBy: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @column.dateTime()
  declare deletedAt: DateTime | null // soft delete

  @belongsTo(() => Usuario, { foreignKey: 'createdBy' })
  declare creadoPor: BelongsTo<typeof Usuario>

  @hasMany(() => RecetaInsumo, { foreignKey: 'recetaId' })
  declare insumos: HasMany<typeof RecetaInsumo>

  @hasMany(() => ProduccionDiaria, { foreignKey: 'recetaId' })
  declare produccionesDiarias: HasMany<typeof ProduccionDiaria>

  @hasMany(() => Minuta, { foreignKey: 'recetaId' })
  declare usosEnMinuta: HasMany<typeof Minuta>

  @hasMany(() => RefrigerioAgendado, { foreignKey: 'recetaId' })
  declare agendamientos: HasMany<typeof RefrigerioAgendado>

  @hasMany(() => RefrigerioDespacho, { foreignKey: 'recetaId' })
  declare despachos: HasMany<typeof RefrigerioDespacho>
}
