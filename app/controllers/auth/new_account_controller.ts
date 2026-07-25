import Usuario from '#models/auth/usuario'
import { signupValidator } from '#validators/auth/usuario'
import type { HttpContext } from '@adonisjs/core/http'
import UsuarioTransformer from '#transformers/auth/usuario_transformer'

export default class NewAccountController {
  /**
   * Crea un nuevo usuario. Ruta protegida — solo Administrador y
   * SuperAdmin pueden acceder (el middleware de rol se agrega en
   * start/routes.ts más adelante).
   */
  async store({ request, serialize }: HttpContext) {
    const { nombreCompleto, correo, nombreUsuario, rol, contrasena, extensionContacto } =
      await request.validateUsing(signupValidator)

    const usuario = await Usuario.create({
      nombreCompleto,
      correo,
      nombreUsuario,
      rol,
      contrasenaHash: contrasena, // el modelo hashea automáticamente al guardar
      extensionContacto: extensionContacto ?? null,
      debeCambiarContrasena: true,
      estado: 'activo',
    })

    return serialize({
      usuario: UsuarioTransformer.transform(usuario),
    })
  }
}
