import { IAlunaMarketModule } from '../../../lib/modules/IAlunaMarketModule'
import { IAlunaMarketSchema } from '../../../lib/schemas/IAlunaMarketSchema'
import { IMarketWithCurrency } from '../../valr/modules/ValrMarketModule'
import { BinanceHttp } from '../BinanceHttp'
import { BinanceLog } from '../BinanceLog'



export const BinanceMarketModule: IAlunaMarketModule = class {

  public static async listRaw (): Promise<any[]> { // @TODO -> Update any

    const { publicRequest } = BinanceHttp

    BinanceLog.info('fetching Binance markets')

    // const rawMarkets = await publicRequest<any[]>({ // @TODO -> Update any
    //   url: 'https://api.binance.com/v1/public/marketsummary',
    // })

    BinanceLog.info('fetching Binance currency pairs')

    // const rawCurrencyPairs = await publicRequest<any[]>({ // @TODO -> Update any
    //   url: 'https://api.binance.com/v1/public/pairs',
    // })

    // const rawMarketsWithCurrency = BinanceCurrencyPairsParser.parse({
    //   rawMarkets,
    //   rawCurrencyPairs,
    // })

    return Promise.resolve([]) // @TODO -> Update any

  }

  public static async list (): Promise<IAlunaMarketSchema[]> {

    const rawMarkets = await BinanceMarketModule.listRaw()

    const parsedMarkets = BinanceMarketModule.parseMany({ rawMarkets })

    return parsedMarkets

  }

  public static parse (params: {
    rawMarket: IMarketWithCurrency,
  }): any { // @TODO -> Update any

    const { rawMarket } = params

    // const parsedMarket = BinanceMarketParser.parse({ rawMarket })

    return null // @TODO -> Update

  }

  public static parseMany (params: {
    rawMarkets: IMarketWithCurrency[],
  }): IAlunaMarketSchema[] {

    const { rawMarkets } = params

    const parsedMarkets = rawMarkets.map((rawMarket) => {

      // const parsedMarket = BinanceMarketParser.parse({ rawMarket })

      // return parsedMarket

    })

    BinanceLog.info(`parsed ${parsedMarkets.length} markets for Binance`)

    return [] // @TODO -> Update

  }

}
