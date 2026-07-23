import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'recepcion_items'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))

      table
        .uuid('recepcion_id')
        .notNullable()
        .references('id')
        .inTable('recepciones')
        .onDelete('CASCADE')

      table
        .uuid('producto_id')
        .notNullable()
        .references('id')
        .inTable('productos')
        .onDelete('RESTRICT')

      table.decimal('cantidad_solicitada', 10, 2).nullable()
      table.decimal('cantidad_recibida', 10, 2).notNullable()
      table.string('unidad', 20).notNullable()

      table
        .enu('estado_diferencia', null, {
          useNative: true,
          enumName: 'estado_diferencia',
          existingType: true,
        })
        .notNullable()
        .defaultTo('sin_diferencia')

      table
        .uuid('lote_id')
        .nullable()
        .references('id')
        .inTable('lotes_producto')
        .onDelete('SET NULL')

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
    })

    this.schema.raw(
      'CREATE INDEX recepcion_items_recepcion_id_index ' + 'ON recepcion_items (recepcion_id)'
    )
    this.schema.raw(
      'CREATE INDEX recepcion_items_producto_id_index ' + 'ON recepcion_items (producto_id)'
    )
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
