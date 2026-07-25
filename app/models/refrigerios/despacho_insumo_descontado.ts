import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import RefrigerioDespacho from '#models/refrigerios/refrigerio_despacho'
import Producto from '#models/inventario/producto'
import MovimientoInventario from '#models/inventario/movimiento_inventario'

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

  @belongsTo(() => RefrigerioDespacho, { foreignKey: 'despachoId' })
  declare despacho: BelongsTo<typeof RefrigerioDespacho>

  @belongsTo(() => Producto, { foreignKey: 'productoId' })
  declare producto: BelongsTo<typeof Producto>

  @belongsTo(() => MovimientoInventario, { foreignKey: 'movimientoId' })
  declare movimiento: BelongsTo<typeof MovimientoInventario>
}
