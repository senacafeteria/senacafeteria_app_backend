import { BaseModel, column } from '@adonisjs/lucid/orm'

const decimalTransform = {
  consume: (value: string | null) => (value === null ? null : Number(value)),
}

export default class ProduccionInsumoCalculado extends BaseModel {
  static table = 'produccion_insumos_calculados'

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare produccionDiariaId: string

  @column()
  declare productoId: string

  @column(decimalTransform)
  declare cantidadRequerida: number

  @column(decimalTransform)
  declare cantidadDescontada: number

  @column()
  declare movimientoId: string | null
}
