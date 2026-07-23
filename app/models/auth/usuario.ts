import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { type AccessToken, DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'

export type RolUsuario = 'superadmin' | 'administrador' | 'operario'
export type EstadoUsuario = 'activo' | 'inactivo'

const AuthFinder = withAuthFinder(hash, {
  uids: ['correo', 'nombreUsuario'],
  passwordColumnName: 'contrasenaHash',
})

export default class Usuario extends compose(BaseModel, AuthFinder) {
  static table = 'usuarios'

  static accessTokens = DbAccessTokensProvider.forModel(Usuario)
  declare currentAccessToken?: AccessToken

  @column({ isPrimary: true })
  declare id: string

  // Información personal
  @column()
  declare nombreCompleto: string

  @column()
  declare correo: string

  @column()
  declare nombreUsuario: string

  @column()
  declare extensionContacto: string | null

  @column()
  declare fotoPerfilUrl: string | null

  // Acceso y seguridad
  @column({ serializeAs: null })
  declare contrasenaHash: string

  @column()
  declare rol: RolUsuario

  @column()
  declare debeCambiarContrasena: boolean

  @column()
  declare intentosFallidos: number

  @column.dateTime()
  declare bloqueadoHasta: DateTime | null

  @column.dateTime()
  declare ultimoAccesoAt: DateTime | null

  // Estado de la cuenta
  @column()
  declare estado: EstadoUsuario

  // Timestamps
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @column.dateTime()
  declare deletedAt: DateTime | null // soft delete

  get initials() {
    const [first, last] = this.nombreCompleto
      ? this.nombreCompleto.split(' ')
      : this.correo.split('@')
    if (first && last) {
      return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase()
    }
    return `${first.slice(0, 2)}`.toUpperCase()
  }
}
