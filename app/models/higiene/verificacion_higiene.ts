import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Usuario from '#models/auth/usuario'
import VerificacionHigieneItem from '#models/higiene/verificacion_higiene_item'

export type EstadoVerificacion = 'completo' | 'con_faltante'

export default class VerificacionHigiene extends BaseModel {
  static table = 'verificaciones_higiene'

  @column({ isPrimary: true })
  declare id: string

  @column.date()
  declare fecha: DateTime

  @column()
  declare personasEnCocina: number

  @column()
  declare observaciones: string | null

  @column()
  declare estado: EstadoVerificacion

  @column()
  declare verificadoPor: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @belongsTo(() => Usuario, { foreignKey: 'verificadoPor' })
  declare verificador: BelongsTo<typeof Usuario>

  @hasMany(() => VerificacionHigieneItem, { foreignKey: 'verificacionId' })
  declare items: HasMany<typeof VerificacionHigieneItem>
}
