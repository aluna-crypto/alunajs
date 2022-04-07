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
import { IAlunaOrderSchema } from '../../../lib/schemas/IAlunaOrderSchema'
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

    let requestCount = 0

    const {
      rawOrders,
      requestCount: listRawCount,
    } = await this.listRaw()

    requestCount += listRawCount

    const {
      orders: parsedOrders,
      requestCount: parseManyCount,
    } = await this.parseMany({ rawOrders })

    requestCount += parseManyCount

    return {
      orders: parsedOrders,
      requestCount,
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

    let requestCount = 0

    const {
      rawOrder,
      requestCount: getRawCount,
    } = await this.getRaw(params)

    const { symbol: currencyPair } = rawOrder

    requestCount += getRawCount

    const {
      rawMarkets,
      requestCount: listRawCount,
    } = await BinanceMarketModule.listRaw()

    requestCount += listRawCount

    const symbolInfo = this.getSymbolInfo(rawMarkets, currencyPair)

    const {
      order: parsedOrder,
      requestCount: parseCount,
    } = await this.parse({ rawOrder, symbolInfo })

    requestCount += parseCount

    return {
      order: parsedOrder,
      requestCount,
    }

  }



  public async parse (params: {
    rawOrder: IBinanceOrderSchema,
    symbolInfo: IBinanceMarketWithCurrency,
  }): Promise<IAlunaOrderParseReturns> {

    const { rawOrder, symbolInfo } = params

    const parsedOrder = BinanceOrderParser.parse({
      rawOrder,
      symbolInfo,
    })

    return {
      order: parsedOrder,
      requestCount: 0,
    }

  }



  public async parseMany (params: {
    rawOrders: IBinanceOrderSchema[],
  }): Promise<IAlunaOrderParseManyReturns> {

    const { rawOrders } = params

    let requestCount = 0
    let parsedOrders: IAlunaOrderSchema[] = []

    const hasOpenOrders = rawOrders.length > 0

    if (hasOpenOrders) {

      const {
        rawMarkets,
        requestCount: listRawCount,
      } = await BinanceMarketModule.listRaw()

      requestCount += listRawCount

      const promises = rawOrders.map(async (rawOrder: IBinanceOrderSchema) => {

        const { symbol: currencyPair } = rawOrder

        const symbolInfo = this.getSymbolInfo(rawMarkets, currencyPair)

        const {
          order: parsedOrder,
          requestCount: parseCount,
        } = await this.parse({ rawOrder, symbolInfo })

        requestCount += parseCount

        return parsedOrder

      })

      parsedOrders = await Promise.all(promises)

    }

    BinanceLog.info(`parsed ${parsedOrders.length} orders for Binance`)

    const response: IAlunaOrderParseManyReturns = {
      orders: parsedOrders,
      requestCount,
    }

    return response

  }

}
