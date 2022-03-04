import { AAlunaModule } from '../../../lib/core/abstracts/AAlunaModule'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaOrderGetParams,
  IAlunaOrderReadModule,
} from '../../../lib/modules/IAlunaOrderModule'
import { IAlunaOrderSchema } from '../../../lib/schemas/IAlunaOrderSchema'
import { GateioHttp } from '../GateioHttp'
import { GateioLog } from '../GateioLog'
import { PROD_GATEIO_URL } from '../GateioSpecs'
import {
  IGateioOrderListResponseSchema,
  IGateioOrderSchema,
} from '../schemas/IGateioOrderSchema'
import { GateioOrderParser } from '../schemas/parsers/GateioOrderParser'



export class GateioOrderReadModule extends AAlunaModule implements IAlunaOrderReadModule {

  public async listRaw (): Promise<IGateioOrderSchema[]> {

    GateioLog.info('fetching Gateio open orders')

    const rawOrdersResponse = await GateioHttp
      .privateRequest<IGateioOrderListResponseSchema[]>({
        verb: AlunaHttpVerbEnum.GET,
        url: `${PROD_GATEIO_URL}/spot/open_orders`,
        keySecret: this.exchange.keySecret,
      })

    const rawOrders = this.detachOrderFromResponse({
      rawOrdersResponse,
    })

    return rawOrders

  }



  public async list (): Promise<IAlunaOrderSchema[]> {

    const rawOrders = await this.listRaw()

    const parsedOrders = this.parseMany({ rawOrders })

    return parsedOrders

  }

  public async getRaw (
    params: IAlunaOrderGetParams,
  ): Promise<IGateioOrderSchema> {

    const {
      id,
      symbolPair,
    } = params

    const query = new URLSearchParams()

    query.append('currency_pair', symbolPair)

    GateioLog.info('fetching Gateio order')

    const rawOrder = await GateioHttp.privateRequest<IGateioOrderSchema>({
      verb: AlunaHttpVerbEnum.GET,
      url: `${PROD_GATEIO_URL}/spot/orders/${id}?${query.toString()}`,
      keySecret: this.exchange.keySecret,
    })

    return rawOrder

  }

  public async get (params: IAlunaOrderGetParams): Promise<IAlunaOrderSchema> {

    const rawOrder = await this.getRaw(params)

    const parsedOrder = this.parse({ rawOrder })

    return parsedOrder

  }

  public async parse (params: {
    rawOrder: IGateioOrderSchema,
  }): Promise<IAlunaOrderSchema> {


    const { rawOrder } = params

    const parsedOrder = GateioOrderParser.parse({ rawOrder })

    return parsedOrder

  }

  public async parseMany (params: {
    rawOrders: IGateioOrderSchema[],
  }): Promise<IAlunaOrderSchema[]> {

    const { rawOrders } = params

    const parsedOrders = await Promise.all(
      rawOrders.map(async (rawOrder: any) => {

        const parsedOrder = await this.parse({ rawOrder })

        return parsedOrder

      }),
    )

    GateioLog.info(`parsed ${parsedOrders.length} orders for Gateio`)

    return parsedOrders

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
