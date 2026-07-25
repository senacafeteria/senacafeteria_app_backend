import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Receta from '#models/produccion/receta'
import Usuario from '#models/auth/usuario'

export type TiempoComida = 'desayuno' | 'almuerzo' | 'refrigerio'

const decimalTransform = {
  consume: (value: string | null) => (value === null ? null : Number(value)),
}

export default class Minuta extends BaseModel {
  static table = 'minuta'

  @column({ isPrimary: true })
  declare id: string

  @column.date()
  declare fecha: DateTime

  @column()
  declare tiempoComida: TiempoComida

  @column()
  declare recetaId: string

  @column(decimalTransform)
  declare cantidadPlaneada: number | null

  @column()
  declare createdBy: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Receta, { foreignKey: 'recetaId' })
  declare receta: BelongsTo<typeof Receta>

  @belongsTo(() => Usuario, { foreignKey: 'createdBy' })
  declare creadoPor: BelongsTo<typeof Usuario>
}
