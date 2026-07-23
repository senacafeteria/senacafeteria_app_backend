import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'fichas_grupos'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))

      table.string('numero_ficha', 30).notNullable().unique()
      table.string('nombre_programa', 150).notNullable()
      table.string('instructor_nombre', 150).notNullable()
      table.string('instructor_correo', 150).nullable()
      table.string('instructor_extension', 30).nullable()
      table.integer('numero_aprendices').nullable()

      table
        .enu('estado', null, {
          useNative: true,
          enumName: 'estado_activo_inactivo',
          existingType: true,
        })
        .notNullable()
        .defaultTo('activo')

      table.text('observaciones').nullable()

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).nullable()
      table.timestamp('deleted_at', { useTz: true }).nullable() // soft delete
    })

    this.schema.raw(
      'CREATE INDEX fichas_grupos_numero_ficha_index ' + 'ON fichas_grupos (numero_ficha)'
    )
    this.schema.raw('CREATE INDEX fichas_grupos_estado_index ' + 'ON fichas_grupos (estado)')
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
