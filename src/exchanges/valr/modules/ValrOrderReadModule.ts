import { AAlunaModule } from '../../../lib/core/abstracts/AAlunaModule'
import { AlunaError } from '../../../lib/core/AlunaError'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaGenericErrorCodes } from '../../../lib/errors/AlunaGenericErrorCodes'
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
import { IAlunaOrderSchema } from '../../../lib/schemas/IAlunaOrderSchema'
import { IValrCurrencyPairs } from '../schemas/IValrMarketSchema'
import {
  IValrOrderGetSchema,
  IValrOrderListSchema,
} from '../schemas/IValrOrderSchema'
import { ValrOrderParser } from '../schemas/parsers/ValrOrderParser'
import { ValrHttp } from '../ValrHttp'
import { ValrLog } from '../ValrLog'
import { ValrMarketModule } from './ValrMarketModule'



export class ValrOrderReadModule extends AAlunaModule implements IAlunaOrderReadModule {

  public async listRaw ()
    : Promise<IAlunaOrderListRawReturns<IValrOrderListSchema>> {

    ValrLog.info('fetching Valr open orders')

    const {
      data: rawOrders,
      requestCount,
    } = await ValrHttp.privateRequest<IValrOrderListSchema[]>({
      verb: AlunaHttpVerbEnum.GET,
      url: 'https://api.valr.com/v1/orders/open',
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
      + parseManyCount
      + listRawCount

    const response: IAlunaOrderListReturns = {
      requestCount: totalRequestCount,
      orders: parsedOrders,
    }

    return response

  }

  public async getRaw (
    params: IAlunaOrderGetParams,
  ): Promise<IAlunaOrderGetRawReturns> {

    const {
      id,
      symbolPair,
    } = params

    ValrLog.info('fetching Valr order status')

    const {
      data: rawOrder,
      requestCount,
    } = await ValrHttp.privateRequest<IValrOrderGetSchema>({
      verb: AlunaHttpVerbEnum.GET,
      url: `https://api.valr.com/v1/orders/${symbolPair}/orderid/${id}`,
      keySecret: this.exchange.keySecret,
    })

    return {
      requestCount,
      rawOrder,
    }

  }

  public async get (params: IAlunaOrderGetParams)
    : Promise<IAlunaOrderGetReturns> {

    const requestCount = 0

    const {
      requestCount: getRawCount,
      rawOrder,
    } = await this.getRaw(params)

    const {
      requestCount: parseCount,
      order: parsedOrder,
    } = await this.parse({ rawOrder })

    const totalRequestCount = requestCount
    + parseCount
    + getRawCount

    const response: IAlunaOrderGetReturns = {
      order: parsedOrder,
      requestCount: totalRequestCount,
    }

    return response

  }

  public async parse (params: {
    rawOrder: IValrOrderListSchema | IValrOrderGetSchema,
    currencyPair?: IValrCurrencyPairs,
  }): Promise<IAlunaOrderParseReturns> {

    const { rawOrder } = params

    let { currencyPair } = params

    let requestCount = 0

    if (!currencyPair) {

      const {
        currencyPairs: pairs,
        requestCount: fetchCurrencyPairsCount,
      } = await ValrMarketModule.fetchCurrencyPairs()

      requestCount += fetchCurrencyPairsCount

      currencyPair = pairs.find((p) => p.symbol === rawOrder.currencyPair)

      if (!currencyPair) {

        throw new AlunaError({
          httpStatusCode: 200,
          message: `No symbol pair found for ${rawOrder.currencyPair}`,
          code: AlunaGenericErrorCodes.PARSER_ERROR,
        })

      }

    }

    const parsedOrder = ValrOrderParser.parse({
      rawOrder,
      currencyPair,
    })

    const response: IAlunaOrderParseReturns = {
      order: parsedOrder,
      requestCount,
    }

    return response

  }

  public async parseMany (params: {
    rawOrders: IValrOrderListSchema[],
  }): Promise<IAlunaOrderParseManyReturns> {

    const { rawOrders } = params

    let requestCount = 0
    let parsedOrders: IAlunaOrderSchema[] = []

    if (rawOrders.length) {

      const {
        currencyPairs,
        requestCount: fetchCurrencyPairsCount,
      } = await ValrMarketModule.fetchCurrencyPairs()

      requestCount += fetchCurrencyPairsCount

      const currencyPairsDictionary: Record<string, IValrCurrencyPairs> = {}

      currencyPairs.forEach((pair) => {

        currencyPairsDictionary[pair.symbol] = pair

      })

      const parsedOrdersPromises = rawOrders.map(
        async (rawOrder: IValrOrderListSchema) => {

          const currencyPair = currencyPairsDictionary[rawOrder.currencyPair]

          const {
            order: parsedOrder,
            requestCount: parseCount,
          } = await this.parse({
            rawOrder,
            currencyPair,
          })

          requestCount += parseCount

          return parsedOrder

        },
      )

      parsedOrders = await Promise.all(parsedOrdersPromises)

    }

    ValrLog.info(`parsed ${parsedOrders.length} orders for Valr`)

    const response: IAlunaOrderParseManyReturns = {
      orders: parsedOrders,
      requestCount,
    }

    return response

  }

}
