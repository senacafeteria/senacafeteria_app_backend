import type Producto from '#models/inventario/producto'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class ProductoTransformer extends BaseTransformer<Producto> {
  toObject() {
    return this.pick(this.resource, [
      'id',
      'nombre',
      'descripcion',
      'categoriaId',
      'unidadMedida',
      'esPerecedero',
      'diasVencimientoEstimado',
      'stockMinimo',
      'ubicacionAutomaticaId',
      'proveedorId',
      'fotoUrl',
      'estado',
      'createdAt',
      'updatedAt',
    ])
  }
}
