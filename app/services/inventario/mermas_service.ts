import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'
import Producto from '#models/inventario/producto'
import LoteProducto from '#models/inventario/lote_producto'
import Merma, { type MotivoMerma, type OrigenMerma } from '#models/inventario/merma'
import MovimientoInventario from '#models/inventario/movimiento_inventario'
import EventoTrazabilidad from '#models/trazabilidad/evento_trazabilidad'
import ConfiguracionSistema from '#models/reportes/configuracion_sistema'
import { StockInsuficienteError } from '#services/inventario/movimientos_service'

interface DatosMerma {
  productoId: string
  loteId?: string
  cantidad: number
  motivo: MotivoMerma
  fecha: DateTime
  responsableId: string
  registradoPor: string
  observaciones?: string
  origen?: OrigenMerma
  avisoUrgenteId?: string
}

export class ObservacionesRequeridasError extends Error {
  constructor() {
    super('Las observaciones son obligatorias para registrar una merma')
  }
}

export default class MermasService {
  /**
   * Registra una merma. Si se indica loteId, descuenta específicamente
   * de ese lote. Si no, distribuye en orden FEFO entre los lotes
   * disponibles del producto (igual criterio que una salida normal),
   * generando una fila de merma por cada lote tocado.
   */
  static async registrarMerma(datos: DatosMerma) {
    const producto = await Producto.findOrFail(datos.productoId)

    // Regla dinámica: ¿la configuración del sistema exige observaciones?
    const configuracion = await ConfiguracionSistema.query().first()
    if (configuracion?.requerirObservacionesMerma && !datos.observaciones) {
      throw new ObservacionesRequeridasError()
    }

    return db.transaction(async (trx) => {
      const mermasCreadas: Merma[] = []

      // Caso 1: se especificó un lote concreto
      if (datos.loteId) {
        const lote = await LoteProducto.query({ client: trx })
          .where('id', datos.loteId)
          .where('productoId', producto.id)
          .forUpdate()
          .firstOrFail()

        if (lote.cantidadActual < datos.cantidad) {
          throw new StockInsuficienteError(lote.cantidadActual, datos.cantidad)
        }

        const merma = await this.aplicarMermaALote({
          trx,
          producto,
          lote,
          cantidad: datos.cantidad,
          datos,
        })
        mermasCreadas.push(merma)
        return mermasCreadas
      }

      // Caso 2: sin lote específico → distribución FEFO
      const lotesDisponibles = await LoteProducto.query({ client: trx })
        .where('productoId', producto.id)
        .whereIn('estado', ['en_stock', 'con_merma'])
        .where('cantidadActual', '>', 0)
        .orderByRaw('fecha_vencimiento_estimada ASC NULLS LAST')
        .orderBy('fechaIngreso', 'asc')
        .forUpdate()

      const totalDisponible = lotesDisponibles.reduce((s, l) => s + l.cantidadActual, 0)
      if (totalDisponible < datos.cantidad) {
        throw new StockInsuficienteError(totalDisponible, datos.cantidad)
      }

      let cantidadRestante = datos.cantidad
      for (const lote of lotesDisponibles) {
        if (cantidadRestante <= 0) break
        const cantidadATomar = Math.min(lote.cantidadActual, cantidadRestante)

        const merma = await this.aplicarMermaALote({
          trx,
          producto,
          lote,
          cantidad: cantidadATomar,
          datos,
        })
        mermasCreadas.push(merma)
        cantidadRestante -= cantidadATomar
      }

      return mermasCreadas
    })
  }

  /**
   * Aplica la merma a un lote específico: descuenta cantidad, crea la
   * fila de merma, el movimiento de inventario asociado, y el evento
   * de trazabilidad. Reutilizado tanto para lote explícito como FEFO.
   */
  private static async aplicarMermaALote(params: {
    trx: any
    producto: Producto
    lote: LoteProducto
    cantidad: number
    datos: DatosMerma
  }) {
    const { trx, producto, lote, cantidad, datos } = params

    // 1. Descontar del lote
    lote.cantidadActual -= cantidad
    lote.estado = lote.cantidadActual === 0 ? 'agotado' : 'con_merma'
    await lote.useTransaction(trx).save()

    // 2. Crear el movimiento de inventario (motivo específico 'merma').
    //    No necesitamos su id después, por eso no se asigna a variable.
    await MovimientoInventario.create(
      {
        productoId: producto.id,
        loteId: lote.id,
        tipoMovimiento: 'salida',
        cantidad,
        unidad: producto.unidadMedida,
        fechaOperacion: datos.fecha,
        motivoSalida: 'merma',
        responsableId: datos.responsableId,
        registradoPor: datos.registradoPor,
        observaciones: `Merma: ${datos.motivo}${datos.observaciones ? ' — ' + datos.observaciones : ''}`,
      },
      { client: trx }
    )

    // 3. Crear la fila de merma
    const merma = await Merma.create(
      {
        productoId: producto.id,
        loteId: lote.id,
        cantidad,
        unidad: producto.unidadMedida,
        motivo: datos.motivo,
        fecha: datos.fecha,
        responsableId: datos.responsableId,
        registradoPor: datos.registradoPor,
        observaciones: datos.observaciones ?? null,
        origen: datos.origen ?? 'directo',
        avisoUrgenteId: datos.avisoUrgenteId ?? null,
      },
      { client: trx }
    )

    // 4. Evento de trazabilidad — se vincula a la merma (no al
    //    movimiento), porque es lo que queremos mostrar como enlace
    //    "→ Ver detalle de merma" en la pantalla de Trazabilidad.
    await EventoTrazabilidad.create(
      {
        loteId: lote.id,
        tipoEvento: 'merma',
        fecha: DateTime.now(),
        cantidad,
        referenciaTipo: 'mermas',
        referenciaId: merma.id,
        responsableId: datos.responsableId,
        descripcion: `Merma registrada: ${cantidad} ${producto.unidadMedida} — ${datos.motivo}`,
      },
      { client: trx }
    )

    return merma
  }
}
