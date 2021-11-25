import { IAlunaMarketModule } from '../../../lib/modules/IAlunaMarketModule'
import { IAlunaMarketSchema } from '../../../lib/schemas/IAlunaMarketSchema'
import { IMarketWithCurrency } from '../../valr/modules/ValrMarketModule'
import { PROD_BINANCE_URL } from '../Binance'
import { BinanceHttp } from '../BinanceHttp'
import { BinanceLog } from '../BinanceLog'
import {
  IBinanceMarketSchema,
  IBinanceMarketWithCurrency,
} from '../schemas/IBinanceMarketSchema'
import { BinanceMarketParser } from '../schemas/parses/BinanceMarketParser'
import { BinanceSymbolModule } from './BinanceSymbolModule'



export const BinanceMarketModule: IAlunaMarketModule = class {

  public static async listRaw (): Promise<IBinanceMarketWithCurrency[]> {

    const { publicRequest } = BinanceHttp

    BinanceLog.info('fetching Binance markets')

    const rawMarkets = await publicRequest<IBinanceMarketSchema[]>({
      url: PROD_BINANCE_URL + '/api/v3/ticker/24hr?symbol=ETHBTC',
    })
    console.log("🚀 ~ file: BinanceMarketModule.ts ~ line 27 ~ listRaw ~ rawMarkets", rawMarkets)
    const rawMarkets1 = await publicRequest<IBinanceMarketSchema[]>({
      url: PROD_BINANCE_URL + '/api/v3/ticker/24hr?symbol=LTCBTC',
    })
    console.log("🚀 ~ file: BinanceMarketModule.ts ~ line 27 ~ listRaw ~ rawMarkets", rawMarkets1)
    const rawMarkets2 = await publicRequest<IBinanceMarketSchema[]>({
      url: PROD_BINANCE_URL + '/api/v3/ticker/24hr?symbol=BNBBTC',
    })
    console.log("🚀 ~ file: BinanceMarketModule.ts ~ line 27 ~ listRaw ~ rawMarkets", rawMarkets2)

    BinanceLog.info('fetching Binance symbols')

    const rawSymbols = await BinanceSymbolModule.listRaw();

    const rawMarketsWithCurrency = BinanceMarketParser.parse({
      rawMarkets,
      rawSymbols,
    })

    return rawMarketsWithCurrency

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
