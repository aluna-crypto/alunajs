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

    const { privateRequest } = BitfinexHttp

    const rawOrders = await privateRequest<IBitfinexOrderSchema[]>({
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
    rawOrder: IBitfinexOrderSchema,
  }): Promise<IAlunaOrderSchema> {

    const {
      rawOrder,
    } = params


    return rawOrder as any

  }

  public async parseMany (params: {
    rawOrders: IBitfinexOrderSchema[],
  }): Promise<IAlunaOrderSchema[]> {

    BitfinexLog.info('parsed 8 orders for Bitfinex')

    const { rawOrders } = params

    const ordersPromises = rawOrders.reduce((acc, rawOrder) => {

      const [
        _id,
        _gid,
        _cid,
        symbol,
      ] = rawOrder

      // skipping 'funding' and 'derivative' orders for now
      if (/f|F0/.test(symbol)) {

        return acc

      }

      const parsedOrder = this.parse({ rawOrder })

      acc.push(parsedOrder)

      return acc

    }, [] as Array<Promise<IAlunaOrderSchema>>)

    const parsedOrders = await Promise.all(ordersPromises)

    return parsedOrders

  }

}
