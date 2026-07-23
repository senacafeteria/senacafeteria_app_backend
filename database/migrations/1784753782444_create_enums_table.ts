import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    // Extensión para generación automática de UUIDs (usada en todas las tablas)
    this.schema.raw('CREATE EXTENSION IF NOT EXISTS "pgcrypto"')

    // ==========================================
    // MÓDULO 1 — Autenticación y Usuarios
    // ==========================================
    this.schema.raw(`
      CREATE TYPE "rol_usuario" AS ENUM ('superadmin', 'administrador', 'operario')
    `)
    this.schema.raw(`
      CREATE TYPE "tipo_evento_auditoria" AS ENUM ('inicio_sesion', 'cierre_sesion', 'intento_fallido', 'cuenta_bloqueada')
    `)
    this.schema.raw(`
      CREATE TYPE "resultado_auditoria" AS ENUM ('exitoso', 'fallido', 'bloqueado')
    `)

    // ==========================================
    // Genérico — reutilizado por usuarios, productos, proveedores, fichas_grupos
    // ==========================================
    this.schema.raw(`
      CREATE TYPE "estado_activo_inactivo" AS ENUM ('activo', 'inactivo')
    `)

    // ==========================================
    // MÓDULO 2 — Catálogo de Productos e Inventario
    // ==========================================
    this.schema.raw(`
      CREATE TYPE "unidad_medida" AS ENUM ('litros', 'kilogramos', 'gramos', 'mililitros', 'unidades', 'cajas', 'paquetes')
    `)
    this.schema.raw(`
      CREATE TYPE "estado_lote" AS ENUM ('en_stock', 'agotado', 'con_merma', 'vencido')
    `)
    this.schema.raw(`
      CREATE TYPE "tipo_movimiento" AS ENUM ('entrada', 'salida')
    `)
    this.schema.raw(`
      CREATE TYPE "motivo_salida" AS ENUM ('consumo_produccion', 'despacho_grupo', 'transferencia', 'otro')
    `)

    // ==========================================
    // MÓDULO 3 — Mermas y Desperdicios
    // ==========================================
    this.schema.raw(`
      CREATE TYPE "motivo_merma" AS ENUM ('vencimiento', 'mal_estado', 'error_preparacion', 'deterioro_empaque', 'otro')
    `)
    this.schema.raw(`
      CREATE TYPE "origen_merma" AS ENUM ('directo', 'aviso_urgente')
    `)

    // ==========================================
    // MÓDULO 4 — Equipos y Activos
    // ==========================================
    this.schema.raw(`
      CREATE TYPE "estado_activo_fisico" AS ENUM ('operativo', 'en_mantenimiento', 'fuera_servicio', 'requiere_reposicion')
    `)
    this.schema.raw(`
      CREATE TYPE "estado_mantenimiento" AS ENUM ('pendiente', 'en_proceso', 'completado')
    `)

    // ==========================================
    // MÓDULO 5 — Producción Interna y Recetas
    // ==========================================
    this.schema.raw(`
      CREATE TYPE "categoria_receta" AS ENUM ('refrigerio', 'almuerzo', 'postre', 'preparacion_interna', 'otro')
    `)
    this.schema.raw(`
      CREATE TYPE "estado_produccion" AS ENUM ('planeada', 'iniciada', 'completada')
    `)

    // ==========================================
    // MÓDULO 6 — Checklist de Higiene y EPP
    // ==========================================
    this.schema.raw(`
      CREATE TYPE "estado_verificacion" AS ENUM ('completo', 'con_faltante')
    `)

    // ==========================================
    // MÓDULO 7 — Minuta / Menú
    // ==========================================
    this.schema.raw(`
      CREATE TYPE "tiempo_comida" AS ENUM ('desayuno', 'almuerzo', 'refrigerio')
    `)

    // ==========================================
    // MÓDULO 8 — Refrigerios y Grupos
    // ==========================================
    this.schema.raw(`
      CREATE TYPE "origen_refrigerio" AS ENUM ('cafeteria', 'panaderia')
    `)
    this.schema.raw(`
      CREATE TYPE "estado_agendamiento" AS ENUM ('programado', 'por_confirmar', 'entregado', 'cancelado')
    `)
    this.schema.raw(`
      CREATE TYPE "tipo_despacho" AS ENUM ('agendado', 'directo')
    `)

    // ==========================================
    // MÓDULO 9 — Proveedores
    // ==========================================
    this.schema.raw(`
      CREATE TYPE "tipo_proveedor" AS ENUM ('interno', 'externo')
    `)
    this.schema.raw(`
      CREATE TYPE "categoria_proveedor" AS ENUM ('panaderia', 'lacteos_granja', 'insumos_secos', 'higiene_epp', 'empaque', 'carnes', 'frutas_verduras', 'otros')
    `)
    this.schema.raw(`
      CREATE TYPE "frecuencia_entrega" AS ENUM ('diaria', 'semanal', 'quincenal', 'mensual', 'ocasional')
    `)
    this.schema.raw(`
      CREATE TYPE "estado_diferencia" AS ENUM ('sin_diferencia', 'excedente', 'faltante')
    `)

    // ==========================================
    // MÓDULO 10 — Avisos Urgentes
    // ==========================================
    this.schema.raw(`
      CREATE TYPE "tipo_aviso" AS ENUM ('merma', 'activo_danado')
    `)
    this.schema.raw(`
      CREATE TYPE "nivel_urgencia" AS ENUM ('baja', 'media', 'alta')
    `)
    this.schema.raw(`
      CREATE TYPE "estado_aviso" AS ENUM ('pendiente', 'confirmado', 'rechazado')
    `)

    // ==========================================
    // MÓDULO 11 — Trazabilidad
    // ==========================================
    this.schema.raw(`
      CREATE TYPE "tipo_evento_trazabilidad" AS ENUM ('ingreso', 'ubicacion_asignada', 'uso_produccion', 'despacho', 'merma', 'estado_actual')
    `)

    // ==========================================
    // MÓDULO 12 — Notificaciones
    // ==========================================
    this.schema.raw(`
      CREATE TYPE "tipo_notificacion" AS ENUM (
        'stock_critico',
        'vencimiento_proximo',
        'merma_registrada',
        'refrigerio_sin_confirmar',
        'recepcion_diferencias',
        'mantenimiento_pendiente',
        'aviso_urgente',
        'intento_fallido',
        'cuenta_bloqueada'
      )
    `)

    // ==========================================
    // MÓDULO 13 — Reportes
    // ==========================================
    this.schema.raw(`
      CREATE TYPE "formato_reporte" AS ENUM ('pdf', 'excel')
    `)
  }

  async down() {
    // Se destruyen en orden inverso al de creación.
    // IMPORTANTE: esto solo funciona si ya se revirtieron (down) todas las
    // tablas que usan estos tipos. Por eso esta es la ÚLTIMA migración
    // en ejecutarse hacia atrás (rollback completo del sistema).
    const tipos = [
      'formato_reporte',
      'tipo_notificacion',
      'tipo_evento_trazabilidad',
      'estado_aviso',
      'nivel_urgencia',
      'tipo_aviso',
      'estado_diferencia',
      'frecuencia_entrega',
      'categoria_proveedor',
      'tipo_proveedor',
      'tipo_despacho',
      'estado_agendamiento',
      'origen_refrigerio',
      'tiempo_comida',
      'estado_verificacion',
      'estado_produccion',
      'categoria_receta',
      'estado_mantenimiento',
      'estado_activo_fisico',
      'origen_merma',
      'motivo_merma',
      'motivo_salida',
      'tipo_movimiento',
      'estado_lote',
      'unidad_medida',
      'estado_activo_inactivo',
      'resultado_auditoria',
      'tipo_evento_auditoria',
      'rol_usuario',
    ]

    for (const tipo of tipos) {
      this.schema.raw(`DROP TYPE IF EXISTS "${tipo}"`)
    }
  }
}
