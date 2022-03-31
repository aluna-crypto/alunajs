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
import { IBinanceMarketWithCurrency } from '../schemas/IBinanceMarketSchema'
import { IBinanceOrderSchema } from '../schemas/IBinanceOrderSchema'
import { BinanceOrderParser } from '../schemas/parses/BinanceOrderParser'
import { BinanceMarketModule } from './BinanceMarketModule'



export class BinanceOrderReadModule extends AAlunaModule implements IAlunaOrderReadModule {

  private getSymbolInfo (
    markets: IBinanceMarketWithCurrency[],
    currencyPair: string,
  ): IBinanceMarketWithCurrency {

    return markets.find((market: IBinanceMarketWithCurrency) => {

      return market.symbol === currencyPair

    })!

  }

  public async listRaw ()
    : Promise<IAlunaOrderListRawReturns<IBinanceOrderSchema>> {

    BinanceLog.info('fetching Binance open orders')

    const {
      data: rawOrders,
      requestCount,
    } = await BinanceHttp.privateRequest<IBinanceOrderSchema[]>({
      verb: AlunaHttpVerbEnum.GET,
      url: `${PROD_BINANCE_URL}/api/v3/openOrders`,
      keySecret: this.exchange.keySecret,
    })

    return {
      rawOrders,
      requestCount,
    }

  }



  public async list (): Promise<IAlunaOrderListReturns> {

    let requestCount = 1

    const {
      rawOrders,
      requestCount: listRawCount,
    } = await this.listRaw()

    requestCount += 1

    const {
      orders: parsedOrders,
      requestCount: parseManyCount,
    } = await this.parseMany({ rawOrders })

    requestCount += 1

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
      id,
      symbolPair,
    } = params

    BinanceLog.info('fetching Binance order status')

    const {
      data: rawOrder,
      requestCount,
    } = await BinanceHttp.privateRequest<IBinanceOrderSchema>({
      verb: AlunaHttpVerbEnum.GET,
      url: `${PROD_BINANCE_URL}/api/v3/order`,
      keySecret: this.exchange.keySecret,
      query: `&orderId=${id}&symbol=${symbolPair}`,
    })

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

    const { symbol: currencyPair } = rawOrder

    const {
      rawMarkets,
      requestCount: listRawCount,
    } = await BinanceMarketModule.listRaw()

    const symbolInfo = this.getSymbolInfo(rawMarkets, currencyPair)

    const {
      order: parsedOrder,
      requestCount: parseCount,
    } = await this.parse({ rawOrder, symbolInfo })

    const totalRequestCount = requestCount
      + getRawCount
      + parseCount
      + listRawCount

    return {
      order: parsedOrder,
      requestCount: totalRequestCount,
    }

  }



  public async parse (params: {
    rawOrder: IBinanceOrderSchema,
    symbolInfo: IBinanceMarketWithCurrency,
  }): Promise<IAlunaOrderParseReturns> {

    const { rawOrder, symbolInfo } = params

    const requestCount = 0

    const parsedOrder = BinanceOrderParser.parse({
      rawOrder,
      symbolInfo,
    })

    return {
      order: parsedOrder,
      requestCount,
    }

  }



  public async parseMany (params: {
    rawOrders: IBinanceOrderSchema[],
  }): Promise<IAlunaOrderParseManyReturns> {

    const { rawOrders } = params

    let requestCount = 0
    const hasOpenOrders = rawOrders.length > 0

    if (!hasOpenOrders) {

      return {
        orders: [],
        requestCount,
      }

    }

    const {
      rawMarkets,
      requestCount: listRawCount,
    } = await BinanceMarketModule.listRaw()

    const parsedOrders = await Promise.all(
      rawOrders.map(async (rawOrder: IBinanceOrderSchema) => {

        const { symbol: currencyPair } = rawOrder

        const symbolInfo = this.getSymbolInfo(rawMarkets, currencyPair)

        const {
          order: parsedOrder,
          requestCount: parseCount,
        } = await this.parse({ rawOrder, symbolInfo })

        requestCount += parseCount

        return parsedOrder

      }),
    )

    BinanceLog.info(`parsed ${parsedOrders.length} orders for Binance`)

    const totalRequestCount = requestCount + listRawCount

    return {
      orders: parsedOrders,
      requestCount: totalRequestCount,
    }

  }

}
