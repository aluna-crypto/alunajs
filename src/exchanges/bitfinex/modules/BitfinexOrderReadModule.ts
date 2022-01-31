import {
  IAlunaOrderGetParams,
  IAlunaOrderReadModule,
  IAlunaOrderSchema,
} from '../../..'
import { AAlunaModule } from '../../../lib/core/abstracts/AAlunaModule'
import { BitfinexHttp } from '../BitfinexHttp'
import { BitfinexLog } from '../BitfinexLog'
import { IBitfinexOrderSchema } from '../schemas/IBitfinexOrderSchema'



export class BitfinexOrderReadModule extends AAlunaModule implements IAlunaOrderReadModule {

  public async listRaw (): Promise<IBitfinexOrderSchema[]> {

    BitfinexLog.info('fetching Bitfinex open orders')

    const rawOrders = await BitfinexHttp.privateRequest<any[]>({
      url: 'https://api.bitfinex.com/v2/auth/r/orders',
      keySecret: this.exchange.keySecret,
    })

    return rawOrders

  }

  public async list (): Promise<any[]> {

    const rawOrders = await this.listRaw()

    const parsedOrders = await this.parseMany({ rawOrders })

    return parsedOrders

  }

  public async getRaw (
    params: IAlunaOrderGetParams,
  ): Promise<any> {

    BitfinexLog.info('fetching Bitfinex order status')

    return params as any

  }

  public async get (params: IAlunaOrderGetParams): Promise<IAlunaOrderSchema> {

    const rawOrder = await this.getRaw(params)

    const parsedOrder = await this.parse({ rawOrder })

    return parsedOrder

  }

  public async parse (params: {
    rawOrder: any,
  }): Promise<IAlunaOrderSchema> {

    const {
      rawOrder,
    } = params


    return rawOrder as any

  }

  public async parseMany (params: {
    rawOrders: any[],
  }): Promise<IAlunaOrderSchema[]> {


    BitfinexLog.info('parsed 8 orders for Bitfinex')

    return params as any

  }

}
