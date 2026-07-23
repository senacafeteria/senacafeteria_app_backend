import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'reportes_generados'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))

      table.string('nombre', 150).notNullable()
      table.string('modulo', 50).notNullable() // ej. "Refrigerios", "Inventario"
      table.string('tipo_reporte', 100).nullable()

      table
        .uuid('generado_por')
        .notNullable()
        .references('id')
        .inTable('usuarios')
        .onDelete('RESTRICT')

      table.date('periodo_inicio').nullable()
      table.date('periodo_fin').nullable()

      table
        .enu('formato', null, {
          useNative: true,
          enumName: 'formato_reporte',
          existingType: true,
        })
        .notNullable()

      table.string('archivo_url', 255).nullable()

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
    })

    this.schema.raw(
      'CREATE INDEX reportes_generados_modulo_index ' + 'ON reportes_generados (modulo)'
    )
    this.schema.raw(
      'CREATE INDEX reportes_generados_generado_por_index ' + 'ON reportes_generados (generado_por)'
    )
    this.schema.raw(
      'CREATE INDEX reportes_generados_created_at_index ' + 'ON reportes_generados (created_at)'
    )
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
