import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'verificaciones_higiene'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))

      table.date('fecha').notNullable()
      table.integer('personas_en_cocina').notNullable()
      table.text('observaciones').nullable()

      table
        .enu('estado', null, {
          useNative: true,
          enumName: 'estado_verificacion',
          existingType: true,
        })
        .notNullable()

      table
        .uuid('verificado_por')
        .notNullable()
        .references('id')
        .inTable('usuarios')
        .onDelete('RESTRICT')

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
    })

    this.schema.raw(
      'CREATE INDEX verificaciones_higiene_fecha_index ' + 'ON verificaciones_higiene (fecha)'
    )
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
