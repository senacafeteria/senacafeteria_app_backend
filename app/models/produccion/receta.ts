import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

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
}
