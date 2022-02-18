import { IAlunaMarketModule } from '../../../lib/modules/IAlunaMarketModule'
import { IAlunaMarketSchema } from '../../../lib/schemas/IAlunaMarketSchema'
import { BitfinexHttp } from '../BitfinexHttp'
import { BitfinexLog } from '../BitfinexLog'
import {
  IBitfinexMarketSchema,
  IBitfinexTicker,
} from '../schemas/IBitfinexMarketSchema'
import { TBitfinexCurrencySym } from '../schemas/IBitfinexSymbolSchema'
import {
  BitfinexMarketParser,
  IBitfinexMarketParseParams,
} from '../schemas/parsers/BitfinexMarketParser'



export const BitfinexMarketModule: IAlunaMarketModule = class {

  static enabledMarginMarketsPath = 'pub:list:pair:margin'

  public static async listRaw (): Promise<IBitfinexMarketSchema> {

    BitfinexLog.info('fetching Bitfinex markets')

    const { publicRequest } = BitfinexHttp

    const rawMarkets = await publicRequest<IBitfinexTicker[]>({
      url: 'https://api-pub.bitfinex.com/v2/tickers?symbols=ALL',
    })

    const baseUrl = 'https://api-pub.bitfinex.com/v2/conf/'

    const url = `${baseUrl}${this.enabledMarginMarketsPath}`

    const [
      enabledMarginMarkets,
    ] = await publicRequest<[string[], TBitfinexCurrencySym[]]>({
      url,
    })

    const output: IBitfinexMarketSchema = [
      rawMarkets,
      enabledMarginMarkets,
    ]

    return output

  }

  public static async list (): Promise<IAlunaMarketSchema[]> {

    const rawMarkets = await BitfinexMarketModule.listRaw()

    const parsedMarkets = BitfinexMarketModule.parseMany({ rawMarkets })

    return parsedMarkets

  }

  public static parse (params: {
    rawMarket: IBitfinexMarketParseParams,
  }): IAlunaMarketSchema {

    const { rawMarket } = params

    const parsedMarket = BitfinexMarketParser.parse(rawMarket)

    return parsedMarket

  }

  public static parseMany (params: {
    rawMarkets: IBitfinexMarketSchema,
  }): IAlunaMarketSchema[] {

    const { rawMarkets } = params

    const [
      rawBitfinexTickers,
      enabledMarginMarkets,
    ] = rawMarkets

    const enabledMarginMarketsDict: Record<string, string> = {}
    const currencySymsDict: Record<string, TBitfinexCurrencySym> = {}

    enabledMarginMarkets.forEach((market) => {

      enabledMarginMarketsDict[market] = market

    })

    const parsedMarkets = rawBitfinexTickers.reduce((acc, ticker) => {

      const [symbol] = ticker

      // skipping 'funding' and 'derivative' markets for now
      if (/f|F0/.test(symbol)) {

        return acc

      }

      const rawMarket: IBitfinexMarketParseParams = {
        rawTicker: ticker,
        currencySymsDict,
        enabledMarginMarketsDict,
      }

      const parsedMarket = BitfinexMarketModule.parse({
        rawMarket,
      })

      acc.push(parsedMarket)

      return acc

    }, [] as IAlunaMarketSchema[])

    BitfinexLog.info(`parsed ${parsedMarkets.length} markets for Bitfinex`)

    return parsedMarkets

  }

}
