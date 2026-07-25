import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Producto from '#models/inventario/producto'

export default class CategoriaProducto extends BaseModel {
  static table = 'categorias_producto'

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare nombre: string

  @column()
  declare icono: string | null

  @column()
  declare colorHex: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @hasMany(() => Producto, { foreignKey: 'categoriaId' })
  declare productos: HasMany<typeof Producto>
}
