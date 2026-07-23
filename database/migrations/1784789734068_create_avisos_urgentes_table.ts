import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'avisos_urgentes'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))

      table
        .enu('tipo', null, {
          useNative: true,
          enumName: 'tipo_aviso',
          existingType: true,
        })
        .notNullable()

      table
        .uuid('producto_id')
        .nullable()
        .references('id')
        .inTable('productos')
        .onDelete('SET NULL')

      table.uuid('activo_id').nullable().references('id').inTable('activos').onDelete('SET NULL')

      table.decimal('cantidad_afectada', 10, 2).nullable()
      table.string('motivo', 50).nullable() // mismos valores que motivo_merma, si aplica

      table
        .enu('nivel_urgencia', null, {
          useNative: true,
          enumName: 'nivel_urgencia',
          existingType: true,
        })
        .nullable() // solo aplica si tipo = 'activo_danado'

      table.text('descripcion').notNullable()
      table.string('foto_url', 255).nullable()

      table
        .uuid('reportado_por')
        .notNullable()
        .references('id')
        .inTable('usuarios')
        .onDelete('RESTRICT')

      table
        .enu('estado', null, {
          useNative: true,
          enumName: 'estado_aviso',
          existingType: true,
        })
        .notNullable()
        .defaultTo('pendiente')

      table.text('nota_respuesta_admin').nullable()

      table
        .uuid('revisado_por')
        .nullable()
        .references('id')
        .inTable('usuarios')
        .onDelete('SET NULL')

      table.timestamp('revisado_at', { useTz: true }).nullable()

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
    })

    this.schema.raw('CREATE INDEX avisos_urgentes_estado_index ' + 'ON avisos_urgentes (estado)')
    this.schema.raw(
      'CREATE INDEX avisos_urgentes_reportado_por_index ' + 'ON avisos_urgentes (reportado_por)'
    )
    this.schema.raw('CREATE INDEX avisos_urgentes_tipo_index ' + 'ON avisos_urgentes (tipo)')
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
