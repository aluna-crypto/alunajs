import { AAlunaModule } from '../../../lib/core/abstracts/AAlunaModule'
import { AlunaError } from '../../../lib/core/AlunaError'
import { AlunaOrderErrorCodes } from '../../../lib/errors/AlunaOrderErrorCodes'
import {
  IAlunaOrderGetParams,
  IAlunaOrderReadModule,
} from '../../../lib/modules/IAlunaOrderModule'
import { IAlunaOrderSchema } from '../../../lib/schemas/IAlunaOrderSchema'
import { PoloniexHttp } from '../PoloniexHttp'
import { PoloniexLog } from '../PoloniexLog'
import { PROD_POLONIEX_URL } from '../PoloniexSpecs'
import {
  IPoloniexOrderSchema,
  IPoloniexOrderStatusInfo,
  IPoloniexOrderStatusSchema,
} from '../schemas/IPoloniexOrderSchema'
import { PoloniexOrderParser } from '../schemas/parsers/PoloniexOrderParser'



export class PoloniexOrderReadModule extends AAlunaModule implements IAlunaOrderReadModule {

  public async listRaw (): Promise<IPoloniexOrderStatusInfo[]> {

    PoloniexLog.info('fetching Poloniex open orders')

    const timestamp = new Date().getTime()
    const params = new URLSearchParams()

    params.append('command', 'returnOpenOrders')
    params.append('currencyPair', 'all')
    params.append('nonce', timestamp.toString())

    const rawOrders = await PoloniexHttp.privateRequest<IPoloniexOrderSchema>({
      url: `${PROD_POLONIEX_URL}/tradingApi`,
      keySecret: this.exchange.keySecret,
      body: params,
    })

    const currencies = Object.keys(rawOrders)

    const rawOrdersWithCurrencyAndStatus: IPoloniexOrderStatusInfo[] = []

    await Promise.all(
      currencies.map(async (currencyPair) => {

        const rawOrder = rawOrders[currencyPair]

        const orderWithStatusAndCurrency = await Promise.all(
          rawOrder.map(async (order) => {

            const { orderNumber } = order

            const timestamp = new Date().getTime()
            const statusParams = new URLSearchParams()

            statusParams.append('command', 'returnOrderStatus')
            statusParams.append('orderNumber', orderNumber)
            statusParams.append('nonce', timestamp.toString())

            const { result } = await PoloniexHttp
              .privateRequest<IPoloniexOrderStatusSchema>({
                url: `${PROD_POLONIEX_URL}/tradingApi`,
                keySecret: this.exchange.keySecret,
                body: statusParams,
              })

            const { status, currencyPair } = result[orderNumber]

            return {
              ...order,
              currencyPair,
              status,
            }

          }),
        )

        rawOrdersWithCurrencyAndStatus.push(...orderWithStatusAndCurrency)

        return orderWithStatusAndCurrency

      }),
    )

    return rawOrdersWithCurrencyAndStatus

  }



  public async list (): Promise<IAlunaOrderSchema[]> {

    const rawOrders = await this.listRaw()

    const parsedOrders = this.parseMany({ rawOrders })

    return parsedOrders

  }



  public async getRaw (
    params: IAlunaOrderGetParams,
  ): Promise<IPoloniexOrderStatusInfo> {

    const {
      id,
      symbolPair,
    } = params

    PoloniexLog.info('fetching Poloniex order')

    const rawOrders = await this.listRaw()

    const rawOrder = rawOrders.find(
      (order) => order.orderNumber === id && order.currencyPair === symbolPair,
    )

    if (!rawOrder) {

      throw new AlunaError({
        code: AlunaOrderErrorCodes.NOT_FOUND,
        message: 'Order not found',
        httpStatusCode: 404,
      })

    }

    return rawOrder

  }



  public async get (params: IAlunaOrderGetParams): Promise<IAlunaOrderSchema> {

    const rawOrder = await this.getRaw(params)

    const parsedOrder = this.parse({ rawOrder })

    return parsedOrder

  }



  public async parse (params: {
    rawOrder: IPoloniexOrderStatusInfo,
  }): Promise<IAlunaOrderSchema> {

    const { rawOrder } = params

    const parsedOrder = PoloniexOrderParser.parse({ rawOrder })

    return parsedOrder

  }



  public async parseMany (params: {
    rawOrders: IPoloniexOrderStatusInfo[],
  }): Promise<IAlunaOrderSchema[]> {

    const { rawOrders } = params

    const parsedOrders = await Promise.all(
      rawOrders.map(async (rawOrder) => {

        const parsedOrder = await this.parse({ rawOrder })

        return parsedOrder

      }),
    )

    PoloniexLog.info(`parsed ${parsedOrders.length} orders for Poloniex`)

    return parsedOrders

  }

}
