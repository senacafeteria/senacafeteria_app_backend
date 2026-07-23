import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'categorias_producto'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))

      table.string('nombre', 100).notNullable().unique()
      table.string('icono', 10).nullable() // emoji o clave de ícono, ej. "🥛"
      table.string('color_hex', 7).nullable() // ej. "#1F5C99"

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).nullable()
    })

    this.schema.raw('CREATE INDEX categorias_producto_nombre_index ON categorias_producto (nombre)')
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
