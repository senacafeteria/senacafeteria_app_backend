import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'sesiones_activas'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))

      table
        .uuid('usuario_id')
        .notNullable()
        .references('id')
        .inTable('usuarios')
        .onDelete('CASCADE')

      table.string('token', 500).notNullable()
      table.string('ip_address', 45).nullable() // 45 soporta IPv6
      table.string('dispositivo', 150).nullable() // ej. "Chrome / Windows"

      table.timestamp('iniciada_at', { useTz: true }).notNullable()
      table.timestamp('expira_at', { useTz: true }).notNullable()
    })

    this.schema.raw(
      'CREATE INDEX sesiones_activas_usuario_id_index ON sesiones_activas (usuario_id)'
    )
    this.schema.raw('CREATE INDEX sesiones_activas_expira_at_index ON sesiones_activas (expira_at)')
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
