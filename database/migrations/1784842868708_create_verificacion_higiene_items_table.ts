import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'verificacion_higiene_items'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))

      table
        .uuid('verificacion_id')
        .notNullable()
        .references('id')
        .inTable('verificaciones_higiene')
        .onDelete('CASCADE')

      table.string('nombre_item', 100).notNullable() // ej. "Gorro / Cofia"
      table.boolean('verificado').notNullable().defaultTo(false)

      table
        .uuid('producto_epp_id')
        .nullable()
        .references('id')
        .inTable('productos')
        .onDelete('SET NULL')

      table.decimal('cantidad_por_persona', 10, 2).nullable()
      table.decimal('cantidad_total_descontada', 10, 2).nullable()

      table
        .uuid('movimiento_id')
        .nullable()
        .references('id')
        .inTable('movimientos_inventario')
        .onDelete('SET NULL')
    })

    this.schema.raw(
      'CREATE INDEX verificacion_higiene_items_verificacion_id_index ' +
        'ON verificacion_higiene_items (verificacion_id)'
    )
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
