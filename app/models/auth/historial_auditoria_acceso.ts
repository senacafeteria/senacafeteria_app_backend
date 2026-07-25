import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Usuario from '#models/auth/usuario'

export type TipoEventoAuditoria =
  | 'inicio_sesion'
  | 'cierre_sesion'
  | 'intento_fallido'
  | 'cuenta_bloqueada'

export type ResultadoAuditoria = 'exitoso' | 'fallido' | 'bloqueado'

export default class HistorialAuditoriaAcceso extends BaseModel {
  static table = 'historial_auditoria_accesos'

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare usuarioId: string | null

  @column()
  declare tipoEvento: TipoEventoAuditoria

  @column()
  declare ipAddress: string | null

  @column()
  declare dispositivo: string | null

  @column()
  declare resultado: ResultadoAuditoria

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @belongsTo(() => Usuario, { foreignKey: 'usuarioId' })
  declare usuario: BelongsTo<typeof Usuario>
}
