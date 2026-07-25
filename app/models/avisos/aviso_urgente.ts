import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Producto from '#models/inventario/producto'
import Activo from '#models/activos/activo'
import Usuario from '#models/auth/usuario'
import Merma from '#models/inventario/merma'
import HistorialEstadoActivo from '#models/activos/historial_estado_activo'

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

  // Relaciones "belongsTo"
  @belongsTo(() => Producto, { foreignKey: 'productoId' })
  declare producto: BelongsTo<typeof Producto>

  @belongsTo(() => Activo, { foreignKey: 'activoId' })
  declare activo: BelongsTo<typeof Activo>

  @belongsTo(() => Usuario, { foreignKey: 'reportadoPor' })
  declare reportante: BelongsTo<typeof Usuario>

  @belongsTo(() => Usuario, { foreignKey: 'revisadoPor' })
  declare revisor: BelongsTo<typeof Usuario>

  // Relaciones "hasMany" — hacia lo que se generó al confirmar el aviso
  @hasMany(() => Merma, { foreignKey: 'avisoUrgenteId' })
  declare mermasGeneradas: HasMany<typeof Merma>

  @hasMany(() => HistorialEstadoActivo, { foreignKey: 'avisoUrgenteId' })
  declare cambiosEstadoGenerados: HasMany<typeof HistorialEstadoActivo>
}
