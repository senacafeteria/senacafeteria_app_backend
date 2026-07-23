import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'produccion_insumos_calculados'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))

      table
        .uuid('produccion_diaria_id')
        .notNullable()
        .references('id')
        .inTable('produccion_diaria')
        .onDelete('CASCADE')

      table
        .uuid('producto_id')
        .notNullable()
        .references('id')
        .inTable('productos')
        .onDelete('RESTRICT')

      table.decimal('cantidad_requerida', 10, 2).notNullable()
      table.decimal('cantidad_descontada', 10, 2).notNullable()

      table
        .uuid('movimiento_id')
        .nullable()
        .references('id')
        .inTable('movimientos_inventario')
        .onDelete('SET NULL')
    })

    this.schema.raw(
      'CREATE INDEX produccion_insumos_produccion_id_index ' +
        'ON produccion_insumos_calculados (produccion_diaria_id)'
    )
    this.schema.raw(
      'CREATE INDEX produccion_insumos_producto_id_index ' +
        'ON produccion_insumos_calculados (producto_id)'
    )
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
