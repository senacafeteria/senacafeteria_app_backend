import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    // ALTER TYPE ADD VALUE no puede revertirse (PostgreSQL no permite
    // quitar valores de un enum), por eso el down() queda documentado
    // pero sin acción real — ver nota abajo.
    this.schema.raw("ALTER TYPE motivo_salida ADD VALUE IF NOT EXISTS 'merma'")
  }

  async down() {
    // PostgreSQL no soporta eliminar un valor de un ENUM directamente.
    // Si algún día se necesita revertir esto de verdad, hay que recrear
    // el tipo completo (crear uno nuevo, migrar la columna, borrar el
    // viejo) — se documenta aquí en vez de intentar un dropback parcial
    // que fallaría.
  }
}
