import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'configuracion_sistema'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))

      table.integer('dias_alerta_amarilla_vencimiento').notNullable().defaultTo(3)
      table.integer('dias_alerta_roja_vencimiento').notNullable().defaultTo(1)
      table.boolean('descuento_automatico_empaque').notNullable().defaultTo(true)
      table.boolean('checklist_obligatorio_despacho').notNullable().defaultTo(true)
      table.integer('dias_anticipacion_agendar_refrigerio').notNullable().defaultTo(1)
      table.boolean('requerir_observaciones_merma').notNullable().defaultTo(true)
      table.string('formato_fecha', 20).notNullable().defaultTo('DD/MM/AAAA')

      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
