import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import LoteProducto from '#models/inventario/lote_producto'
import Usuario from '#models/auth/usuario'

export type TipoEventoTrazabilidad =
  | 'ingreso'
  | 'ubicacion_asignada'
  | 'uso_produccion'
  | 'despacho'
  | 'merma'
  | 'estado_actual'

const decimalTransform = {
  consume: (value: string | null) => (value === null ? null : Number(value)),
}

export default class EventoTrazabilidad extends BaseModel {
  static table = 'eventos_trazabilidad'

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare loteId: string

  @column()
  declare tipoEvento: TipoEventoTrazabilidad

  @column.dateTime()
  declare fecha: DateTime

  @column(decimalTransform)
  declare cantidad: number | null

  // Referencia polimórfica — sin relación Lucid, se resuelve en el
  // servicio de Trazabilidad según el valor de referenciaTipo
  @column()
  declare referenciaTipo: string | null

  @column()
  declare referenciaId: string | null

  @column()
  declare responsableId: string

  @column()
  declare descripcion: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @belongsTo(() => LoteProducto, { foreignKey: 'loteId' })
  declare lote: BelongsTo<typeof LoteProducto>

  @belongsTo(() => Usuario, { foreignKey: 'responsableId' })
  declare responsable: BelongsTo<typeof Usuario>
}
