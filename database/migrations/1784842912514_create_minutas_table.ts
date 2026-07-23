import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'minuta'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))

      table.date('fecha').notNullable()

      table
        .enu('tiempo_comida', null, {
          useNative: true,
          enumName: 'tiempo_comida',
          existingType: true,
        })
        .notNullable()

      table.uuid('receta_id').notNullable().references('id').inTable('recetas').onDelete('RESTRICT')

      table.decimal('cantidad_planeada', 10, 2).nullable()

      table
        .uuid('created_by')
        .notNullable()
        .references('id')
        .inTable('usuarios')
        .onDelete('RESTRICT')

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).nullable()

      // Solo una receta asignada por día y tiempo de comida
      table.unique(['fecha', 'tiempo_comida'])
    })

    this.schema.raw('CREATE INDEX minuta_fecha_index ' + 'ON minuta (fecha)')
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
