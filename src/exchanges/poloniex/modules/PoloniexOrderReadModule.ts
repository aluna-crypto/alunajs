import { AAlunaModule } from '../../../lib/core/abstracts/AAlunaModule'
import { AlunaError } from '../../../lib/core/AlunaError'
import { AlunaOrderErrorCodes } from '../../../lib/errors/AlunaOrderErrorCodes'
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
import { PoloniexOrderStatusEnum } from '../enums/PoloniexOrderStatusEnum'
import { PoloniexHttp } from '../PoloniexHttp'
import { PoloniexLog } from '../PoloniexLog'
import { PROD_POLONIEX_URL } from '../PoloniexSpecs'
import {
  getOrderStatusResponse,
  IPoloniexOrderInfo,
  IPoloniexOrderResponseReturns,
  IPoloniexOrderSchema,
  IPoloniexOrderStatusInfo,
  IPoloniexOrderWithCurrency,
} from '../schemas/IPoloniexOrderSchema'
import { PoloniexOrderParser } from '../schemas/parsers/PoloniexOrderParser'



export class PoloniexOrderReadModule extends AAlunaModule implements IAlunaOrderReadModule {



  public async listRaw ()
    : Promise<IAlunaOrderListRawReturns<IPoloniexOrderWithCurrency>> {

    PoloniexLog.info('fetching Poloniex open orders')

    const timestamp = new Date().getTime()
    const params = new URLSearchParams()

    params.append('command', 'returnOpenOrders')
    params.append('currencyPair', 'all')
    params.append('nonce', timestamp.toString())

    const {
      data: rawOrders,
      apiRequestCount,
    } = await PoloniexHttp.privateRequest<IPoloniexOrderSchema>({
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


    return {
      rawOrders: rawOrdersWithCurrency,
      apiRequestCount,
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
      symbolPair,
    } = params

    PoloniexLog.info('fetching Poloniex order')

    let result
    let orderTrades: IPoloniexOrderInfo[] = []
    let apiRequestCount = 0

    try {

      const {
        order: rawOrder,
        apiRequestCount: getOrderStatusCount,
      } = await this.getOrderStatus(id)

      result = rawOrder
      apiRequestCount += getOrderStatusCount + 1

    } catch (err) {

      try {

        const {
          order: orderTradesData,
          apiRequestCount: getOrderTradesCount,
        } = await this.getOrderTrades(id)

        orderTrades = orderTradesData
        apiRequestCount += getOrderTradesCount + 1

      } catch (err) {

        throw new AlunaError({
          code: AlunaOrderErrorCodes.ORDER_CANCELLED,
          message: 'This order is already cancelled',
          httpStatusCode: 422,
          metadata: err.metadata,
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

      return {
        rawOrder: resultWithOrderNumber,
        apiRequestCount,
      }

    }

    const rawOrderTradeWithStatus: IPoloniexOrderStatusInfo = {
      ...orderTrades[0],
      currencyPair: symbolPair,
      status: PoloniexOrderStatusEnum.FILLED,
      orderNumber: id,
    }

    return {
      rawOrder: rawOrderTradeWithStatus,
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
    rawOrder: IPoloniexOrderWithCurrency | IPoloniexOrderStatusInfo,
  }): Promise<IAlunaOrderParseReturns> {

    const { rawOrder } = params

    const parsedOrder = PoloniexOrderParser.parse({ rawOrder })

    return {
      order: parsedOrder,
      apiRequestCount: 1,
    }

  }



  public async parseMany (params: {
    rawOrders: IPoloniexOrderWithCurrency[],
  }): Promise<IAlunaOrderParseManyReturns> {

    const { rawOrders } = params

    let apiRequestCount = 0

    const parsedOrders = await Promise.all(
      rawOrders.map(async (rawOrder) => {

        const {
          order: parsedOrder,
          apiRequestCount: parseCount,
        } = await this.parse({ rawOrder })

        apiRequestCount += parseCount + 1

        return parsedOrder

      }),
    )

    PoloniexLog.info(`parsed ${parsedOrders.length} orders for Poloniex`)

    return {
      orders: parsedOrders,
      apiRequestCount,
    }

  }


  private async getOrderStatus (orderNumber: string)
    : Promise<IPoloniexOrderResponseReturns<IPoloniexOrderStatusInfo>> {

    const timestamp = new Date().getTime()
    const statusParams = new URLSearchParams()

    statusParams.append('command', 'returnOrderStatus')
    statusParams.append('orderNumber', orderNumber)
    statusParams.append('nonce', timestamp.toString())

    const { data: { result }, apiRequestCount } = await PoloniexHttp
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

    return {
      order: result[orderNumber],
      apiRequestCount,
    }

  }

  private async getOrderTrades (orderNumber: string)
    : Promise<IPoloniexOrderResponseReturns<IPoloniexOrderInfo[]>> {

    const timestamp = new Date().getTime()
    const statusParams = new URLSearchParams()

    statusParams.append('command', 'returnOrderTrades')
    statusParams.append('orderNumber', orderNumber)
    statusParams.append('nonce', timestamp.toString())

    const {
      data: rawOrderTrades,
      apiRequestCount,
    } = await PoloniexHttp
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

    return {
      order: rawOrderTrades,
      apiRequestCount,
    }

  }

}
