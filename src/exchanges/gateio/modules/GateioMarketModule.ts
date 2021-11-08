import { IAlunaMarketModule } from '../../../lib/modules/IAlunaMarketModule'
import { IAlunaMarketSchema } from '../../../lib/schemas/IAlunaMarketSchema'
import { GateioHttp } from '../GateioHttp'
import { GateioLog } from '../GateioLog'
import { IGateioCurrencyPairs } from '../schemas/IGateioCurrencyPair'
import {
  IGateioMarketSchema,
  IGateioTickerSchema,
} from '../schemas/IGateioMarketSchema'



export const GateioMarketModule: IAlunaMarketModule = class {

  public static async listRaw (): Promise<IGateioMarketSchema[]> {

    const { publicRequest } = GateioHttp

    GateioLog.info('fetching Gateio currency pairs')

    const rawCurrencyPairs = await publicRequest<IGateioCurrencyPairs[]>({
      url: 'https://api.gateio.ws/api/v4/spot/currency_pairs',
    })

    GateioLog.info('fetching Gateio tickers')

    const rawTickers = await publicRequest<IGateioTickerSchema[]>({
      url: 'https://api.gateio.ws/api/v4/spot/tickers',
    })

    const marketsWithTickers = rawCurrencyPairs.map((currencyPair) => {

      const ticker = rawTickers.filter((ticker) => ticker
        .currency_pair === currencyPair.id)[0]

      const response: IGateioMarketSchema = {
        ...currencyPair,
        ticker,
      }

      return response

    })


    return marketsWithTickers

  }

  public static async list (): Promise<IAlunaMarketSchema[]> {

    // TODO implement me

    throw new Error('not implemented')

  }

  public static parse (params: {
    rawMarket: IGateioMarketSchema,
  }): IAlunaMarketSchema {

    // TODO: Implement me

    throw new Error('not implemented')

  }

  public static parseMany (params: {
    rawMarkets: IGateioMarketSchema[],
  }): IAlunaMarketSchema[] {

    // TODO implement me

    throw new Error('not implemented')

    const parsedMarkets = params.rawMarkets.map(
      (rawMarket) => GateioMarketModule.parse({
        rawMarket,
      }),
    )

    GateioLog.info(`parsed ${parsedMarkets.length} markets for Gateio`)

    return parsedMarkets

  }

}
