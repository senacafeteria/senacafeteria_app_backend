import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'usuarios'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))

      // Información personal
      table.string('nombre_completo', 150).notNullable()
      table.string('correo', 150).notNullable().unique()
      table.string('nombre_usuario', 50).notNullable().unique()
      table.string('extension_contacto', 30).nullable()
      table.string('foto_perfil_url', 255).nullable()

      // Acceso y seguridad
      table.string('contrasena_hash', 255).notNullable()

      // Reutiliza el enum "rol_usuario" creado en la migración 0020 (create_enums)
      table
        .enu('rol', null, {
          useNative: true,
          enumName: 'rol_usuario',
          existingType: true,
        })
        .notNullable()

      table.boolean('debe_cambiar_contrasena').notNullable().defaultTo(true)
      table.integer('intentos_fallidos').notNullable().defaultTo(0)
      table.timestamp('bloqueado_hasta', { useTz: true }).nullable()
      table.timestamp('ultimo_acceso_at', { useTz: true }).nullable()

      // Reutiliza el enum "estado_activo_inactivo" creado en la migración 0020
      table
        .enu('estado', null, {
          useNative: true,
          enumName: 'estado_activo_inactivo',
          existingType: true,
        })
        .notNullable()
        .defaultTo('activo')

      // Timestamps
      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).nullable()
      table.timestamp('deleted_at', { useTz: true }).nullable() // soft delete
    })

    // Índices para búsquedas y filtros frecuentes (Gestión de Usuarios y Roles)
    this.schema.raw('CREATE INDEX usuarios_rol_index ON usuarios (rol)')
    this.schema.raw('CREATE INDEX usuarios_estado_index ON usuarios (estado)')
    this.schema.raw('CREATE INDEX usuarios_deleted_at_index ON usuarios (deleted_at)')
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
