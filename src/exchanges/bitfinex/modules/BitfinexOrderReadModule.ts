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
      requestCount,
    } = await privateRequest<IBitfinexOrderSchema[]>({
      url: 'https://api.bitfinex.com/v2/auth/r/orders',
      keySecret: this.exchange.keySecret,
    })

    return {
      rawOrders,
      requestCount,
    }

  }

  public async list (): Promise<IAlunaOrderListReturns> {

    const requestCount = 0

    const {
      rawOrders,
      requestCount: listRawCount,
    } = await this.listRaw()

    const {
      orders: parsedOrders,
      requestCount: parseManyCount,
    } = await this.parseMany({ rawOrders })

    const totalRequestCount = requestCount
            + listRawCount
            + parseManyCount

    return {
      orders: parsedOrders,
      requestCount: totalRequestCount,
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
    let requestCount = 0

    const {
      data: getRawOrders,
      requestCount: privateRequestCount,
    } = await privateRequest<IBitfinexOrderSchema[]>({
      url: `https://api.bitfinex.com/v2/auth/r/orders/${symbolPair}`,
      keySecret: this.exchange.keySecret,
      body: { id: [id] },
    })

    requestCount += privateRequestCount
    response = getRawOrders

    // order do not exists or might not be 'open'
    if (!response.length) {

      const {
        data: getRawOrderHistory,
        requestCount: requestCount2,
      } = await privateRequest<IBitfinexOrderSchema[]>({
        url: `https://api.bitfinex.com/v2/auth/r/orders/${symbolPair}/hist`,
        keySecret: this.exchange.keySecret,
        body: { id: [id] },
      })

      response = getRawOrderHistory
      requestCount += requestCount2

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
      requestCount,
    }

  }

  public async get (params: IAlunaOrderGetParams)
    : Promise<IAlunaOrderGetReturns> {

    const requestCount = 0

    const {
      rawOrder,
      requestCount: getRawCount,
    } = await this.getRaw(params)

    const {
      order: parsedOrder,
      requestCount: parseCount,
    } = await this.parse({ rawOrder })

    const totalRequestCount = requestCount
        + getRawCount
        + parseCount

    return {
      order: parsedOrder,
      requestCount: totalRequestCount,
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
      requestCount: 0,
    }

  }

  public async parseMany (params: {
    rawOrders: IBitfinexOrderSchema[],
  }): Promise<IAlunaOrderParseManyReturns> {

    const { rawOrders } = params

    let requestCount = 0

    const ordersPromises = rawOrders.reduce(
      (acc, rawOrder) => {

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

        const parseOrderResponse = this.parse({ rawOrder })



        acc.push(parseOrderResponse)

        return acc

      }, [] as any[],
    )

    const parsedOrders = await Promise.all(ordersPromises).then((res) => {

      return res.map((parsedOrderResp) => {

        const { order, requestCount: parseCount } = parsedOrderResp

        requestCount += parseCount

        return order

      })

    })

    BitfinexLog.info(`parsed ${parsedOrders.length} orders for Bitfinex`)

    return {
      orders: parsedOrders,
      requestCount,
    }

  }

}
