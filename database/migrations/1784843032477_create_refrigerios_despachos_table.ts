import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'refrigerios_despachos'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))

      table
        .uuid('agendamiento_id')
        .nullable() // NULL = despacho directo, sin agendamiento previo
        .references('id')
        .inTable('refrigerios_agendados')
        .onDelete('SET NULL')

      table
        .enu('tipo_despacho', null, {
          useNative: true,
          enumName: 'tipo_despacho',
          existingType: true,
        })
        .notNullable()

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

      table.boolean('checklist_empaque_sellado').notNullable().defaultTo(false)
      table.boolean('checklist_servilleta').notNullable().defaultTo(false)
      table.boolean('checklist_fecha_verificada').notNullable().defaultTo(false)

      table.text('observaciones').nullable()

      table
        .uuid('responsable_id')
        .notNullable()
        .references('id')
        .inTable('usuarios')
        .onDelete('RESTRICT')

      table.timestamp('confirmado_at', { useTz: true }).nullable()
      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
    })

    this.schema.raw(
      'CREATE INDEX refrigerios_despachos_ficha_id_index ' + 'ON refrigerios_despachos (ficha_id)'
    )
    this.schema.raw(
      'CREATE INDEX refrigerios_despachos_confirmado_at_index ' +
        'ON refrigerios_despachos (confirmado_at)'
    )
    this.schema.raw(
      'CREATE INDEX refrigerios_despachos_origen_index ' + 'ON refrigerios_despachos (origen)'
    )
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
