import { map } from 'lodash'

import { AAlunaModule } from '../../../lib/core/abstracts/AAlunaModule'
import { AlunaError } from '../../../lib/core/AlunaError'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaGenericErrorCodes } from '../../../lib/errors/AlunaGenericErrorCodes'
import { AlunaOrderErrorCodes } from '../../../lib/errors/AlunaOrderErrorCodes'
import {
  IAlunaOrderGetParams,
  IAlunaOrderReadModule,
} from '../../../lib/modules/IAlunaOrderModule'
import { IAlunaOrderSchema } from '../../../lib/schemas/IAlunaOrderSchema'
import { BitmexHttp } from '../BitmexHttp'
import { BitmexLog } from '../BitmexLog'
import { PROD_BITMEX_URL } from '../BitmexSpecs'
import { IBitmexOrderSchema } from '../schemas/IBitmexOrderSchema'
import { BitmexOrderParser } from '../schemas/parsers/BitmexOrderParser'
import { BitmexMarketModule } from './BitmexMarketModule'



export class BitmexOrderReadModule extends AAlunaModule implements IAlunaOrderReadModule {

  public async listRaw (): Promise<IBitmexOrderSchema[]> {

    BitmexLog.info('fetching Bitmex open orders')

    const { privateRequest } = BitmexHttp

    const rawOrders = await privateRequest<IBitmexOrderSchema[]>({
      verb: AlunaHttpVerbEnum.GET,
      url: `${PROD_BITMEX_URL}/order`,
      keySecret: this.exchange.keySecret,
      body: { filter: { open: true } },
    })

    return rawOrders

  }

  public async list (): Promise<IAlunaOrderSchema[]> {

    const rawOrders = await this.listRaw()

    const parsedOrders = await this.parseMany({ rawOrders })

    return parsedOrders

  }

  public async getRaw (
    params: IAlunaOrderGetParams,
  ): Promise<IBitmexOrderSchema> {

    const {
      id,
    } = params

    BitmexLog.info('fetching Bitmex order status')

    const orderRes = await BitmexHttp.privateRequest<IBitmexOrderSchema[]>({
      verb: AlunaHttpVerbEnum.GET,
      url: `${PROD_BITMEX_URL}/order`,
      keySecret: this.exchange.keySecret,
      body: { filter: { orderID: id } },
    })

    if (!orderRes.length) {

      const alunaError = new AlunaError({
        code: AlunaOrderErrorCodes.NOT_FOUND,
        message: `Order not found for id: ${id}`,
      })

      BitmexLog.error(alunaError)

      throw alunaError

    }

    return orderRes[0]

  }

  public async get (params: IAlunaOrderGetParams): Promise<IAlunaOrderSchema> {

    const rawOrder = await this.getRaw(params)

    const parsedOrder = await this.parse({ rawOrder })

    return parsedOrder

  }

  public async parse (params: {
    rawOrder: IBitmexOrderSchema,
  }): Promise<IAlunaOrderSchema> {

    const {
      rawOrder,
    } = params

    const { symbol } = rawOrder

    const parsedMarket = await BitmexMarketModule.get({
      symbolPair: symbol,
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

    return parsedOrder

  }

  public async parseMany (params: {
    rawOrders: IBitmexOrderSchema[],
  }): Promise<IAlunaOrderSchema[]> {

    const { rawOrders } = params

    const promises = map(rawOrders, async (rawOrder) => {

      const parsedOrder = await this.parse({
        rawOrder,
      })

      return parsedOrder

    })

    const parsedOrders = await Promise.all(promises)

    BitmexLog.info(`parsed ${parsedOrders.length} orders for Bitmex`)

    return parsedOrders

  }

}
