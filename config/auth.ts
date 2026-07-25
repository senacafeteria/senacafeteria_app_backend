import { defineConfig } from '@adonisjs/auth'
import { sessionGuard, sessionUserProvider } from '@adonisjs/auth/session'
import { tokensGuard, tokensUserProvider } from '@adonisjs/auth/access_tokens'
import type { InferAuthenticators, InferAuthEvents, Authenticators } from '@adonisjs/auth/types'

const authConfig = defineConfig({
  /**
   * Guard usado por defecto cuando no se especifica ninguno.
   */
  default: 'api',

  guards: {
    /**
     * Guard basado en tokens, para autenticación de API sin estado
     * (el que usa React desde el frontend).
     */
    api: tokensGuard({
      provider: tokensUserProvider({
        tokens: 'accessTokens',
        model: () => import('#models/auth/usuario'),
      }),
    }),

    /**
     * Guard basado en sesión, por si en el futuro se necesita
     * autenticación desde el propio navegador (poco usado en
     * este proyecto, pero se deja configurado).
     */
    web: sessionGuard({
      useRememberMeTokens: false,

      provider: sessionUserProvider({
        model: () => import('#models/auth/usuario'),
      }),
    }),
  },
})

export default authConfig

/**
 * Inferencia de tipos a partir de los guards configurados.
 */
declare module '@adonisjs/auth/types' {
  export interface Authenticators extends InferAuthenticators<typeof authConfig> {}
}
declare module '@adonisjs/core/types' {
  interface EventsList extends InferAuthEvents<Authenticators> {}
}
