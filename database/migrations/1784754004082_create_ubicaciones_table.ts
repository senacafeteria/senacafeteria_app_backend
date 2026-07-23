import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'ubicaciones'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))

      table.string('nombre', 150).notNullable().unique()
      table.string('descripcion', 255).nullable()
      table.boolean('activa').notNullable().defaultTo(true)

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).nullable()
    })

    this.schema.raw('CREATE INDEX ubicaciones_activa_index ON ubicaciones (activa)')
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
