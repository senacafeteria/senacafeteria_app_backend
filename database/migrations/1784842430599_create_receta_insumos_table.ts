import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'receta_insumos'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))

      table.uuid('receta_id').notNullable().references('id').inTable('recetas').onDelete('CASCADE')

      table
        .uuid('producto_id')
        .notNullable()
        .references('id')
        .inTable('productos')
        .onDelete('RESTRICT')

      table.decimal('cantidad', 10, 2).notNullable()
      table.string('unidad', 20).notNullable()
    })

    this.schema.raw(
      'CREATE INDEX receta_insumos_receta_id_index ' + 'ON receta_insumos (receta_id)'
    )
    this.schema.raw(
      'CREATE INDEX receta_insumos_producto_id_index ' + 'ON receta_insumos (producto_id)'
    )
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
