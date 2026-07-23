import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'lotes_producto'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))

      table
        .uuid('producto_id')
        .notNullable()
        .references('id')
        .inTable('productos')
        .onDelete('RESTRICT')

      table.string('numero_lote', 100).nullable()

      table
        .uuid('proveedor_id')
        .nullable()
        .references('id')
        .inTable('proveedores')
        .onDelete('SET NULL')

      table
        .uuid('recepcion_id')
        .nullable()
        .references('id')
        .inTable('recepciones')
        .onDelete('SET NULL')

      table.decimal('cantidad_inicial', 10, 2).notNullable()
      table.decimal('cantidad_actual', 10, 2).notNullable()

      table.date('fecha_ingreso').notNullable()
      table.date('fecha_vencimiento_estimada').nullable()

      table
        .uuid('ubicacion_id')
        .nullable()
        .references('id')
        .inTable('ubicaciones')
        .onDelete('SET NULL')

      table
        .uuid('responsable_id')
        .notNullable()
        .references('id')
        .inTable('usuarios')
        .onDelete('RESTRICT')

      table
        .enu('estado', null, {
          useNative: true,
          enumName: 'estado_lote',
          existingType: true,
        })
        .notNullable()
        .defaultTo('en_stock')

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).nullable()
    })

    this.schema.raw(
      'CREATE INDEX lotes_producto_producto_id_index ' + 'ON lotes_producto (producto_id)'
    )
    this.schema.raw(
      'CREATE INDEX lotes_producto_numero_lote_index ' + 'ON lotes_producto (numero_lote)'
    )
    this.schema.raw(
      'CREATE INDEX lotes_producto_vencimiento_index ' +
        'ON lotes_producto (fecha_vencimiento_estimada)'
    )
    this.schema.raw('CREATE INDEX lotes_producto_estado_index ' + 'ON lotes_producto (estado)')
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
