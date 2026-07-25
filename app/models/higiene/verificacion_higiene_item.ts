import { BaseModel, column } from '@adonisjs/lucid/orm'

const decimalTransform = {
  consume: (value: string | null) => (value === null ? null : Number(value)),
}

export default class VerificacionHigieneItem extends BaseModel {
  static table = 'verificacion_higiene_items'

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare verificacionId: string

  @column()
  declare nombreItem: string

  @column()
  declare verificado: boolean

  @column()
  declare productoEppId: string | null

  @column(decimalTransform)
  declare cantidadPorPersona: number | null

  @column(decimalTransform)
  declare cantidadTotalDescontada: number | null

  @column()
  declare movimientoId: string | null
}
