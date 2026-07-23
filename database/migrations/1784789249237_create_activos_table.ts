import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'activos'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))

      table.string('codigo', 30).notNullable().unique()
      table.string('nombre', 150).notNullable()

      table
        .uuid('categoria_id')
        .notNullable()
        .references('id')
        .inTable('categorias_activo')
        .onDelete('RESTRICT')

      table.integer('cantidad').notNullable().defaultTo(1)
      table.string('unidad', 30).nullable() // unidades, piezas, kits, juegos

      table.string('ubicacion', 150).notNullable()

      table
        .enu('estado', null, {
          useNative: true,
          enumName: 'estado_activo_fisico',
          existingType: true,
        })
        .notNullable()
        .defaultTo('operativo')

      table.date('fecha_ingreso').notNullable()

      table
        .uuid('responsable_id')
        .nullable()
        .references('id')
        .inTable('usuarios')
        .onDelete('SET NULL')

      table.string('foto_url', 255).nullable()
      table.text('observaciones').nullable()

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).nullable()
      table.timestamp('deleted_at', { useTz: true }).nullable() // soft delete
    })

    this.schema.raw('CREATE INDEX activos_codigo_index ' + 'ON activos (codigo)')
    this.schema.raw('CREATE INDEX activos_categoria_id_index ' + 'ON activos (categoria_id)')
    this.schema.raw('CREATE INDEX activos_estado_index ' + 'ON activos (estado)')
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
