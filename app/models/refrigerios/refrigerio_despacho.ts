import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import RefrigerioAgendado, { type OrigenRefrigerio } from '#models/refrigerios/refrigerio_agendado'
import Receta from '#models/produccion/receta'
import FichaGrupo from '#models/refrigerios/ficha_grupo'
import Usuario from '#models/auth/usuario'
import DespachoInsumoDescontado from '#models/refrigerios/despacho_insumo_descontado'

export type TipoDespacho = 'agendado' | 'directo'

const decimalTransform = {
  consume: (value: string | null) => (value === null ? null : Number(value)),
}

export default class RefrigerioDespacho extends BaseModel {
  static table = 'refrigerios_despachos'

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare agendamientoId: string | null

  @column()
  declare tipoDespacho: TipoDespacho

  @column()
  declare recetaId: string

  @column(decimalTransform)
  declare cantidad: number

  @column()
  declare origen: OrigenRefrigerio

  @column()
  declare fichaId: string

  @column()
  declare checklistEmpaqueSellado: boolean

  @column()
  declare checklistServilleta: boolean

  @column()
  declare checklistFechaVerificada: boolean

  @column()
  declare observaciones: string | null

  @column()
  declare responsableId: string

  @column()
  declare registradoPor: string | null

  @column.dateTime()
  declare confirmadoAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @belongsTo(() => RefrigerioAgendado, { foreignKey: 'agendamientoId' })
  declare agendamiento: BelongsTo<typeof RefrigerioAgendado>

  @belongsTo(() => Receta, { foreignKey: 'recetaId' })
  declare receta: BelongsTo<typeof Receta>

  @belongsTo(() => FichaGrupo, { foreignKey: 'fichaId' })
  declare ficha: BelongsTo<typeof FichaGrupo>

  @belongsTo(() => Usuario, { foreignKey: 'responsableId' })
  declare responsable: BelongsTo<typeof Usuario>

  @belongsTo(() => Usuario, { foreignKey: 'registradoPor' })
  declare registradoPorUsuario: BelongsTo<typeof Usuario>

  @hasMany(() => DespachoInsumoDescontado, { foreignKey: 'despachoId' })
  declare insumosDescontados: HasMany<typeof DespachoInsumoDescontado>
}
