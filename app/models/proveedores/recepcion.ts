import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

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
}
