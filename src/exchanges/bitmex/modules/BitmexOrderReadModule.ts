import { map } from 'lodash'

import { AAlunaModule } from '../../../lib/core/abstracts/AAlunaModule'
import { AlunaError } from '../../../lib/core/AlunaError'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaGenericErrorCodes } from '../../../lib/errors/AlunaGenericErrorCodes'
import {
  IAlunaOrderGetParams,
  IAlunaOrderReadModule,
} from '../../../lib/modules/IAlunaOrderModule'
import { IAlunaOrderSchema } from '../../../lib/schemas/IAlunaOrderSchema'
import { BitmexHttp } from '../BitmexHttp'
import { BitmexLog } from '../BitmexLog'
import { IBitmexOrderSchema } from '../schemas/IBitmexOrderSchema'
import { BitmexOrderParser } from '../schemas/parsers/BitmexOrderParser'
import { BitmexMarketModule } from './BitmexMarketModule'



export class BitmexOrderReadModule extends AAlunaModule implements IAlunaOrderReadModule {

  public async listRaw (): Promise<IBitmexOrderSchema[]> {

    BitmexLog.info('fetching Bitmex open orders')

    const { privateRequest } = BitmexHttp

    const rawOrders = await privateRequest<IBitmexOrderSchema[]>({
      verb: AlunaHttpVerbEnum.GET,
      url: 'https://bitmex.com/api/v1/order',
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

    const rawOrder = await BitmexHttp.privateRequest<IBitmexOrderSchema>({
      verb: AlunaHttpVerbEnum.GET,
      url: 'https://bitmex.com/api/v1/order',
      keySecret: this.exchange.keySecret,
      body: { filter: { orderID: id } },
    })

    return rawOrder

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

    const parsedMarket = await BitmexMarketModule.get!({
      symbolPair: symbol,
    })

    if (!parsedMarket) {

      const error = new AlunaError({
        code: AlunaGenericErrorCodes.PARAM_ERROR,
        message: `Bitmex symbol pair not found for ${symbol}`,
        httpStatusCode: 400,
      })

      BitmexLog.error(error)

      throw error

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
