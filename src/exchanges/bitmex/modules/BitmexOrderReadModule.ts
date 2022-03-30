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
      apiRequestCount,
    } = await privateRequest<IBitmexOrderSchema[]>({
      verb: AlunaHttpVerbEnum.GET,
      url: `${PROD_BITMEX_URL}/order`,
      keySecret: this.exchange.keySecret,
      body: { filter: { open: true } },
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
      id,
    } = params

    BitmexLog.info('fetching Bitmex order status')

    const {
      data: orderResponse,
      apiRequestCount,
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
    rawOrder: IBitmexOrderSchema,
  }): Promise<IAlunaOrderParseReturns> {

    const {
      rawOrder,
    } = params

    const { symbol } = rawOrder

    let apiRequestCount = 0

    const {
      market: parsedMarket,
      apiRequestCount: getCount,
    } = await BitmexMarketModule.get({
      id: symbol,
    })

    apiRequestCount += 1

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

    apiRequestCount += 1

    const totalApiRequestCount = apiRequestCount + getCount

    return {
      order: parsedOrder,
      apiRequestCount: totalApiRequestCount,
    }

  }

  public async parseMany (params: {
    rawOrders: IBitmexOrderSchema[],
  }): Promise<IAlunaOrderParseManyReturns> {

    const { rawOrders } = params

    let apiRequestCount = 0

    const promises = map(rawOrders, async (rawOrder) => {

      const {
        order: parsedOrder,
        apiRequestCount: parseCount,
      } = await this.parse({
        rawOrder,
      })

      apiRequestCount += parseCount + 1

      return parsedOrder

    })

    const parsedOrders = await Promise.all(promises)

    BitmexLog.info(`parsed ${parsedOrders.length} orders for Bitmex`)

    return {
      orders: parsedOrders,
      apiRequestCount,
    }

  }

}
