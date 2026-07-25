import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import VerificacionHigiene from '#models/higiene/verificacion_higiene'
import Producto from '#models/inventario/producto'
import MovimientoInventario from '#models/inventario/movimiento_inventario'

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

  @belongsTo(() => VerificacionHigiene, { foreignKey: 'verificacionId' })
  declare verificacion: BelongsTo<typeof VerificacionHigiene>

  @belongsTo(() => Producto, { foreignKey: 'productoEppId' })
  declare productoEpp: BelongsTo<typeof Producto>

  @belongsTo(() => MovimientoInventario, { foreignKey: 'movimientoId' })
  declare movimiento: BelongsTo<typeof MovimientoInventario>
}
