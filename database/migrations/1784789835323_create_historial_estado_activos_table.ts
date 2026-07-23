import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'historial_estado_activos'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))

      table.uuid('activo_id').notNullable().references('id').inTable('activos').onDelete('CASCADE')

      table
        .enu('estado_anterior', null, {
          useNative: true,
          enumName: 'estado_activo_fisico',
          existingType: true,
        })
        .notNullable()

      table
        .enu('estado_nuevo', null, {
          useNative: true,
          enumName: 'estado_activo_fisico',
          existingType: true,
        })
        .notNullable()

      table.text('motivo').nullable()

      table
        .uuid('responsable_id')
        .notNullable()
        .references('id')
        .inTable('usuarios')
        .onDelete('RESTRICT')

      table
        .uuid('aviso_urgente_id')
        .nullable()
        .references('id')
        .inTable('avisos_urgentes')
        .onDelete('SET NULL')

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
    })

    this.schema.raw(
      'CREATE INDEX historial_estado_activos_activo_id_index ' +
        'ON historial_estado_activos (activo_id)'
    )
    this.schema.raw(
      'CREATE INDEX historial_estado_activos_created_at_index ' +
        'ON historial_estado_activos (created_at)'
    )
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
