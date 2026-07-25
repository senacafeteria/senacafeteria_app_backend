import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export type TipoProveedor = 'interno' | 'externo'

export type CategoriaProveedor =
  | 'panaderia'
  | 'lacteos_granja'
  | 'insumos_secos'
  | 'higiene_epp'
  | 'empaque'
  | 'carnes'
  | 'frutas_verduras'
  | 'otros'

export type FrecuenciaEntrega = 'diaria' | 'semanal' | 'quincenal' | 'mensual' | 'ocasional'

export type EstadoProveedor = 'activo' | 'inactivo'

export default class Proveedor extends BaseModel {
  static table = 'proveedores'

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare nombre: string

  @column()
  declare tipo: TipoProveedor

  @column()
  declare categoria: CategoriaProveedor

  @column()
  declare productosResumen: string | null

  @column()
  declare frecuenciaEntrega: FrecuenciaEntrega | null

  @column()
  declare contactoNombre: string | null

  @column()
  declare contactoTelefono: string | null

  @column()
  declare contactoCorreo: string | null

  @column()
  declare ciudad: string | null

  @column()
  declare estado: EstadoProveedor

  @column()
  declare observaciones: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @column.dateTime()
  declare deletedAt: DateTime | null // soft delete
}
