import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tokens_recuperacion_contrasena'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))

      table
        .uuid('usuario_id')
        .notNullable()
        .references('id')
        .inTable('usuarios')
        .onDelete('CASCADE')

      table.string('token', 255).notNullable().unique()
      table.timestamp('expira_at', { useTz: true }).notNullable()
      table.boolean('usado').notNullable().defaultTo(false)

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
    })

    this.schema.raw(
      'CREATE INDEX tokens_recuperacion_usuario_id_index ' +
        'ON tokens_recuperacion_contrasena (usuario_id)'
    )
    this.schema.raw(
      'CREATE INDEX tokens_recuperacion_token_index ' + 'ON tokens_recuperacion_contrasena (token)'
    )
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
