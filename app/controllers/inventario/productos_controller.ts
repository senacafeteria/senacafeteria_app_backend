import { DateTime } from 'luxon'
import Producto from '#models/inventario/producto'
import RecetaInsumo from '#models/produccion/receta_insumo'
import {
  crearProductoValidator,
  actualizarProductoValidator,
} from '#validators/inventario/producto'
import type { HttpContext } from '@adonisjs/core/http'
import ProductoTransformer from '#transformers/inventario/producto_transformer'

export default class ProductosController {
  /**
   * Lista productos del catálogo con filtros y paginación.
   * Usado por: Gestión de Insumos → pestaña Catálogo de Productos.
   */
  async index({ request, serialize }: HttpContext) {
    const pagina = request.input('pagina', 1)
    const porPagina = request.input('porPagina', 20)
    const busqueda = request.input('busqueda')
    const categoriaId = request.input('categoriaId')
    const proveedorId = request.input('proveedorId')
    const estado = request.input('estado', 'activo')

    const query = Producto.query()
      .whereNull('deletedAt')
      .if(estado, (q) => q.where('estado', estado))
      .if(busqueda, (q) => q.whereILike('nombre', `%${busqueda}%`))
      .if(categoriaId, (q) => q.where('categoriaId', categoriaId))
      .if(proveedorId, (q) => q.where('proveedorId', proveedorId))
      .orderBy('nombre', 'asc')

    const productos = await query.paginate(pagina, porPagina)

    return serialize({
      meta: productos.getMeta(),
      data: ProductoTransformer.transform(productos.all()),
    })
  }

  /**
   * Ver el detalle de un producto específico.
   */
  async show({ params, serialize, response }: HttpContext) {
    const producto = await Producto.query().where('id', params.id).whereNull('deletedAt').first()

    if (!producto) {
      return response.notFound({ message: 'Producto no encontrado' })
    }

    return serialize(ProductoTransformer.transform(producto))
  }

  /**
   * Crea un nuevo producto en el catálogo.
   * Ruta protegida — solo Administrador y SuperAdmin (middleware de rol
   * se agrega en start/routes.ts más adelante).
   */
  async store({ request, auth, serialize }: HttpContext) {
    const datos = await request.validateUsing(crearProductoValidator)
    const usuario = auth.getUserOrFail()

    const producto = await Producto.create({
      ...datos,
      estado: 'activo',
      createdBy: usuario.id,
    })

    return serialize(ProductoTransformer.transform(producto))
  }

  /**
   * Edita un producto existente.
   * Ruta protegida — solo Administrador y SuperAdmin.
   */
  async update({ params, request, serialize, response }: HttpContext) {
    const producto = await Producto.query().where('id', params.id).whereNull('deletedAt').first()

    if (!producto) {
      return response.notFound({ message: 'Producto no encontrado' })
    }

    const datos = await request.validateUsing(actualizarProductoValidator)
    producto.merge(datos)
    await producto.save()

    return serialize(ProductoTransformer.transform(producto))
  }

  /**
   * Elimina (soft delete) un producto. Antes de ejecutar, informa
   * cuántas recetas activas lo están usando, tal como vimos en el
   * diseño de Stitch: "⚠️ Este producto está siendo usado en 3 recetas
   * activas. Elimínalo con precaución."
   */
  async destroy({ params, serialize, response }: HttpContext) {
    const producto = await Producto.query().where('id', params.id).whereNull('deletedAt').first()

    if (!producto) {
      return response.notFound({ message: 'Producto no encontrado' })
    }

    const recetasQueLoUsan = await RecetaInsumo.query()
      .where('productoId', producto.id)
      .count('* as total')

    producto.estado = 'inactivo'
    producto.deletedAt = DateTime.now()
    await producto.save()

    return serialize({
      message: 'Producto eliminado correctamente',
      recetasAfectadas: Number(recetasQueLoUsan[0].$extras.total),
    })
  }

  /**
   * Endpoint liviano para consultar cuántas recetas usan un producto,
   * SIN eliminarlo. Pensado para que el frontend muestre la advertencia
   * de Stitch ANTES de que el usuario confirme la eliminación.
   */
  async verificarUso({ params, serialize, response }: HttpContext) {
    const producto = await Producto.query().where('id', params.id).whereNull('deletedAt').first()

    if (!producto) {
      return response.notFound({ message: 'Producto no encontrado' })
    }

    const recetasQueLoUsan = await RecetaInsumo.query()
      .where('productoId', producto.id)
      .count('* as total')

    return serialize({
      recetasAfectadas: Number(recetasQueLoUsan[0].$extras.total),
    })
  }
}
