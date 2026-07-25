import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export type TipoAviso = 'merma' | 'activo_danado'
export type NivelUrgencia = 'baja' | 'media' | 'alta'
export type EstadoAviso = 'pendiente' | 'confirmado' | 'rechazado'

const decimalTransform = {
  consume: (value: string | null) => (value === null ? null : Number(value)),
}

export default class AvisoUrgente extends BaseModel {
  static table = 'avisos_urgentes'

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare tipo: TipoAviso

  @column()
  declare productoId: string | null

  @column()
  declare activoId: string | null

  @column(decimalTransform)
  declare cantidadAfectada: number | null

  @column()
  declare motivo: string | null

  @column()
  declare nivelUrgencia: NivelUrgencia | null

  @column()
  declare descripcion: string

  @column()
  declare fotoUrl: string | null

  @column()
  declare reportadoPor: string

  @column()
  declare estado: EstadoAviso

  @column()
  declare notaRespuestaAdmin: string | null

  @column()
  declare revisadoPor: string | null

  @column.dateTime()
  declare revisadoAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
}
