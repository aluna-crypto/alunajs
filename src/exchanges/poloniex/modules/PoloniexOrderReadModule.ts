import { AAlunaModule } from '../../../lib/core/abstracts/AAlunaModule'
import { AlunaError } from '../../../lib/core/AlunaError'
import { AlunaOrderErrorCodes } from '../../../lib/errors/AlunaOrderErrorCodes'
import {
  IAlunaOrderGetParams,
  IAlunaOrderReadModule,
} from '../../../lib/modules/IAlunaOrderModule'
import { IAlunaOrderSchema } from '../../../lib/schemas/IAlunaOrderSchema'
import { PoloniexOrderStatusEnum } from '../enums/PoloniexOrderStatusEnum'
import { PoloniexHttp } from '../PoloniexHttp'
import { PoloniexLog } from '../PoloniexLog'
import { PROD_POLONIEX_URL } from '../PoloniexSpecs'
import {
  getOrderStatusResponse,
  IPoloniexOrderInfo,
  IPoloniexOrderSchema,
  IPoloniexOrderStatusInfo,
  IPoloniexOrderWithCurrency,
} from '../schemas/IPoloniexOrderSchema'
import { PoloniexOrderParser } from '../schemas/parsers/PoloniexOrderParser'



export class PoloniexOrderReadModule extends AAlunaModule implements IAlunaOrderReadModule {


  private async getOrderStatus (orderNumber: string)
    : Promise<IPoloniexOrderStatusInfo> {

    const timestamp = new Date().getTime()
    const statusParams = new URLSearchParams()

    statusParams.append('command', 'returnOrderStatus')
    statusParams.append('orderNumber', orderNumber)
    statusParams.append('nonce', timestamp.toString())

    const { result } = await PoloniexHttp
      .privateRequest<getOrderStatusResponse>(
        {
          url: `${PROD_POLONIEX_URL}/tradingApi`,
          keySecret: this.exchange.keySecret,
          body: statusParams,
        },
      )

    if (result.error) {

      throw new AlunaError({
        code: AlunaOrderErrorCodes.NOT_FOUND,
        message: result.error as string,
        httpStatusCode: 404,
        metadata: result.error,
      })

    }

    return result[orderNumber]

  }

  private async getOrderTrades (orderNumber: string)
    : Promise<IPoloniexOrderInfo[]> {

    const timestamp = new Date().getTime()
    const statusParams = new URLSearchParams()

    statusParams.append('command', 'returnOrderTrades')
    statusParams.append('orderNumber', orderNumber)
    statusParams.append('nonce', timestamp.toString())

    const rawOrderTrades = await PoloniexHttp
      .privateRequest<IPoloniexOrderInfo[] | { error: string }>({
        url: `${PROD_POLONIEX_URL}/tradingApi`,
        keySecret: this.exchange.keySecret,
        body: statusParams,
      })

    if ('error' in rawOrderTrades) {

      throw new AlunaError({
        code: AlunaOrderErrorCodes.NOT_FOUND,
        message: rawOrderTrades.error as string,
        httpStatusCode: 404,
        metadata: rawOrderTrades,
      })

    }

    return rawOrderTrades

  }

  public async listRaw (): Promise<IPoloniexOrderWithCurrency[]> {

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

    const rawOrdersWithCurrency: IPoloniexOrderWithCurrency[] = []


    currencies.map((currencyPair) => {

      const rawOrder = rawOrders[currencyPair]

      const orderWithCurrency = rawOrder.map((order) => {

        const splittedCurrencyPair = currencyPair.split('_')

        const baseCurrency = splittedCurrencyPair[0]
        const quoteCurrency = splittedCurrencyPair[1]

        return {
          ...order,
          currencyPair,
          baseCurrency,
          quoteCurrency,
        }

      })


      rawOrdersWithCurrency.push(...orderWithCurrency)

      return rawOrdersWithCurrency

    })


    return rawOrdersWithCurrency

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

    let result
    let orderTrades: IPoloniexOrderInfo[] = []

    try {

      result = await this.getOrderStatus(id)

    } catch (err) {

      try {

        orderTrades = await this.getOrderTrades(id)

      } catch (err) {

        throw new AlunaError({
          code: AlunaOrderErrorCodes.ORDER_CANCELLED,
          message: 'This order is already cancelled',
          httpStatusCode: 422,
          metadata: err,
        })

      }

    }

    if (!result && !orderTrades.length) {

      throw new AlunaError({
        code: AlunaOrderErrorCodes.NOT_FOUND,
        message: 'Order not found',
        httpStatusCode: 404,
      })

    }

    if (result) {

      // result doesn't return orderNumber
      const resultWithOrderNumber: IPoloniexOrderStatusInfo = {
        ...result,
        orderNumber: id,
      }

      return resultWithOrderNumber

    }

    const rawOrderTradeWithStatus: IPoloniexOrderStatusInfo = {
      ...orderTrades[0],
      currencyPair: symbolPair,
      status: PoloniexOrderStatusEnum.FILLED,
      orderNumber: id,
    }

    return rawOrderTradeWithStatus

  }



  public async get (params: IAlunaOrderGetParams): Promise<IAlunaOrderSchema> {

    const rawOrder = await this.getRaw(params)

    const parsedOrder = this.parse({ rawOrder })

    return parsedOrder

  }



  public async parse (params: {
    rawOrder: IPoloniexOrderWithCurrency | IPoloniexOrderStatusInfo,
  }): Promise<IAlunaOrderSchema> {

    const { rawOrder } = params

    const parsedOrder = PoloniexOrderParser.parse({ rawOrder })

    return parsedOrder

  }



  public async parseMany (params: {
    rawOrders: IPoloniexOrderWithCurrency[],
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
