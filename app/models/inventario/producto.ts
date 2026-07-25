import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import CategoriaProducto from '#models/inventario/categoria_producto'
import Ubicacion from '#models/inventario/ubicacion'
import LoteProducto from '#models/inventario/lote_producto'
import MovimientoInventario from '#models/inventario/movimiento_inventario'
import Merma from '#models/inventario/merma'
import Proveedor from '#models/proveedores/proveedor'
import RecepcionItem from '#models/proveedores/recepcion_item'
import RecetaInsumo from '#models/produccion/receta_insumo'
import Usuario from '#models/auth/usuario'

export type UnidadMedida =
  | 'litros'
  | 'kilogramos'
  | 'gramos'
  | 'mililitros'
  | 'unidades'
  | 'cajas'
  | 'paquetes'

export type EstadoProducto = 'activo' | 'inactivo'

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

  // Relaciones "belongsTo"
  @belongsTo(() => CategoriaProducto, { foreignKey: 'categoriaId' })
  declare categoria: BelongsTo<typeof CategoriaProducto>

  @belongsTo(() => Ubicacion, { foreignKey: 'ubicacionAutomaticaId' })
  declare ubicacionAutomatica: BelongsTo<typeof Ubicacion>

  @belongsTo(() => Proveedor, { foreignKey: 'proveedorId' })
  declare proveedor: BelongsTo<typeof Proveedor>

  @belongsTo(() => Usuario, { foreignKey: 'createdBy' })
  declare creadoPor: BelongsTo<typeof Usuario>

  // Relaciones "hasMany"
  @hasMany(() => LoteProducto, { foreignKey: 'productoId' })
  declare lotes: HasMany<typeof LoteProducto>

  @hasMany(() => MovimientoInventario, { foreignKey: 'productoId' })
  declare movimientos: HasMany<typeof MovimientoInventario>

  @hasMany(() => Merma, { foreignKey: 'productoId' })
  declare mermas: HasMany<typeof Merma>

  @hasMany(() => RecetaInsumo, { foreignKey: 'productoId' })
  declare usosEnRecetas: HasMany<typeof RecetaInsumo>

  @hasMany(() => RecepcionItem, { foreignKey: 'productoId' })
  declare itemsRecepcion: HasMany<typeof RecepcionItem>
}
