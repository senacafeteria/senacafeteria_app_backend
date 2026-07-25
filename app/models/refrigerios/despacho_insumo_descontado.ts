import { BaseModel, column } from '@adonisjs/lucid/orm'

const decimalTransform = {
  consume: (value: string | null) => (value === null ? null : Number(value)),
}

export default class DespachoInsumoDescontado extends BaseModel {
  static table = 'despacho_insumos_descontados'

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare despachoId: string

  @column()
  declare productoId: string

  @column(decimalTransform)
  declare cantidadDescontada: number

  @column()
  declare movimientoId: string | null
}
