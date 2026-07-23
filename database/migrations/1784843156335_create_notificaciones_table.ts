import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'notificaciones'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))

      table
        .uuid('usuario_destinatario_id')
        .notNullable()
        .references('id')
        .inTable('usuarios')
        .onDelete('CASCADE')

      table
        .enu('tipo', null, {
          useNative: true,
          enumName: 'tipo_notificacion',
          existingType: true,
        })
        .notNullable()

      table.string('titulo', 150).notNullable()
      table.text('mensaje').notNullable()
      table.boolean('leida').notNullable().defaultTo(false)

      // Referencia polimórfica: apunta al módulo/registro que originó la notificación
      table.string('modulo_origen', 50).nullable()
      table.uuid('referencia_id').nullable()

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
    })

    this.schema.raw(
      'CREATE INDEX notificaciones_usuario_destinatario_index ' +
        'ON notificaciones (usuario_destinatario_id)'
    )
    this.schema.raw('CREATE INDEX notificaciones_leida_index ' + 'ON notificaciones (leida)')
    this.schema.raw(
      'CREATE INDEX notificaciones_created_at_index ' + 'ON notificaciones (created_at)'
    )
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
