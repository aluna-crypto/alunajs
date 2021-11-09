import { IAlunaMarketModule } from '../../../lib/modules/IAlunaMarketModule'
import { IAlunaMarketSchema } from '../../../lib/schemas/IAlunaMarketSchema'
import { GateIOHttp } from '../GateIOHttp'
import { GateIOLog } from '../GateIOLog'
import { IGateIOCurrencyPairs } from '../schemas/IGateIOCurrencyPair'
import {
  IGateIOMarketSchema,
  IGateIOTickerSchema,
} from '../schemas/IGateIOMarketSchema'
import { GateIOMarketParser } from '../schemas/parsers/GateIOMarketParser'



export const GateIOMarketModule: IAlunaMarketModule = class {

  public static async listRaw (): Promise<IGateIOMarketSchema[]> {

    const { publicRequest } = GateIOHttp

    GateIOLog.info('fetching GateIO currency pairs')

    const rawCurrencyPairs = await publicRequest<IGateIOCurrencyPairs[]>({
      url: 'https://api.gateio.ws/api/v4/spot/currency_pairs',
    })

    GateIOLog.info('fetching GateIO tickers')

    const rawTickers = await publicRequest<IGateIOTickerSchema[]>({
      url: 'https://api.gateio.ws/api/v4/spot/tickers',
    })

    const marketsWithTickers = rawCurrencyPairs.map((currencyPair) => {

      const ticker = rawTickers.filter((ticker) => ticker
        .currency_pair === currencyPair.id)[0]

      const response: IGateIOMarketSchema = {
        ...currencyPair,
        ticker,
      }

      return response

    })


    return marketsWithTickers

  }

  public static async list (): Promise<IAlunaMarketSchema[]> {

    return GateIOMarketModule.parseMany({
      rawMarkets: await GateIOMarketModule.listRaw(),
    })

  }

  public static parse (params: {
    rawMarket: IGateIOMarketSchema,
  }): IAlunaMarketSchema {

    return GateIOMarketParser.parse(params)

  }

  public static parseMany (params: {
    rawMarkets: IGateIOMarketSchema[],
  }): IAlunaMarketSchema[] {


    const parsedMarkets = params.rawMarkets.map(
      (rawMarket) => GateIOMarketModule.parse({
        rawMarket,
      }),
    )

    GateIOLog.info(`parsed ${parsedMarkets.length} markets for GateIO`)

    return parsedMarkets

  }

}
