import { AAlunaModule } from '../../../lib/core/abstracts/AAlunaModule'
import { AlunaError } from '../../../lib/core/AlunaError'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaGenericErrorCodes } from '../../../lib/errors/AlunaGenericErrorCodes'
import {
  IAlunaOrderGetParams,
  IAlunaOrderReadModule,
} from '../../../lib/modules/IAlunaOrderModule'
import { IAlunaOrderSchema } from '../../../lib/schemas/IAlunaOrderSchema'
import { IValrCurrencyPairs } from '../schemas/IValrMarketSchema'
import {
  IValrOrderGetSchema,
  IValrOrderListSchema,
} from '../schemas/IValrOrderSchema'
import { ValrOrderParser } from '../schemas/parsers/ValrOrderParser'
import { ValrHttp } from '../ValrHttp'
import { ValrLog } from '../ValrLog'
import { ValrMarketModule } from './ValrMarketModule'



export class ValrOrderReadModule extends AAlunaModule implements IAlunaOrderReadModule {

  public async listRaw (): Promise<IValrOrderListSchema[]> {

    ValrLog.info('fetching Valr open orders')

    const rawOrders = await ValrHttp.privateRequest<IValrOrderListSchema[]>({
      verb: AlunaHttpVerbEnum.GET,
      url: 'https://api.valr.com/v1/orders/open',
      keySecret: this.exchange.keySecret,
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
  ): Promise<IValrOrderGetSchema> {

    const {
      id,
      symbolPair,
    } = params

    ValrLog.info('fetching Valr order status')

    const rawOrder = await ValrHttp.privateRequest<IValrOrderGetSchema>({
      verb: AlunaHttpVerbEnum.GET,
      url: `https://api.valr.com/v1/orders/${symbolPair}/orderid/${id}`,
      keySecret: this.exchange.keySecret,
    })

    return rawOrder

  }

  public async get (params: IAlunaOrderGetParams): Promise<IAlunaOrderSchema> {

    const rawOrder = await this.getRaw(params)

    const parsedOrder = await this.parse({ rawOrder })

    return parsedOrder

  }

  public async parse (params: {
    rawOrder: IValrOrderListSchema | IValrOrderGetSchema,
    currencyPair?: IValrCurrencyPairs,
  }): Promise<IAlunaOrderSchema> {

    const {
      rawOrder,
      currencyPair,
    } = params

    const {
      currencyPair: orderCurrencyPair,
    } = rawOrder

    let pair = currencyPair

    if (!pair) {

      const pairs = await ValrMarketModule.fetchCurrencyPairs()

      pair = pairs.find((p) => p.symbol === orderCurrencyPair)

      if (!pair) {

        throw new AlunaError({
          httpStatusCode: 200,
          message: `No symbol pair found for ${orderCurrencyPair}`,
          code: AlunaGenericErrorCodes.PARSER_ERROR,
        })

      }

    }

    const parsedOrder = ValrOrderParser.parse({
      rawOrder,
      currencyPair: pair,
    })

    return parsedOrder

  }

  public async parseMany (params: {
    rawOrders: IValrOrderListSchema[],
  }): Promise<IAlunaOrderSchema[]> {

    const { rawOrders } = params

    const currencyPairs = await ValrMarketModule.fetchCurrencyPairs()

    const currencyPairsDictionary: { [symbol: string]: IValrCurrencyPairs } = {}

    currencyPairs.forEach((pair) => {

      currencyPairsDictionary[pair.symbol] = pair

    })

    const parsedOrdersPromises = rawOrders.map(
      async (rawOrder: IValrOrderListSchema) => {

        const currencyPair = currencyPairsDictionary[rawOrder.currencyPair]

        const parsedOrder = await this.parse({
          rawOrder,
          currencyPair,
        })

        return parsedOrder

      },
    )

    const parsedOrders = await Promise.all(parsedOrdersPromises)

    ValrLog.info(`parsed ${parsedOrders.length} orders for Valr`)

    return parsedOrders

  }

}
