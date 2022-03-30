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
      apiRequestCount,
    } = await BittrexHttp.privateRequest<IBittrexOrderSchema[]>({
      verb: AlunaHttpVerbEnum.GET,
      url: `${PROD_BITTREX_URL}/orders/open`,
      keySecret: this.exchange.keySecret,
    })

    return {
      rawOrders,
      apiRequestCount,
    }

  }



  public async list (): Promise<IAlunaOrderListReturns> {

    let apiRequestCount = 0

    const {
      apiRequestCount: listRawCount,
      rawOrders,
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

    BittrexLog.info('fetching Bittrex order status')

    const {
      data: rawOrder,
      apiRequestCount,
    } = await BittrexHttp.privateRequest<IBittrexOrderSchema>({
      verb: AlunaHttpVerbEnum.GET,
      url: `${PROD_BITTREX_URL}/orders/${id}`,
      keySecret: this.exchange.keySecret,
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
      apiRequestCount: getRawCount,
      rawOrder,
    } = await this.getRaw(params)

    apiRequestCount += 1

    const {
      apiRequestCount: parseCount,
      order: parsedOrder,
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
    rawOrder: IBittrexOrderSchema,
  }): Promise<IAlunaOrderParseReturns> {

    const { rawOrder } = params

    const parsedOrder = BittrexOrderParser.parse({ rawOrder })

    return {
      order: parsedOrder,
      apiRequestCount: 1,
    }

  }



  public async parseMany (params: {
    rawOrders: IBittrexOrderSchema[],
  }): Promise<IAlunaOrderParseManyReturns> {

    const { rawOrders } = params

    let apiRequestCount = 0

    const parsedOrders = await Promise.all(
      rawOrders.map(async (rawOrder: any) => {

        const {
          apiRequestCount: parseCount,
          order: parsedOrder,
        } = await this.parse({ rawOrder })

        apiRequestCount += parseCount + 1

        return parsedOrder

      }),
    )

    BittrexLog.info(`parsed ${parsedOrders.length} orders for Bittrex`)

    return {
      orders: parsedOrders,
      apiRequestCount,
    }

  }

}
