import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export type EstadoProduccion = 'planeada' | 'iniciada' | 'completada'

const decimalTransform = {
  consume: (value: string | null) => (value === null ? null : Number(value)),
}

export default class ProduccionDiaria extends BaseModel {
  static table = 'produccion_diaria'

  @column({ isPrimary: true })
  declare id: string

  @column.date()
  declare fecha: DateTime

  @column()
  declare recetaId: string

  @column(decimalTransform)
  declare cantidadAPreparar: number

  @column()
  declare unidad: string

  @column()
  declare estado: EstadoProduccion

  @column()
  declare createdBy: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
}
