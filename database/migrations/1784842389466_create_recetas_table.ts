import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'recetas'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))

      table.string('nombre', 150).notNullable()

      table
        .enu('categoria', null, {
          useNative: true,
          enumName: 'categoria_receta',
          existingType: true,
        })
        .notNullable()

      table.decimal('rendimiento_base', 10, 2).notNullable()
      table.string('rendimiento_unidad', 30).notNullable()
      table.string('foto_url', 255).nullable()

      table.uuid('created_by').nullable().references('id').inTable('usuarios').onDelete('SET NULL')

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).nullable()
      table.timestamp('deleted_at', { useTz: true }).nullable() // soft delete
    })

    this.schema.raw('CREATE INDEX recetas_nombre_index ' + 'ON recetas (nombre)')
    this.schema.raw('CREATE INDEX recetas_categoria_index ' + 'ON recetas (categoria)')
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
