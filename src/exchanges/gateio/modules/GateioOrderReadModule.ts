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
import { GateioHttp } from '../GateioHttp'
import { GateioLog } from '../GateioLog'
import { PROD_GATEIO_URL } from '../GateioSpecs'
import {
  IGateioOrderListResponseSchema,
  IGateioOrderSchema,
} from '../schemas/IGateioOrderSchema'
import { GateioOrderParser } from '../schemas/parsers/GateioOrderParser'



export class GateioOrderReadModule extends AAlunaModule implements IAlunaOrderReadModule {

  public async listRaw ()
    : Promise<IAlunaOrderListRawReturns<IGateioOrderSchema>> {

    GateioLog.info('fetching Gateio open orders')

    let apiRequestCount = 0

    const {
      data: rawOrdersResponse,
      apiRequestCount: requestCount,
    } = await GateioHttp
      .privateRequest<IGateioOrderListResponseSchema[]>({
        verb: AlunaHttpVerbEnum.GET,
        url: `${PROD_GATEIO_URL}/spot/open_orders`,
        keySecret: this.exchange.keySecret,
      })

    const rawOrders = this.detachOrderFromResponse({
      rawOrdersResponse,
    })

    apiRequestCount += 1

    const totalApiRequestCount = apiRequestCount + requestCount

    return {
      rawOrders,
      apiRequestCount: totalApiRequestCount,
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
      + parseManyCount
      + listRawCount

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
      symbolPair,
    } = params

    const query = new URLSearchParams()

    query.append('currency_pair', symbolPair)

    GateioLog.info('fetching Gateio order')

    const {
      data: rawOrder,
      apiRequestCount,
    } = await GateioHttp.privateRequest<IGateioOrderSchema>({
      verb: AlunaHttpVerbEnum.GET,
      url: `${PROD_GATEIO_URL}/spot/orders/${id}?${query.toString()}`,
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
    rawOrder: IGateioOrderSchema,
  }): Promise<IAlunaOrderParseReturns> {


    const { rawOrder } = params

    const parsedOrder = GateioOrderParser.parse({ rawOrder })

    return {
      order: parsedOrder,
      apiRequestCount: 1,
    }

  }

  public async parseMany (params: {
    rawOrders: IGateioOrderSchema[],
  }): Promise<IAlunaOrderParseManyReturns> {

    const { rawOrders } = params

    let apiRequestCount = 0

    const parsedOrders = await Promise.all(
      rawOrders.map(async (rawOrder: any) => {

        const {
          order: parsedOrder,
          apiRequestCount: parseCount,
        } = await this.parse({ rawOrder })

        apiRequestCount += parseCount + 1

        return parsedOrder

      }),
    )

    GateioLog.info(`parsed ${parsedOrders.length} orders for Gateio`)

    return {
      orders: parsedOrders,
      apiRequestCount,
    }

  }

  private detachOrderFromResponse (
    params: {
      rawOrdersResponse: IGateioOrderListResponseSchema[],
    },
  ): IGateioOrderSchema[] {

    const { rawOrdersResponse } = params

    const rawOrders: IGateioOrderSchema[] = []

    rawOrdersResponse.map((rawOrderResponse) => {

      return rawOrders.push(...rawOrderResponse.orders)

    })

    return rawOrders

  }

}
