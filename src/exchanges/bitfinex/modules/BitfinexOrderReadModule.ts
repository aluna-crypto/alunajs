import {
  AlunaError,
  AlunaOrderErrorCodes,
  IAlunaOrderGetParams,
  IAlunaOrderReadModule,
  IAlunaOrderSchema,
} from '../../..'
import { AAlunaModule } from '../../../lib/core/abstracts/AAlunaModule'
import { BitfinexHttp } from '../BitfinexHttp'
import { BitfinexLog } from '../BitfinexLog'
import { IBitfinexOrderSchema } from '../schemas/IBitfinexOrderSchema'
import { BitfinexOrderParser } from '../schemas/parsers/BitfinexOrderParser'



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

  public async list (): Promise<IAlunaOrderSchema[]> {

    const rawOrders = await this.listRaw()

    const parsedOrders = await this.parseMany({ rawOrders })

    return parsedOrders

  }

  public async getRaw (
    params: IAlunaOrderGetParams,
  ): Promise<IBitfinexOrderSchema> {

    const {
      id,
      symbolPair,
    } = params

    BitfinexLog.info('fetching Bitfinex order status')

    const { privateRequest } = BitfinexHttp

    let response: IBitfinexOrderSchema[]

    response = await privateRequest<IBitfinexOrderSchema[]>({
      url: `https://api.bitfinex.com/v2/auth/r/orders/${symbolPair}`,
      keySecret: this.exchange.keySecret,
      body: { id: [id] },
    })

    // order do not exists or might not be 'open'
    if (!response.length) {

      response = await privateRequest<IBitfinexOrderSchema[]>({
        url: `https://api.bitfinex.com/v2/auth/r/orders/${symbolPair}/hist`,
        keySecret: this.exchange.keySecret,
        body: { id: [id] },
      })

      if (!response.length) {

        const error = new AlunaError({
          code: AlunaOrderErrorCodes.NOT_FOUND,
          message: 'Order was not found.',
          metadata: params,
        })

        BitfinexLog.error(error)

        throw error

      }

    }

    const [rawOrder] = response

    return rawOrder

  }

  public async get (params: IAlunaOrderGetParams): Promise<IAlunaOrderSchema> {

    const rawOrder = await this.getRaw(params)

    const parsedOrder = await this.parse({ rawOrder })

    return parsedOrder

  }

  public async parse (params: {
    rawOrder: IBitfinexOrderSchema,
  }): Promise<IAlunaOrderSchema> {

    const { rawOrder } = params

    const parsedOrder = BitfinexOrderParser.parse({ rawOrder })

    return parsedOrder

  }

  public async parseMany (params: {
    rawOrders: IBitfinexOrderSchema[],
  }): Promise<IAlunaOrderSchema[]> {

    const { rawOrders } = params

    const ordersPromises = rawOrders.reduce((acc, rawOrder) => {

      const [
        _id,
        _gid,
        _cid,
        symbol,
      ] = rawOrder

      // skipping 'funding' and 'derivatives' orders for now
      if (/f|F0/.test(symbol)) {

        return acc

      }

      const parsedOrder = this.parse({ rawOrder })

      acc.push(parsedOrder)

      return acc

    }, [] as Array<Promise<IAlunaOrderSchema>>)

    const parsedOrders = await Promise.all(ordersPromises)

    BitfinexLog.info(`parsed ${parsedOrders.length} orders for Bitfinex`)

    return parsedOrders

  }

}
