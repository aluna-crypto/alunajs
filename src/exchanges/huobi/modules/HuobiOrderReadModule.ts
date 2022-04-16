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
import { HuobiHttp } from '../HuobiHttp'
import { HuobiLog } from '../HuobiLog'
import { PROD_HUOBI_URL } from '../HuobiSpecs'
import { IHuobiMarketWithCurrency } from '../schemas/IHuobiMarketSchema'
import { IHuobiOrderSchema } from '../schemas/IHuobiOrderSchema'
import { HuobiOrderParser } from '../schemas/parsers/HuobiOrderParser'
import { HuobiMarketModule } from './HuobiMarketModule'



export class HuobiOrderReadModule extends AAlunaModule implements IAlunaOrderReadModule {

  private getSymbolInfo(
    markets: IHuobiMarketWithCurrency[],
    currencyPair: string,
  ): IHuobiMarketWithCurrency {

    return markets.find((market: IHuobiMarketWithCurrency) => {

      return market.symbol === currencyPair

    })!

  }

  public async listRaw()
    : Promise<IAlunaOrderListRawReturns<IHuobiOrderSchema>> {

    HuobiLog.info('fetching Huobi open orders')

    const {
      data: rawOrders,
      requestCount,
    } = await HuobiHttp.privateRequest<IHuobiOrderSchema[]>({
      verb: AlunaHttpVerbEnum.GET,
      url: `${PROD_HUOBI_URL}/v1/order/openOrders`,
      keySecret: this.exchange.keySecret,
    })

    return {
      rawOrders,
      requestCount,
    }

  }



  public async list(): Promise<IAlunaOrderListReturns> {

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



  public async getRaw(
    params: IAlunaOrderGetParams,
  ): Promise<IAlunaOrderGetRawReturns> {

    const {
      id,
    } = params

    HuobiLog.info('fetching Huobi order status')

    const {
      data: rawOrder,
      requestCount,
    } = await HuobiHttp.privateRequest<IHuobiOrderSchema>({
      verb: AlunaHttpVerbEnum.GET,
      url: `${PROD_HUOBI_URL}/v1/order/orders/${id}`,
      keySecret: this.exchange.keySecret,
    })

    return {
      rawOrder,
      requestCount,
    }

  }



  public async get(params: IAlunaOrderGetParams)
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
    } = await HuobiMarketModule.listRaw()

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



  public async parse(params: {
    rawOrder: IHuobiOrderSchema,
    symbolInfo: IHuobiMarketWithCurrency,
  }): Promise<IAlunaOrderParseReturns> {

    const { rawOrder, symbolInfo } = params

    const parsedOrder = HuobiOrderParser.parse({
      rawOrder,
      symbolInfo,
    })

    return {
      order: parsedOrder,
      requestCount: 0,
    }

  }



  public async parseMany(params: {
    rawOrders: IHuobiOrderSchema[],
  }): Promise<IAlunaOrderParseManyReturns> {

    const { rawOrders } = params

    let requestCount = 0
    let parsedOrders: IAlunaOrderSchema[] = []

    const hasOpenOrders = rawOrders.length > 0

    if (hasOpenOrders) {

      const {
        rawMarkets,
        requestCount: listRawCount,
      } = await HuobiMarketModule.listRaw()

      requestCount += listRawCount

      const promises = rawOrders.map(async (rawOrder: IHuobiOrderSchema) => {

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

    HuobiLog.info(`parsed ${parsedOrders.length} orders for Huobi`)

    const response: IAlunaOrderParseManyReturns = {
      orders: parsedOrders,
      requestCount,
    }

    return response

  }

}
