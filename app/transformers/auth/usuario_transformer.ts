import type Usuario from '#models/auth/usuario'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class UsuarioTransformer extends BaseTransformer<Usuario> {
  toObject() {
    return this.pick(this.resource, [
      'id',
      'nombreCompleto',
      'correo',
      'nombreUsuario',
      'rol',
      'estado',
      'extensionContacto',
      'fotoPerfilUrl',
      'debeCambiarContrasena',
      'ultimoAccesoAt',
      'createdAt',
      'updatedAt',
      'initials',
    ])
  }
}