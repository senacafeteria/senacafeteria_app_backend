import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'
import Producto from '#models/inventario/producto'
import LoteProducto from '#models/inventario/lote_producto'
import MovimientoInventario, { type MotivoSalida } from '#models/inventario/movimiento_inventario'
import EventoTrazabilidad from '#models/trazabilidad/evento_trazabilidad'

interface DatosEntrada {
  productoId: string
  cantidad: number
  fechaOperacion: DateTime
  responsableId: string
  registradoPor: string
  numeroLote?: string
  numeroRemision?: string
  observaciones?: string
}

interface DatosSalida {
  productoId: string
  cantidad: number
  fechaOperacion: DateTime
  motivoSalida: MotivoSalida
  responsableId: string
  registradoPor: string
  observaciones?: string
}

/**
 * Error específico para cuando no hay stock suficiente. El controlador
 * lo captura y responde 400 con un mensaje claro para el frontend.
 */
export class StockInsuficienteError extends Error {
  constructor(
    public disponible: number,
    public solicitado: number
  ) {
    super(`Stock insuficiente: disponible ${disponible}, solicitado ${solicitado}`)
  }
}

export default class MovimientosService {
  /**
   * Registra una entrada de inventario: crea un lote nuevo, el
   * movimiento, y los 2 eventos de trazabilidad iniciales (ingreso +
   * ubicación asignada).
   */
  static async registrarEntrada(datos: DatosEntrada) {
    const producto = await Producto.findOrFail(datos.productoId)

    return db.transaction(async (trx) => {
      // 1. Calcular fecha de vencimiento estimada (solo si es perecedero)
      const fechaVencimientoEstimada =
        producto.esPerecedero && producto.diasVencimientoEstimado
          ? datos.fechaOperacion.plus({ days: producto.diasVencimientoEstimado })
          : null

      // 2. Crear el lote
      const lote = await LoteProducto.create(
        {
          productoId: producto.id,
          numeroLote: datos.numeroLote ?? null,
          proveedorId: producto.proveedorId,
          cantidadInicial: datos.cantidad,
          cantidadActual: datos.cantidad,
          fechaIngreso: datos.fechaOperacion,
          fechaVencimientoEstimada,
          ubicacionId: producto.ubicacionAutomaticaId,
          responsableId: datos.responsableId,
          estado: 'en_stock',
        },
        { client: trx }
      )

      // 3. Crear el movimiento de entrada
      const movimiento = await MovimientoInventario.create(
        {
          productoId: producto.id,
          loteId: lote.id,
          tipoMovimiento: 'entrada',
          cantidad: datos.cantidad,
          unidad: producto.unidadMedida,
          fechaOperacion: datos.fechaOperacion,
          numeroRemision: datos.numeroRemision ?? null,
          responsableId: datos.responsableId,
          registradoPor: datos.registradoPor,
          observaciones: datos.observaciones ?? null,
        },
        { client: trx }
      )

      // 4. Registrar eventos de trazabilidad (Nodo 1: ingreso, Nodo 2: ubicación)
      await EventoTrazabilidad.create(
        {
          loteId: lote.id,
          tipoEvento: 'ingreso',
          fecha: DateTime.now(),
          cantidad: datos.cantidad,
          referenciaTipo: 'movimientos_inventario',
          referenciaId: movimiento.id,
          responsableId: datos.responsableId,
          descripcion: `Ingreso de ${datos.cantidad} ${producto.unidadMedida} de ${producto.nombre}`,
        },
        { client: trx }
      )

      if (lote.ubicacionId) {
        await EventoTrazabilidad.create(
          {
            loteId: lote.id,
            tipoEvento: 'ubicacion_asignada',
            fecha: DateTime.now(),
            referenciaTipo: 'lotes_producto',
            referenciaId: lote.id,
            responsableId: datos.responsableId,
            descripcion: 'Ubicación asignada automáticamente según la categoría del producto',
          },
          { client: trx }
        )
      }

      return { lote, movimiento }
    })
  }

  /**
   * Calcula el stock total disponible de un producto, sumando todos
   * sus lotes consumibles (en_stock o con_merma parcial, excluyendo
   * agotados y vencidos).
   */
  static async calcularStockDisponible(productoId: string): Promise<number> {
    const resultado = await LoteProducto.query()
      .where('productoId', productoId)
      .whereIn('estado', ['en_stock', 'con_merma'])
      .where('cantidadActual', '>', 0)
      .sum('cantidadActual as total')

    return Number(resultado[0].$extras.total ?? 0)
  }

  /**
   * Registra una salida de inventario, descontando en orden FEFO
   * (First-Expire-First-Out) de todos los lotes disponibles del
   * producto, hasta cubrir la cantidad solicitada.
   */
  static async registrarSalida(datos: DatosSalida) {
    const producto = await Producto.findOrFail(datos.productoId)

    return db.transaction(async (trx) => {
      // 1. Traer lotes consumibles ordenados por FEFO (vence antes = primero,
      //    los que no tienen fecha de vencimiento van al final)
      const lotesDisponibles = await LoteProducto.query({ client: trx })
        .where('productoId', producto.id)
        .whereIn('estado', ['en_stock', 'con_merma'])
        .where('cantidadActual', '>', 0)
        .orderByRaw('fecha_vencimiento_estimada ASC NULLS LAST')
        .orderBy('fechaIngreso', 'asc')
        .forUpdate() // bloquea las filas hasta que termine la transacción

      const totalDisponible = lotesDisponibles.reduce((suma, lote) => suma + lote.cantidadActual, 0)

      if (totalDisponible < datos.cantidad) {
        throw new StockInsuficienteError(totalDisponible, datos.cantidad)
      }

      // 2. Distribuir la cantidad solicitada entre los lotes, en orden
      let cantidadRestante = datos.cantidad
      const movimientosCreados: MovimientoInventario[] = []

      // El tipo de evento de trazabilidad depende del motivo de salida
      const tipoEventoTrazabilidad =
        datos.motivoSalida === 'despacho_grupo' ? 'despacho' : 'uso_produccion'

      for (const lote of lotesDisponibles) {
        if (cantidadRestante <= 0) break

        const cantidadATomar = Math.min(lote.cantidadActual, cantidadRestante)

        // Actualiza el lote
        lote.cantidadActual -= cantidadATomar
        if (lote.cantidadActual === 0) {
          lote.estado = 'agotado'
        }
        await lote.useTransaction(trx).save()

        // Crea un movimiento por cada lote tocado
        const movimiento = await MovimientoInventario.create(
          {
            productoId: producto.id,
            loteId: lote.id,
            tipoMovimiento: 'salida',
            cantidad: cantidadATomar,
            unidad: producto.unidadMedida,
            fechaOperacion: datos.fechaOperacion,
            motivoSalida: datos.motivoSalida,
            responsableId: datos.responsableId,
            registradoPor: datos.registradoPor,
            observaciones: datos.observaciones ?? null,
          },
          { client: trx }
        )
        movimientosCreados.push(movimiento)

        // Evento de trazabilidad por cada lote tocado
        await EventoTrazabilidad.create(
          {
            loteId: lote.id,
            tipoEvento: tipoEventoTrazabilidad,
            fecha: DateTime.now(),
            cantidad: cantidadATomar,
            referenciaTipo: 'movimientos_inventario',
            referenciaId: movimiento.id,
            responsableId: datos.responsableId,
            descripcion: `Salida de ${cantidadATomar} ${producto.unidadMedida} de ${producto.nombre}`,
          },
          { client: trx }
        )

        cantidadRestante -= cantidadATomar
      }

      return movimientosCreados
    })
  }
}
