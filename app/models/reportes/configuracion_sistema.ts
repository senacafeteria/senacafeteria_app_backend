import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class ConfiguracionSistema extends BaseModel {
  static table = 'configuracion_sistema'

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare diasAlertaAmarillaVencimiento: number

  @column()
  declare diasAlertaRojaVencimiento: number

  @column()
  declare descuentoAutomaticoEmpaque: boolean

  @column()
  declare checklistObligatorioDespacho: boolean

  @column()
  declare diasAnticipacionAgendarRefrigerio: number

  @column()
  declare requerirObservacionesMerma: boolean

  @column()
  declare formatoFecha: string

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
