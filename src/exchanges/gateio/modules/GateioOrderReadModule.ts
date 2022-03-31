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

    const requestCount = 0

    const {
      data: rawOrdersResponse,
      requestCount: privateRequestCount,
    } = await GateioHttp
      .privateRequest<IGateioOrderListResponseSchema[]>({
        verb: AlunaHttpVerbEnum.GET,
        url: `${PROD_GATEIO_URL}/spot/open_orders`,
        keySecret: this.exchange.keySecret,
      })

    const rawOrders = this.detachOrderFromResponse({
      rawOrdersResponse,
    })


    const totalRequestCount = requestCount + privateRequestCount

    return {
      rawOrders,
      requestCount: totalRequestCount,
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
      + parseManyCount
      + listRawCount

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
      symbolPair,
    } = params

    const query = new URLSearchParams()

    query.append('currency_pair', symbolPair)

    GateioLog.info('fetching Gateio order')

    const {
      data: rawOrder,
      requestCount,
    } = await GateioHttp.privateRequest<IGateioOrderSchema>({
      verb: AlunaHttpVerbEnum.GET,
      url: `${PROD_GATEIO_URL}/spot/orders/${id}?${query.toString()}`,
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
    rawOrder: IGateioOrderSchema,
  }): Promise<IAlunaOrderParseReturns> {


    const { rawOrder } = params

    const parsedOrder = GateioOrderParser.parse({ rawOrder })

    return {
      order: parsedOrder,
      requestCount: 0,
    }

  }

  public async parseMany (params: {
    rawOrders: IGateioOrderSchema[],
  }): Promise<IAlunaOrderParseManyReturns> {

    const { rawOrders } = params

    let requestCount = 0

    const parsedOrders = await Promise.all(
      rawOrders.map(async (rawOrder: any) => {

        const {
          order: parsedOrder,
          requestCount: parseCount,
        } = await this.parse({ rawOrder })

        requestCount += parseCount

        return parsedOrder

      }),
    )

    GateioLog.info(`parsed ${parsedOrders.length} orders for Gateio`)

    return {
      orders: parsedOrders,
      requestCount,
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
