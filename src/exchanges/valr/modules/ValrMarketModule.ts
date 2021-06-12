import { IAlunaMarketModule } from '../../../lib/modules/IAlunaMarketModule'
import { IAlunaMarketSchema } from '../../../lib/schemas/IAlunaMarketSchema'
import { IValrCurrencyPairs } from '../schemas/IValrCurrencyPairs'
import { IValrMarketSchema } from '../schemas/IValrMarketSchema'
import { ValrCurrencyPairsParser } from '../schemas/parsers/ValrCurrencyPairsParser'
import { ValrMarketParser } from '../schemas/parsers/ValrMarketParser'
import { ValrHttp } from '../ValrHttp'
import { ValrLog } from '../ValrLog'



export interface IMarketWithCurrency extends IValrMarketSchema {
  baseCurrency: string
  quoteCurrency: string
}



export const ValrMarketModule: IAlunaMarketModule = class {

  public static async listRaw (): Promise<IMarketWithCurrency[]> {

    const { publicRequest } = ValrHttp

    ValrLog.info('fetching Valr markets')

    const rawMarkets = await publicRequest<IValrMarketSchema[]>({
      url: 'https://api.valr.com/v1/public/marketsummary',
    })

    ValrLog.info('fetching Valr currency pairs')

    const rawCurrencyPairs = await publicRequest<IValrCurrencyPairs[]>({
      url: 'https://api.valr.com/v1/public/pairs',
    })

    const rawMarketsWithCurrency = ValrCurrencyPairsParser.parse({
      rawMarkets,
      rawCurrencyPairs,
    })

    return rawMarketsWithCurrency

  }

  public static async list (): Promise<IAlunaMarketSchema[]> {

    return ValrMarketModule.parseMany({
      rawMarkets: await ValrMarketModule.listRaw(),
    })

  }

  public static parse (params: {
    rawMarket: IMarketWithCurrency,
  }): IAlunaMarketSchema {

    return ValrMarketParser.parse(params)

  }

  public static parseMany (params: {
    rawMarkets: IMarketWithCurrency[],
  }): IAlunaMarketSchema[] {

    const parsedMarkets = params.rawMarkets.map(
      (rawMarket) => ValrMarketModule.parse({
        rawMarket,
      }),
    )

    ValrLog.info(`parsed ${parsedMarkets.length} markets for Valr`)

    return parsedMarkets

  }

}
