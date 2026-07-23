import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'eventos_trazabilidad'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))

      table
        .uuid('lote_id')
        .notNullable()
        .references('id')
        .inTable('lotes_producto')
        .onDelete('CASCADE')

      table
        .enu('tipo_evento', null, {
          useNative: true,
          enumName: 'tipo_evento_trazabilidad',
          existingType: true,
        })
        .notNullable()

      table.timestamp('fecha', { useTz: true }).notNullable()
      table.decimal('cantidad', 10, 2).nullable()

      // Referencia polimórfica: apunta a la fila de origen en otra tabla
      // (recepciones, produccion_diaria, refrigerios_despachos, mermas, etc.)
      table.string('referencia_tipo', 50).nullable()
      table.uuid('referencia_id').nullable()

      table
        .uuid('responsable_id')
        .notNullable()
        .references('id')
        .inTable('usuarios')
        .onDelete('RESTRICT')

      table.text('descripcion').nullable()

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
    })

    this.schema.raw(
      'CREATE INDEX eventos_trazabilidad_lote_id_index ' + 'ON eventos_trazabilidad (lote_id)'
    )
    this.schema.raw(
      'CREATE INDEX eventos_trazabilidad_tipo_evento_index ' +
        'ON eventos_trazabilidad (tipo_evento)'
    )
    this.schema.raw(
      'CREATE INDEX eventos_trazabilidad_fecha_index ' + 'ON eventos_trazabilidad (fecha)'
    )
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
