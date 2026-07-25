import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Activo from '#models/activos/activo'

export default class CategoriaActivo extends BaseModel {
  static table = 'categorias_activo'

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

  @hasMany(() => Activo, { foreignKey: 'categoriaId' })
  declare activos: HasMany<typeof Activo>
}
