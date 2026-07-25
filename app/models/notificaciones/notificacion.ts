import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Usuario from '#models/auth/usuario'

export type TipoNotificacion =
  | 'stock_critico'
  | 'vencimiento_proximo'
  | 'merma_registrada'
  | 'refrigerio_sin_confirmar'
  | 'recepcion_diferencias'
  | 'mantenimiento_pendiente'
  | 'aviso_urgente'
  | 'intento_fallido'
  | 'cuenta_bloqueada'

export default class Notificacion extends BaseModel {
  static table = 'notificaciones'

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare usuarioDestinatarioId: string

  @column()
  declare tipo: TipoNotificacion

  @column()
  declare titulo: string

  @column()
  declare mensaje: string

  @column()
  declare leida: boolean

  // Referencia polimórfica — igual patrón que en eventos_trazabilidad,
  // sin relación Lucid
  @column()
  declare moduloOrigen: string | null

  @column()
  declare referenciaId: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @belongsTo(() => Usuario, { foreignKey: 'usuarioDestinatarioId' })
  declare destinatario: BelongsTo<typeof Usuario>
}
