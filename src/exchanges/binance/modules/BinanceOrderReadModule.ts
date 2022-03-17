import { AAlunaModule } from '../../../lib/core/abstracts/AAlunaModule'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
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
import { BinanceHttp } from '../BinanceHttp'
import { BinanceLog } from '../BinanceLog'
import { PROD_BINANCE_URL } from '../BinanceSpecs'
import { IBinanceOrderSchema } from '../schemas/IBinanceOrderSchema'
import { BinanceOrderParser } from '../schemas/parses/BinanceOrderParser'
import { BinanceMarketModule } from './BinanceMarketModule'



export class BinanceOrderReadModule extends AAlunaModule implements IAlunaOrderReadModule {

  public async listRaw ()
    : Promise<IAlunaOrderListRawReturns<IBinanceOrderSchema>> {

    BinanceLog.info('fetching Binance open orders')

    const {
      data: rawOrders,
      apiRequestCount,
    } = await BinanceHttp.privateRequest<IBinanceOrderSchema[]>({
      verb: AlunaHttpVerbEnum.GET,
      url: `${PROD_BINANCE_URL}/api/v3/openOrders`,
      keySecret: this.exchange.keySecret,
    })

    return {
      rawOrders,
      apiRequestCount,
    }

  }



  public async list (): Promise<IAlunaOrderListReturns> {

    let apiRequestCount = 1

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
      id,
      symbolPair,
    } = params

    BinanceLog.info('fetching Binance order status')

    const {
      data: rawOrder,
      apiRequestCount,
    } = await BinanceHttp.privateRequest<IBinanceOrderSchema>({
      verb: AlunaHttpVerbEnum.GET,
      url: `${PROD_BINANCE_URL}/api/v3/order`,
      keySecret: this.exchange.keySecret,
      query: `&orderId=${id}&symbol=${symbolPair}`,
    })

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
    rawOrder: IBinanceOrderSchema,
  }): Promise<IAlunaOrderParseReturns> {

    const { rawOrder } = params

    const { symbol: currencyPair } = rawOrder

    let apiRequestCount = 0

    // @TODO -> Move to parseMany()
    const {
      rawMarkets: symbols,
      apiRequestCount: listRawCount,
    } = await BinanceMarketModule.listRaw()

    apiRequestCount += 1

    const symbolInfo = symbols.find((s) => s.symbol === currencyPair)

    const parsedOrder = BinanceOrderParser.parse({
      rawOrder,
      symbolInfo,
    })

    apiRequestCount += 1

    const totalApiRequestCount = listRawCount + apiRequestCount

    return {
      order: parsedOrder,
      apiRequestCount: totalApiRequestCount,
    }

  }



  public async parseMany (params: {
    rawOrders: IBinanceOrderSchema[],
  }): Promise<IAlunaOrderParseManyReturns> {

    const { rawOrders } = params

    let apiRequestCount = 0

    const parsedOrders = await Promise.all(
      rawOrders.map(async (rawOrder: IBinanceOrderSchema) => {

        const {
          order: parsedOrder,
          apiRequestCount: parseCount,
        } = await this.parse({ rawOrder })

        apiRequestCount += parseCount + 1

        return parsedOrder

      }),
    )

    BinanceLog.info(`parsed ${parsedOrders.length} orders for Binance`)

    return {
      orders: parsedOrders,
      apiRequestCount,
    }

  }

}
