import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    const tablas = [
      'movimientos_inventario',
      'mermas',
      'recepciones',
      'refrigerios_despachos',
      'historial_estado_activos',
    ]

    for (const tabla of tablas) {
      this.schema.alterTable(tabla, (table) => {
        table
          .uuid('registrado_por')
          .nullable()
          .references('id')
          .inTable('usuarios')
          .onDelete('SET NULL')
      })
    }
  }

  async down() {
    const tablas = [
      'movimientos_inventario',
      'mermas',
      'recepciones',
      'refrigerios_despachos',
      'historial_estado_activos',
    ]

    for (const tabla of tablas) {
      this.schema.alterTable(tabla, (table) => {
        table.dropColumn('registrado_por')
      })
    }
  }
}
