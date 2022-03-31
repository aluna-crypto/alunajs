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
import { BittrexHttp } from '../BittrexHttp'
import { BittrexLog } from '../BittrexLog'
import { PROD_BITTREX_URL } from '../BittrexSpecs'
import { IBittrexOrderSchema } from '../schemas/IBittrexOrderSchema'
import { BittrexOrderParser } from '../schemas/parses/BittrexOrderParser'



export class BittrexOrderReadModule extends AAlunaModule implements IAlunaOrderReadModule {

  public async listRaw ()
    : Promise<IAlunaOrderListRawReturns<IBittrexOrderSchema>> {

    BittrexLog.info('fetching Bittrex open orders')

    const {
      data: rawOrders,
      requestCount,
    } = await BittrexHttp.privateRequest<IBittrexOrderSchema[]>({
      verb: AlunaHttpVerbEnum.GET,
      url: `${PROD_BITTREX_URL}/orders/open`,
      keySecret: this.exchange.keySecret,
    })

    return {
      rawOrders,
      requestCount,
    }

  }



  public async list (): Promise<IAlunaOrderListReturns> {

    const requestCount = 0

    const {
      requestCount: listRawCount,
      rawOrders,
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

    BittrexLog.info('fetching Bittrex order status')

    const {
      data: rawOrder,
      requestCount,
    } = await BittrexHttp.privateRequest<IBittrexOrderSchema>({
      verb: AlunaHttpVerbEnum.GET,
      url: `${PROD_BITTREX_URL}/orders/${id}`,
      keySecret: this.exchange.keySecret,
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
      requestCount: getRawCount,
      rawOrder,
    } = await this.getRaw(params)

    const {
      requestCount: parseCount,
      order: parsedOrder,
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
    rawOrder: IBittrexOrderSchema,
  }): Promise<IAlunaOrderParseReturns> {

    const { rawOrder } = params

    const parsedOrder = BittrexOrderParser.parse({ rawOrder })

    return {
      order: parsedOrder,
      requestCount: 0,
    }

  }



  public async parseMany (params: {
    rawOrders: IBittrexOrderSchema[],
  }): Promise<IAlunaOrderParseManyReturns> {

    const { rawOrders } = params

    let requestCount = 0

    const parsedOrders = await Promise.all(
      rawOrders.map(async (rawOrder: any) => {

        const {
          requestCount: parseCount,
          order: parsedOrder,
        } = await this.parse({ rawOrder })

        requestCount += parseCount

        return parsedOrder

      }),
    )

    BittrexLog.info(`parsed ${parsedOrders.length} orders for Bittrex`)

    return {
      orders: parsedOrders,
      requestCount,
    }

  }

}
