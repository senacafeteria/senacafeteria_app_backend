import MovimientoInventario from '#models/inventario/movimiento_inventario'
import {
  registrarEntradaValidator,
  registrarSalidaValidator,
} from '#validators/inventario/movimiento_inventario'
import MovimientosService, {
  StockInsuficienteError,
} from '#services/inventario/movimientos_service'
import type { HttpContext } from '@adonisjs/core/http'

export default class MovimientosController {
  /**
   * Lista el historial de movimientos (Gestión de Insumos → "Últimos
   * Registros" del día, e Historial de movimientos con filtros).
   */
  async index({ request, serialize }: HttpContext) {
    const pagina = request.input('pagina', 1)
    const porPagina = request.input('porPagina', 20)
    const productoId = request.input('productoId')
    const tipoMovimiento = request.input('tipoMovimiento')
    const fecha = request.input('fecha') // filtro "hoy" desde el frontend

    const query = MovimientoInventario.query()
      .preload('producto')
      .preload('responsable')
      .preload('registradoPorUsuario')
      .if(productoId, (q) => q.where('productoId', productoId))
      .if(tipoMovimiento, (q) => q.where('tipoMovimiento', tipoMovimiento))
      .if(fecha, (q) => q.where('fechaOperacion', fecha))
      .orderBy('createdAt', 'desc')

    const movimientos = await query.paginate(pagina, porPagina)

    return serialize({
      meta: movimientos.getMeta(),
      data: movimientos.all(),
    })
  }

  /**
   * Registrar Entrada (Gestión de Insumos → toggle "Registrar Entrada").
   * `responsableId` viene del dropdown del formulario (puede ser
   * distinto al usuario logueado). `registradoPor` siempre es quien
   * está en la sesión activa ejecutando la acción.
   * Ruta protegida — Administrador y SuperAdmin.
   */
  async entrada({ request, auth, serialize }: HttpContext) {
    const datos = await request.validateUsing(registrarEntradaValidator)
    const usuario = auth.getUserOrFail()

    const resultado = await MovimientosService.registrarEntrada({
      ...datos,
      responsableId: datos.responsableId,
      registradoPor: usuario.id,
    })

    return serialize({
      message: 'Entrada registrada correctamente',
      lote: resultado.lote,
      movimiento: resultado.movimiento,
    })
  }

  /**
   * Registrar Salida (Gestión de Insumos → toggle "Registrar Salida").
   * Mismo criterio que entrada: responsable = dropdown, registradoPor
   * = sesión activa.
   * Ruta protegida — Administrador y SuperAdmin.
   */
  async salida({ request, auth, serialize, response }: HttpContext) {
    const datos = await request.validateUsing(registrarSalidaValidator)
    const usuario = auth.getUserOrFail()

    try {
      const movimientos = await MovimientosService.registrarSalida({
        ...datos,
        responsableId: datos.responsableId,
        registradoPor: usuario.id,
      })

      return serialize({
        message: 'Salida registrada correctamente',
        movimientos,
      })
    } catch (error) {
      if (error instanceof StockInsuficienteError) {
        return response.badRequest({
          message: `Stock insuficiente. Disponible: ${error.disponible}, solicitado: ${error.solicitado}.`,
          disponible: error.disponible,
          solicitado: error.solicitado,
        })
      }
      throw error
    }
  }

  /**
   * Consulta el stock disponible de un producto en tiempo real. Lo usa
   * el frontend para mostrar "Stock actual: X disponibles" antes de
   * que el usuario confirme una salida o merma.
   */
  async stockDisponible({ params, serialize }: HttpContext) {
    const disponible = await MovimientosService.calcularStockDisponible(params.productoId)
    return serialize({ productoId: params.productoId, stockDisponible: disponible })
  }
}
