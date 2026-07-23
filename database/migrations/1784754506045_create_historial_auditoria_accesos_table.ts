import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'historial_auditoria_accesos'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))

      // Nullable a propósito: si alguien intenta loguearse con un
      // usuario/correo que no existe, igual queremos registrar el intento.
      table.uuid('usuario_id').nullable().references('id').inTable('usuarios').onDelete('SET NULL')

      table
        .enu('tipo_evento', null, {
          useNative: true,
          enumName: 'tipo_evento_auditoria',
          existingType: true,
        })
        .notNullable()

      table.string('ip_address', 45).nullable()
      table.string('dispositivo', 150).nullable()

      table
        .enu('resultado', null, {
          useNative: true,
          enumName: 'resultado_auditoria',
          existingType: true,
        })
        .notNullable()

      // Sin updated_at: esta tabla es un log inmutable, nunca se edita.
      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
    })

    this.schema.raw(
      'CREATE INDEX historial_auditoria_usuario_id_index ' +
        'ON historial_auditoria_accesos (usuario_id)'
    )
    this.schema.raw(
      'CREATE INDEX historial_auditoria_created_at_index ' +
        'ON historial_auditoria_accesos (created_at)'
    )
    this.schema.raw(
      'CREATE INDEX historial_auditoria_tipo_evento_index ' +
        'ON historial_auditoria_accesos (tipo_evento)'
    )
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
