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
      apiRequestCount,
    } = await ValrHttp.privateRequest<IValrOrderListSchema[]>({
      verb: AlunaHttpVerbEnum.GET,
      url: 'https://api.valr.com/v1/orders/open',
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
      + parseManyCount
      + listRawCount

    const response: IAlunaOrderListReturns = {
      apiRequestCount: totalApiRequestCount,
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
      apiRequestCount,
    } = await ValrHttp.privateRequest<IValrOrderGetSchema>({
      verb: AlunaHttpVerbEnum.GET,
      url: `https://api.valr.com/v1/orders/${symbolPair}/orderid/${id}`,
      keySecret: this.exchange.keySecret,
    })

    return {
      apiRequestCount,
      rawOrder,
    }

  }

  public async get (params: IAlunaOrderGetParams)
    : Promise<IAlunaOrderGetReturns> {

    let apiRequestCount = 0

    const {
      apiRequestCount: getRawCount,
      rawOrder,
    } = await this.getRaw(params)

    apiRequestCount += 1

    const {
      apiRequestCount: parseCount,
      order: parsedOrder,
    } = await this.parse({ rawOrder })

    apiRequestCount += 1

    const totalApiRequestCount = apiRequestCount
    + parseCount
    + getRawCount

    const response: IAlunaOrderGetReturns = {
      order: parsedOrder,
      apiRequestCount: totalApiRequestCount,
    }

    return response

  }

  public async parse (params: {
    rawOrder: IValrOrderListSchema | IValrOrderGetSchema,
    currencyPair?: IValrCurrencyPairs,
  }): Promise<IAlunaOrderParseReturns> {

    const {
      rawOrder,
      currencyPair,
    } = params

    const {
      currencyPair: orderCurrencyPair,
    } = rawOrder

    let pair = currencyPair
    let apiRequestCount = 0

    if (!pair) {

      const {
        currencyPairs: pairs,
        apiRequestCount: fetchCurrencyPairsCount,
      } = await ValrMarketModule.fetchCurrencyPairs()

      apiRequestCount += fetchCurrencyPairsCount + 1

      pair = pairs.find((p) => p.symbol === orderCurrencyPair)

      if (!pair) {

        throw new AlunaError({
          httpStatusCode: 200,
          message: `No symbol pair found for ${orderCurrencyPair}`,
          code: AlunaGenericErrorCodes.PARSER_ERROR,
        })

      }

    }

    const {
      order: parsedOrder,
      apiRequestCount: parseCount,
    } = ValrOrderParser.parse({
      rawOrder,
      currencyPair: pair,
    })

    apiRequestCount += 1

    const totalApiRequestCount = apiRequestCount + parseCount

    const response: IAlunaOrderParseReturns = {
      order: parsedOrder,
      apiRequestCount: totalApiRequestCount,
    }

    return response

  }

  public async parseMany (params: {
    rawOrders: IValrOrderListSchema[],
  }): Promise<IAlunaOrderParseManyReturns> {

    const { rawOrders } = params

    let apiRequestCount = 0

    const {
      currencyPairs,
      apiRequestCount: fetchCurrencyPairsCount,
    } = await ValrMarketModule.fetchCurrencyPairs()

    apiRequestCount += 1

    const currencyPairsDictionary: { [symbol: string]: IValrCurrencyPairs } = {}

    currencyPairs.forEach((pair) => {

      currencyPairsDictionary[pair.symbol] = pair

    })

    const parsedOrdersPromises = rawOrders.map(
      async (rawOrder: IValrOrderListSchema) => {

        const currencyPair = currencyPairsDictionary[rawOrder.currencyPair]

        const {
          order: parsedOrder,
          apiRequestCount: parseCount,
        } = await this.parse({
          rawOrder,
          currencyPair,
        })

        apiRequestCount += parseCount + 1

        return parsedOrder

      },
    )

    const parsedOrders = await Promise.all(parsedOrdersPromises)

    ValrLog.info(`parsed ${parsedOrders.length} orders for Valr`)

    const totalApiRequestCount = fetchCurrencyPairsCount + apiRequestCount

    const response: IAlunaOrderParseManyReturns = {
      orders: parsedOrders,
      apiRequestCount: totalApiRequestCount,
    }

    return response

  }

}
