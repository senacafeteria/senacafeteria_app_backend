import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import type { RolUsuario } from '#models/auth/usuario'

/**
 * Middleware de autorización por rol. Se usa DESPUÉS del middleware de
 * autenticación (`auth`), ya que asume que `auth.user` ya existe.
 *
 * Uso en rutas:
 *   router.post('productos', ...).use(middleware.roles(['administrador', 'superadmin']))
 *
 * Si el usuario autenticado no tiene uno de los roles permitidos,
 * responde 403 con un mensaje claro para que el frontend redirija a
 * la pantalla de "Acceso Denegado" que diseñamos en Stitch.
 */
export default class RolesMiddleware {
  async handle(ctx: HttpContext, next: NextFn, rolesPermitidos: RolUsuario[]) {
    const usuario = ctx.auth.user

    if (!usuario) {
      return ctx.response.unauthorized({
        message: 'Debes iniciar sesión para acceder a este recurso',
      })
    }

    if (!rolesPermitidos.includes(usuario.rol)) {
      return ctx.response.forbidden({
        message: 'No tienes permiso para realizar esta acción',
        rolActual: usuario.rol,
        rolesPermitidos,
      })
    }

    return next()
  }
}
