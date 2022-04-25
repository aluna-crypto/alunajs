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
import { OkxHttp } from '../OkxHttp'
import { OkxLog } from '../OkxLog'
import { PROD_OKX_URL } from '../OkxSpecs'
import { IOkxOrderSchema } from '../schemas/IOkxOrderSchema'
import { OkxOrderParser } from '../schemas/parsers/OkxOrderParser'



export class OkxOrderReadModule
  extends AAlunaModule
  implements IAlunaOrderReadModule {

  public async listRaw (): Promise<IAlunaOrderListRawReturns<IOkxOrderSchema>> {

    OkxLog.info('fetching Okx open orders')

    const { data: rawOrders, requestCount } = await OkxHttp.privateRequest<
      IOkxOrderSchema[]
    >({
      verb: AlunaHttpVerbEnum.GET,
      url: `${PROD_OKX_URL}/trade/orders-pending`,
      keySecret: this.exchange.keySecret,
    })

    return {
      rawOrders,
      requestCount,
    }

  }

  public async list (): Promise<IAlunaOrderListReturns> {

    let requestCount = 0

    const { rawOrders, requestCount: listRawCount } = await this.listRaw()

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

    const { id, symbolPair } = params

    OkxLog.info('fetching Okx order status')

    const { data: rawOrder, requestCount } = await OkxHttp
      .privateRequest<IOkxOrderSchema>({
        verb: AlunaHttpVerbEnum.GET,
        url: `${PROD_OKX_URL}/trade/order`,
        keySecret: this.exchange.keySecret,
        query: `ordId=${id}&instId=${symbolPair}`,
      })

    return {
      rawOrder,
      requestCount,
    }

  }

  public async get (
    params: IAlunaOrderGetParams,
  ): Promise<IAlunaOrderGetReturns> {

    let requestCount = 0

    const { rawOrder, requestCount: getRawCount } = await this.getRaw(params)

    requestCount += getRawCount

    const { order: parsedOrder, requestCount: parseCount } = await this.parse({
      rawOrder,
    })

    requestCount += parseCount

    return {
      order: parsedOrder,
      requestCount,
    }

  }

  public async parse (params: {
    rawOrder: IOkxOrderSchema,
  }): Promise<IAlunaOrderParseReturns> {

    const { rawOrder } = params

    const parsedOrder = OkxOrderParser.parse({
      rawOrder,
    })

    return {
      order: parsedOrder,
      requestCount: 0,
    }

  }

  public async parseMany (params: {
    rawOrders: IOkxOrderSchema[],
  }): Promise<IAlunaOrderParseManyReturns> {

    const { rawOrders } = params

    let requestCount = 0
    let parsedOrders: IAlunaOrderSchema[] = []

    const hasOpenOrders = rawOrders.length > 0

    if (hasOpenOrders) {

      const promises = rawOrders.map(async (rawOrder: IOkxOrderSchema) => {

        const {
          order: parsedOrder,
          requestCount: parseCount,
        } = await this.parse({ rawOrder })

        requestCount += parseCount

        return parsedOrder

      })

      parsedOrders = await Promise.all(promises)

    }

    OkxLog.info(`parsed ${parsedOrders.length} orders for Okx`)

    const response: IAlunaOrderParseManyReturns = {
      orders: parsedOrders,
      requestCount,
    }

    return response

  }

}
