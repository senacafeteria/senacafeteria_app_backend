import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'recepciones'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))

      table
        .uuid('proveedor_id')
        .notNullable()
        .references('id')
        .inTable('proveedores')
        .onDelete('RESTRICT')

      table.string('numero_remision', 100).nullable()
      table.date('fecha_recepcion').notNullable()

      // Obligatorio a nivel de aplicación solo si el proveedor es Lácteos/Granja
      table.string('numero_lote', 100).nullable()

      // Aplica solo si el proveedor es Panadería SENA
      table.boolean('es_prempacado').nullable()

      table
        .uuid('responsable_id')
        .notNullable()
        .references('id')
        .inTable('usuarios')
        .onDelete('RESTRICT')

      table.text('observaciones').nullable()
      table.boolean('tiene_diferencias').notNullable().defaultTo(false)

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
    })

    this.schema.raw(
      'CREATE INDEX recepciones_proveedor_id_index ' + 'ON recepciones (proveedor_id)'
    )
    this.schema.raw(
      'CREATE INDEX recepciones_fecha_recepcion_index ' + 'ON recepciones (fecha_recepcion)'
    )
    this.schema.raw(
      'CREATE INDEX recepciones_tiene_diferencias_index ' + 'ON recepciones (tiene_diferencias)'
    )
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
