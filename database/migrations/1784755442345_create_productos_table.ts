import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'productos'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))

      table.string('nombre', 150).notNullable()
      table.text('descripcion').nullable()

      table
        .uuid('categoria_id')
        .notNullable()
        .references('id')
        .inTable('categorias_producto')
        .onDelete('RESTRICT')

      table
        .enu('unidad_medida', null, {
          useNative: true,
          enumName: 'unidad_medida',
          existingType: true,
        })
        .notNullable()

      table.boolean('es_perecedero').notNullable().defaultTo(false)
      table.integer('dias_vencimiento_estimado').nullable()
      table.decimal('stock_minimo', 10, 2).notNullable().defaultTo(0)

      table
        .uuid('ubicacion_automatica_id')
        .nullable()
        .references('id')
        .inTable('ubicaciones')
        .onDelete('SET NULL')

      table
        .uuid('proveedor_id')
        .nullable()
        .references('id')
        .inTable('proveedores')
        .onDelete('SET NULL')

      table.string('foto_url', 255).nullable()

      table
        .enu('estado', null, {
          useNative: true,
          enumName: 'estado_activo_inactivo',
          existingType: true,
        })
        .notNullable()
        .defaultTo('activo')

      table.uuid('created_by').nullable().references('id').inTable('usuarios').onDelete('SET NULL')

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).nullable()
      table.timestamp('deleted_at', { useTz: true }).nullable() // soft delete
    })

    this.schema.raw('CREATE INDEX productos_nombre_index ' + 'ON productos (nombre)')
    this.schema.raw('CREATE INDEX productos_categoria_id_index ' + 'ON productos (categoria_id)')
    this.schema.raw('CREATE INDEX productos_proveedor_id_index ' + 'ON productos (proveedor_id)')
    this.schema.raw('CREATE INDEX productos_estado_index ' + 'ON productos (estado)')
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
