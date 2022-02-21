import { AAlunaModule } from '../../../lib/core/abstracts/AAlunaModule'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaOrderGetParams,
  IAlunaOrderReadModule,
} from '../../../lib/modules/IAlunaOrderModule'
import { IAlunaOrderSchema } from '../../../lib/schemas/IAlunaOrderSchema'
import { BitmexHttp } from '../BitmexHttp'
import { BitmexLog } from '../BitmexLog'
import { BitmexSpecs } from '../BitmexSpecs'
import { IBitmexOrderSchema } from '../schemas/IBitmexOrderSchema'



export class BitmexOrderReadModule extends AAlunaModule implements IAlunaOrderReadModule {

  public async listRaw (): Promise<IBitmexOrderSchema[]> {

    BitmexLog.info('fetching Bitmex open orders')

    const { privateRequest } = BitmexHttp

    const rawOrders = await privateRequest<IBitmexOrderSchema[]>({
      verb: AlunaHttpVerbEnum.GET,
      url: `${BitmexSpecs.connectApiUrl}/order`,
      keySecret: this.exchange.keySecret,
      body: { open: true },
    })

    return rawOrders

  }

  public async list (): Promise<IAlunaOrderSchema[]> {

    const rawOrders = await this.listRaw()

    const parsedOrders = await this.parseMany({ rawOrders })

    return parsedOrders

  }

  public async getRaw (
    params: IAlunaOrderGetParams,
  ): Promise<IBitmexOrderSchema> {

    const {
      id,
      symbolPair,
    } = params

    BitmexLog.info('fetching Bitmex order status')

    const rawOrder = await BitmexHttp.privateRequest<IBitmexOrderSchema>({
      verb: AlunaHttpVerbEnum.GET,
      url: `https://api.Bitmex.com/v1/orders/${symbolPair}/orderid/${id}`,
      keySecret: this.exchange.keySecret,
    })

    return rawOrder

  }

  public async get (params: IAlunaOrderGetParams): Promise<IAlunaOrderSchema> {

    const rawOrder = await this.getRaw(params)

    const parsedOrder = await this.parse({ rawOrder })

    return parsedOrder

  }

  public async parse (params: {
    rawOrder: IBitmexOrderSchema,
  }): Promise<IAlunaOrderSchema> {

    const {
      rawOrder,
    } = params

    return rawOrder as any

  }

  public async parseMany (params: {
    rawOrders: IBitmexOrderSchema[],
  }): Promise<IAlunaOrderSchema[]> {

    const { rawOrders } = params

    BitmexLog.info(`parsed ${rawOrders.length} orders for Bitmex`)

    return rawOrders as any

  }

}
