import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

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

  // Referencia polimórfica — apunta a la fila de origen en otra tabla
  // (recepciones, produccion_diaria, refrigerios_despachos, mermas, etc.)
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
}
