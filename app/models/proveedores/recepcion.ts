import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Proveedor from '#models/proveedores/proveedor'
import Usuario from '#models/auth/usuario'
import RecepcionItem from '#models/proveedores/recepcion_item'
import LoteProducto from '#models/inventario/lote_producto'

export default class Recepcion extends BaseModel {
  static table = 'recepciones'

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare proveedorId: string

  @column()
  declare numeroRemision: string | null

  @column.date()
  declare fechaRecepcion: DateTime

  @column()
  declare numeroLote: string | null

  @column()
  declare esPrempacado: boolean | null

  @column()
  declare responsableId: string

  @column()
  declare observaciones: string | null

  @column()
  declare tieneDiferencias: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @belongsTo(() => Proveedor, { foreignKey: 'proveedorId' })
  declare proveedor: BelongsTo<typeof Proveedor>

  @belongsTo(() => Usuario, { foreignKey: 'responsableId' })
  declare responsable: BelongsTo<typeof Usuario>

  @hasMany(() => RecepcionItem, { foreignKey: 'recepcionId' })
  declare items: HasMany<typeof RecepcionItem>

  @hasMany(() => LoteProducto, { foreignKey: 'recepcionId' })
  declare lotesGenerados: HasMany<typeof LoteProducto>
}
