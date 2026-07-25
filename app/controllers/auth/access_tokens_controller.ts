import { DateTime } from 'luxon'
import Usuario from '#models/auth/usuario'
import { loginValidator } from '#validators/auth/usuario'
import type { HttpContext } from '@adonisjs/core/http'
import UsuarioTransformer from '#transformers/auth/usuario_transformer'

export default class AccessTokensController {
  async store({ request, serialize }: HttpContext) {
    const { identificador, contrasena } = await request.validateUsing(loginValidator)

    // Permite ingresar con correo O nombre de usuario indistintamente
    const usuario = await Usuario.verifyCredentials(identificador, contrasena)
    const token = await Usuario.accessTokens.create(usuario)

    // Actualiza último acceso y reinicia contador de intentos fallidos
    usuario.ultimoAccesoAt = DateTime.now()
    usuario.intentosFallidos = 0
    await usuario.save()

    return serialize({
      usuario: UsuarioTransformer.transform(usuario),
      token: token.value!.release(),
    })
  }

  async destroy({ auth }: HttpContext) {
    const usuario = auth.getUserOrFail()
    if (usuario.currentAccessToken) {
      await Usuario.accessTokens.delete(usuario, usuario.currentAccessToken.identifier)
    }

    return {
      message: 'Sesión cerrada correctamente',
    }
  }
}
