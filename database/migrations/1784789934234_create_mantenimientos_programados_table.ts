import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'mantenimientos_programados'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))

      table.uuid('activo_id').notNullable().references('id').inTable('activos').onDelete('CASCADE')

      table.string('titulo', 150).notNullable()
      table.date('fecha_programada').notNullable()
      table.string('responsable_texto', 150).nullable() // ej. "Técnico Externo: CoffeMax"

      table
        .enu('estado', null, {
          useNative: true,
          enumName: 'estado_mantenimiento',
          existingType: true,
        })
        .notNullable()
        .defaultTo('pendiente')

      table.text('notas').nullable()

      table.uuid('created_by').nullable().references('id').inTable('usuarios').onDelete('SET NULL')

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).nullable()
    })

    this.schema.raw(
      'CREATE INDEX mantenimientos_activo_id_index ' + 'ON mantenimientos_programados (activo_id)'
    )
    this.schema.raw(
      'CREATE INDEX mantenimientos_fecha_index ' +
        'ON mantenimientos_programados (fecha_programada)'
    )
    this.schema.raw(
      'CREATE INDEX mantenimientos_estado_index ' + 'ON mantenimientos_programados (estado)'
    )
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
