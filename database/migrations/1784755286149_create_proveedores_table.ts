import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'proveedores'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))

      table.string('nombre', 150).notNullable()

      table
        .enu('tipo', null, {
          useNative: true,
          enumName: 'tipo_proveedor',
          existingType: true,
        })
        .notNullable()

      table
        .enu('categoria', null, {
          useNative: true,
          enumName: 'categoria_proveedor',
          existingType: true,
        })
        .notNullable()

      table.text('productos_resumen').nullable()

      table
        .enu('frecuencia_entrega', null, {
          useNative: true,
          enumName: 'frecuencia_entrega',
          existingType: true,
        })
        .nullable()

      table.string('contacto_nombre', 150).nullable()
      table.string('contacto_telefono', 30).nullable()
      table.string('contacto_correo', 150).nullable()
      table.string('ciudad', 100).nullable()

      table
        .enu('estado', null, {
          useNative: true,
          enumName: 'estado_activo_inactivo',
          existingType: true,
        })
        .notNullable()
        .defaultTo('activo')

      table.text('observaciones').nullable()

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).nullable()
      table.timestamp('deleted_at', { useTz: true }).nullable() // soft delete
    })

    this.schema.raw('CREATE INDEX proveedores_tipo_index ' + 'ON proveedores (tipo)')
    this.schema.raw('CREATE INDEX proveedores_categoria_index ' + 'ON proveedores (categoria)')
    this.schema.raw('CREATE INDEX proveedores_estado_index ' + 'ON proveedores (estado)')
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
