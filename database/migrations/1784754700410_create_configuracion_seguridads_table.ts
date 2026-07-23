import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'configuracion_seguridad'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))

      table.integer('longitud_min_contrasena').notNullable().defaultTo(8)
      table.boolean('requiere_letras_numeros').notNullable().defaultTo(true)
      table.integer('dias_expiracion_contrasena').notNullable().defaultTo(90)
      table.integer('max_intentos_fallidos').notNullable().defaultTo(3)
      table.integer('minutos_bloqueo').notNullable().defaultTo(10)
      table.integer('minutos_inactividad_sesion').notNullable().defaultTo(30)
      table.boolean('rate_limiting_activo').notNullable().defaultTo(true)

      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
