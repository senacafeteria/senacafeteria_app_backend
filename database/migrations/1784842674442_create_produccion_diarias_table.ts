import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'produccion_diaria'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))

      table.date('fecha').notNullable()

      table.uuid('receta_id').notNullable().references('id').inTable('recetas').onDelete('RESTRICT')

      table.decimal('cantidad_a_preparar', 10, 2).notNullable()
      table.string('unidad', 20).notNullable()

      table
        .enu('estado', null, {
          useNative: true,
          enumName: 'estado_produccion',
          existingType: true,
        })
        .notNullable()
        .defaultTo('planeada')

      table
        .uuid('created_by')
        .notNullable()
        .references('id')
        .inTable('usuarios')
        .onDelete('RESTRICT')

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
    })

    this.schema.raw('CREATE INDEX produccion_diaria_fecha_index ' + 'ON produccion_diaria (fecha)')
    this.schema.raw(
      'CREATE INDEX produccion_diaria_receta_id_index ' + 'ON produccion_diaria (receta_id)'
    )
    this.schema.raw(
      'CREATE INDEX produccion_diaria_estado_index ' + 'ON produccion_diaria (estado)'
    )
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
