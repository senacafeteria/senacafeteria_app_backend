import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'despacho_insumos_descontados'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))

      table
        .uuid('despacho_id')
        .notNullable()
        .references('id')
        .inTable('refrigerios_despachos')
        .onDelete('CASCADE')

      table
        .uuid('producto_id')
        .notNullable()
        .references('id')
        .inTable('productos')
        .onDelete('RESTRICT')

      table.decimal('cantidad_descontada', 10, 2).notNullable()

      table
        .uuid('movimiento_id')
        .nullable()
        .references('id')
        .inTable('movimientos_inventario')
        .onDelete('SET NULL')
    })

    this.schema.raw(
      'CREATE INDEX despacho_insumos_despacho_id_index ' +
        'ON despacho_insumos_descontados (despacho_id)'
    )
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
