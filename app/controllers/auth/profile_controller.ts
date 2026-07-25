import UsuarioTransformer from '#transformers/auth/usuario_transformer'
import type { HttpContext } from '@adonisjs/core/http'

export default class ProfileController {
  async show({ auth, serialize }: HttpContext) {
    return serialize(UsuarioTransformer.transform(auth.getUserOrFail()))
  }
}
