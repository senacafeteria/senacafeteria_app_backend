import { BaseModel, column } from '@adonisjs/lucid/orm'

const decimalTransform = {
  consume: (value: string | null) => (value === null ? null : Number(value)),
}

export default class RecetaInsumo extends BaseModel {
  static table = 'receta_insumos'

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare recetaId: string

  @column()
  declare productoId: string

  @column(decimalTransform)
  declare cantidad: number

  @column()
  declare unidad: string
}
