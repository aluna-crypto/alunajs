import { map } from 'lodash'

import { AAlunaModule } from '../../../lib/core/abstracts/AAlunaModule'
import { AlunaError } from '../../../lib/core/AlunaError'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaGenericErrorCodes } from '../../../lib/errors/AlunaGenericErrorCodes'
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
import { BitmexHttp } from '../BitmexHttp'
import { BitmexLog } from '../BitmexLog'
import { PROD_BITMEX_URL } from '../BitmexSpecs'
import { IBitmexOrderSchema } from '../schemas/IBitmexOrderSchema'
import { BitmexOrderParser } from '../schemas/parsers/BitmexOrderParser'
import { BitmexMarketModule } from './BitmexMarketModule'



export class BitmexOrderReadModule extends AAlunaModule implements IAlunaOrderReadModule {

  public async listRaw ()
    : Promise<IAlunaOrderListRawReturns<IBitmexOrderSchema>> {

    BitmexLog.info('fetching Bitmex open orders')

    const { privateRequest } = BitmexHttp

    const {
      data: rawOrders,
      requestCount,
    } = await privateRequest<IBitmexOrderSchema[]>({
      verb: AlunaHttpVerbEnum.GET,
      url: `${PROD_BITMEX_URL}/order`,
      keySecret: this.exchange.keySecret,
      body: { filter: { open: true } },
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
      id,
    } = params

    BitmexLog.info('fetching Bitmex order status')

    const {
      data: orderResponse,
      requestCount,
    } = await BitmexHttp.privateRequest<IBitmexOrderSchema[]>({
      verb: AlunaHttpVerbEnum.GET,
      url: `${PROD_BITMEX_URL}/order`,
      keySecret: this.exchange.keySecret,
      body: { filter: { orderID: id } },
    })

    if (!orderResponse.length) {

      const alunaError = new AlunaError({
        code: AlunaOrderErrorCodes.NOT_FOUND,
        message: `Order not found for id: ${id}`,
      })

      BitmexLog.error(alunaError)

      throw alunaError

    }

    return {
      rawOrder: orderResponse[0],
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
    rawOrder: IBitmexOrderSchema,
  }): Promise<IAlunaOrderParseReturns> {

    const {
      rawOrder,
    } = params

    const { symbol } = rawOrder

    const requestCount = 0

    const {
      market: parsedMarket,
      requestCount: getCount,
    } = await BitmexMarketModule.get({
      id: symbol,
    })

    if (!parsedMarket) {

      const alunaError = new AlunaError({
        code: AlunaGenericErrorCodes.PARAM_ERROR,
        message: `Bitmex symbol pair not found for ${symbol}`,
        httpStatusCode: 400,
      })

      BitmexLog.error(alunaError)

      throw alunaError

    }

    const {
      baseSymbolId,
      quoteSymbolId,
      instrument,
    } = parsedMarket

    const parsedOrder = BitmexOrderParser.parse({
      rawOrder,
      baseSymbolId,
      quoteSymbolId,
      instrument: instrument!,
    })

    const totalRequestCount = requestCount + getCount

    return {
      order: parsedOrder,
      requestCount: totalRequestCount,
    }

  }

  public async parseMany (params: {
    rawOrders: IBitmexOrderSchema[],
  }): Promise<IAlunaOrderParseManyReturns> {

    const { rawOrders } = params

    let requestCount = 0

    const promises = map(rawOrders, async (rawOrder) => {

      const {
        order: parsedOrder,
        requestCount: parseCount,
      } = await this.parse({
        rawOrder,
      })

      requestCount += parseCount

      return parsedOrder

    })

    const parsedOrders = await Promise.all(promises)

    BitmexLog.info(`parsed ${parsedOrders.length} orders for Bitmex`)

    return {
      orders: parsedOrders,
      requestCount,
    }

  }

}
