import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'movimientos_inventario'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))

      table
        .uuid('producto_id')
        .notNullable()
        .references('id')
        .inTable('productos')
        .onDelete('RESTRICT')

      table
        .uuid('lote_id')
        .nullable()
        .references('id')
        .inTable('lotes_producto')
        .onDelete('SET NULL')

      table
        .enu('tipo_movimiento', null, {
          useNative: true,
          enumName: 'tipo_movimiento',
          existingType: true,
        })
        .notNullable()

      table.decimal('cantidad', 10, 2).notNullable()
      table.string('unidad', 20).notNullable()
      table.date('fecha_operacion').notNullable()

      table
        .enu('motivo_salida', null, {
          useNative: true,
          enumName: 'motivo_salida',
          existingType: true,
        })
        .nullable() // solo aplica cuando tipo_movimiento = 'salida'

      table.string('numero_remision', 100).nullable()

      table
        .uuid('responsable_id')
        .notNullable()
        .references('id')
        .inTable('usuarios')
        .onDelete('RESTRICT')

      table.text('observaciones').nullable()

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
    })

    this.schema.raw(
      'CREATE INDEX movimientos_inventario_producto_id_index ' +
        'ON movimientos_inventario (producto_id)'
    )
    this.schema.raw(
      'CREATE INDEX movimientos_inventario_fecha_index ' +
        'ON movimientos_inventario (fecha_operacion)'
    )
    this.schema.raw(
      'CREATE INDEX movimientos_inventario_tipo_index ' +
        'ON movimientos_inventario (tipo_movimiento)'
    )
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
