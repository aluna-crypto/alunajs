import { AAlunaModule } from '../../../lib/core/abstracts/AAlunaModule'
import { AlunaError } from '../../../lib/core/AlunaError'
import { AlunaOrderErrorCodes } from '../../../lib/errors/AlunaOrderErrorCodes'
import {
  IAlunaOrderGetParams,
  IAlunaOrderGetRawReturns,
  IAlunaOrderGetReturns,
  IAlunaOrderListRawReturns,
  IAlunaOrderListReturns,
  IAlunaOrderParseManyReturns,
  IAlunaOrderParseReturns,
  IAlunaOrderReadModule,
} from '../../../lib/modules/IAlunaOrderModule'
import { BitfinexHttp } from '../BitfinexHttp'
import { BitfinexLog } from '../BitfinexLog'
import { IBitfinexOrderSchema } from '../schemas/IBitfinexOrderSchema'
import { BitfinexOrderParser } from '../schemas/parsers/BitfinexOrderParser'



export class BitfinexOrderReadModule extends AAlunaModule implements IAlunaOrderReadModule {

  public async listRaw ()
    : Promise<IAlunaOrderListRawReturns<IBitfinexOrderSchema>> {

    BitfinexLog.info('fetching Bitfinex open orders')

    const { privateRequest } = BitfinexHttp

    const {
      data: rawOrders,
      apiRequestCount,
    } = await privateRequest<IBitfinexOrderSchema[]>({
      url: 'https://api.bitfinex.com/v2/auth/r/orders',
      keySecret: this.exchange.keySecret,
    })

    return {
      rawOrders,
      apiRequestCount,
    }

  }

  public async list (): Promise<IAlunaOrderListReturns> {

    let apiRequestCount = 0

    const {
      rawOrders,
      apiRequestCount: listRawCount,
    } = await this.listRaw()

    apiRequestCount += 1

    const {
      orders: parsedOrders,
      apiRequestCount: parseManyCount,
    } = await this.parseMany({ rawOrders })

    apiRequestCount += 1

    const totalApiRequestCount = apiRequestCount
            + listRawCount
            + parseManyCount

    return {
      orders: parsedOrders,
      apiRequestCount: totalApiRequestCount,
    }

  }

  public async getRaw (
    params: IAlunaOrderGetParams,
  ): Promise<IAlunaOrderGetRawReturns> {

    const {
      id: stringId,
      symbolPair,
    } = params

    const id = Number(stringId)

    BitfinexLog.info('fetching Bitfinex order status')

    const { privateRequest } = BitfinexHttp

    let response: IBitfinexOrderSchema[]
    let apiRequestCount = 0

    const {
      data: getRawOrders,
      apiRequestCount: requestCount,
    } = await privateRequest<IBitfinexOrderSchema[]>({
      url: `https://api.bitfinex.com/v2/auth/r/orders/${symbolPair}`,
      keySecret: this.exchange.keySecret,
      body: { id: [id] },
    })

    apiRequestCount += requestCount
    response = getRawOrders

    // order do not exists or might not be 'open'
    if (!response.length) {

      const {
        data: getRawOrderHistory,
        apiRequestCount: requestCount2,
      } = await privateRequest<IBitfinexOrderSchema[]>({
        url: `https://api.bitfinex.com/v2/auth/r/orders/${symbolPair}/hist`,
        keySecret: this.exchange.keySecret,
        body: { id: [id] },
      })

      response = getRawOrderHistory
      apiRequestCount += requestCount2

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

    return {
      rawOrder,
      apiRequestCount,
    }

  }

  public async get (params: IAlunaOrderGetParams)
    : Promise<IAlunaOrderGetReturns> {

    let apiRequestCount = 0

    const {
      rawOrder,
      apiRequestCount: getRawCount,
    } = await this.getRaw(params)

    apiRequestCount += 1

    const {
      order: parsedOrder,
      apiRequestCount: parseCount,
    } = await this.parse({ rawOrder })

    apiRequestCount += 1

    const totalApiRequestCount = apiRequestCount
        + getRawCount
        + parseCount

    return {
      order: parsedOrder,
      apiRequestCount: totalApiRequestCount,
    }

  }

  public async parse (params: {
    rawOrder: IBitfinexOrderSchema,
  }): Promise<IAlunaOrderParseReturns> {

    const { rawOrder } = params

    const parsedOrder = BitfinexOrderParser.parse({
      rawOrder,
    })

    return {
      order: parsedOrder,
      apiRequestCount: 1,
    }

  }

  public async parseMany (params: {
    rawOrders: IBitfinexOrderSchema[],
  }): Promise<IAlunaOrderParseManyReturns> {

    const { rawOrders } = params

    let apiRequestCount = 0

    const ordersPromises = rawOrders.reduce(async (acc, rawOrder) => {

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

      const {
        order: parsedOrder,
        apiRequestCount: parseCount,
      } = await this.parse({ rawOrder })

      apiRequestCount += parseCount + 1

      acc.push(parsedOrder)

      return acc

    }, [] as any)

    const parsedOrders = await Promise.all(ordersPromises)

    BitfinexLog.info(`parsed ${parsedOrders.length} orders for Bitfinex`)

    return {
      orders: parsedOrders,
      apiRequestCount,
    }

  }

}
