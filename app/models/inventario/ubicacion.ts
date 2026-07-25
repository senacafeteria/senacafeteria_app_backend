import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Producto from '#models/inventario/producto'
import LoteProducto from '#models/inventario/lote_producto'

export default class Ubicacion extends BaseModel {
  static table = 'ubicaciones'

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare nombre: string

  @column()
  declare descripcion: string | null

  @column()
  declare activa: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @hasMany(() => Producto, { foreignKey: 'ubicacionAutomaticaId' })
  declare productos: HasMany<typeof Producto>

  @hasMany(() => LoteProducto, { foreignKey: 'ubicacionId' })
  declare lotes: HasMany<typeof LoteProducto>
}
