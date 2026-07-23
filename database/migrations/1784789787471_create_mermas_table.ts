import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'mermas'

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

      table.decimal('cantidad', 10, 2).notNullable()
      table.string('unidad', 20).notNullable()

      table
        .enu('motivo', null, {
          useNative: true,
          enumName: 'motivo_merma',
          existingType: true,
        })
        .notNullable()

      table.date('fecha').notNullable()

      table
        .uuid('responsable_id')
        .notNullable()
        .references('id')
        .inTable('usuarios')
        .onDelete('RESTRICT')

      table.text('observaciones').nullable()

      table
        .enu('origen', null, {
          useNative: true,
          enumName: 'origen_merma',
          existingType: true,
        })
        .notNullable()
        .defaultTo('directo')

      table
        .uuid('aviso_urgente_id')
        .nullable()
        .references('id')
        .inTable('avisos_urgentes')
        .onDelete('SET NULL')

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
    })

    this.schema.raw('CREATE INDEX mermas_producto_id_index ' + 'ON mermas (producto_id)')
    this.schema.raw('CREATE INDEX mermas_fecha_index ' + 'ON mermas (fecha)')
    this.schema.raw('CREATE INDEX mermas_motivo_index ' + 'ON mermas (motivo)')
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
