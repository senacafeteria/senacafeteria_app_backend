import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import type { OrigenRefrigerio } from '#models/refrigerios/refrigerio_agendado'

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

  @column.dateTime()
  declare confirmadoAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
}
