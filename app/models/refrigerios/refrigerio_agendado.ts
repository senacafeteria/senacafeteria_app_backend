import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Receta from '#models/produccion/receta'
import FichaGrupo from '#models/refrigerios/ficha_grupo'
import Usuario from '#models/auth/usuario'
import RefrigerioDespacho from '#models/refrigerios/refrigerio_despacho'

export type OrigenRefrigerio = 'cafeteria' | 'panaderia'
export type EstadoAgendamiento = 'programado' | 'por_confirmar' | 'entregado' | 'cancelado'

const decimalTransform = {
  consume: (value: string | null) => (value === null ? null : Number(value)),
}

export default class RefrigerioAgendado extends BaseModel {
  static table = 'refrigerios_agendados'

  @column({ isPrimary: true })
  declare id: string

  @column.date()
  declare fechaEntrega: DateTime

  @column()
  declare recetaId: string

  @column(decimalTransform)
  declare cantidad: number

  @column()
  declare origen: OrigenRefrigerio

  @column()
  declare fichaId: string

  @column()
  declare notas: string | null

  @column()
  declare estado: EstadoAgendamiento

  @column()
  declare createdBy: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Receta, { foreignKey: 'recetaId' })
  declare receta: BelongsTo<typeof Receta>

  @belongsTo(() => FichaGrupo, { foreignKey: 'fichaId' })
  declare ficha: BelongsTo<typeof FichaGrupo>

  @belongsTo(() => Usuario, { foreignKey: 'createdBy' })
  declare creadoPor: BelongsTo<typeof Usuario>

  @hasMany(() => RefrigerioDespacho, { foreignKey: 'agendamientoId' })
  declare despachos: HasMany<typeof RefrigerioDespacho>
}
