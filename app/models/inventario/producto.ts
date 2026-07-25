import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export type UnidadMedida =
  | 'litros'
  | 'kilogramos'
  | 'gramos'
  | 'mililitros'
  | 'unidades'
  | 'cajas'
  | 'paquetes'

export type EstadoProducto = 'activo' | 'inactivo'

// Transforma los DECIMAL de PostgreSQL (que llegan como string) a number
const decimalTransform = {
  consume: (value: string | null) => (value === null ? null : Number(value)),
}

export default class Producto extends BaseModel {
  static table = 'productos'

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare nombre: string

  @column()
  declare descripcion: string | null

  @column()
  declare categoriaId: string

  @column()
  declare unidadMedida: UnidadMedida

  @column()
  declare esPerecedero: boolean

  @column()
  declare diasVencimientoEstimado: number | null

  @column(decimalTransform)
  declare stockMinimo: number

  @column()
  declare ubicacionAutomaticaId: string | null

  @column()
  declare proveedorId: string | null

  @column()
  declare fotoUrl: string | null

  @column()
  declare estado: EstadoProducto

  @column()
  declare createdBy: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @column.dateTime()
  declare deletedAt: DateTime | null // soft delete
}
