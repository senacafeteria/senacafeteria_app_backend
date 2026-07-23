import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'refrigerios_agendados'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))

      table.date('fecha_entrega').notNullable()

      table.uuid('receta_id').notNullable().references('id').inTable('recetas').onDelete('RESTRICT')

      table.decimal('cantidad', 10, 2).notNullable()

      table
        .enu('origen', null, {
          useNative: true,
          enumName: 'origen_refrigerio',
          existingType: true,
        })
        .notNullable()

      table
        .uuid('ficha_id')
        .notNullable()
        .references('id')
        .inTable('fichas_grupos')
        .onDelete('RESTRICT')

      table.text('notas').nullable()

      table
        .enu('estado', null, {
          useNative: true,
          enumName: 'estado_agendamiento',
          existingType: true,
        })
        .notNullable()
        .defaultTo('programado')

      table
        .uuid('created_by')
        .notNullable()
        .references('id')
        .inTable('usuarios')
        .onDelete('RESTRICT')

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).nullable()
    })

    this.schema.raw(
      'CREATE INDEX refrigerios_agendados_fecha_index ' + 'ON refrigerios_agendados (fecha_entrega)'
    )
    this.schema.raw(
      'CREATE INDEX refrigerios_agendados_ficha_id_index ' + 'ON refrigerios_agendados (ficha_id)'
    )
    this.schema.raw(
      'CREATE INDEX refrigerios_agendados_estado_index ' + 'ON refrigerios_agendados (estado)'
    )
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
