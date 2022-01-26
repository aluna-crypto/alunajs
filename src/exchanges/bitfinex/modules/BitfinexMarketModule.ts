import { IAlunaMarketModule } from '../../..'
import { IAlunaMarketSchema } from '../../../lib/schemas/IAlunaMarketSchema'
import { BitfinexHttp } from '../BitfinexHttp'
import { BitfinexLog } from '../BitfinexLog'
import {
  IBitfinexMarket,
  IBitfinexTicker,
} from '../schemas/IBitfinexMarketSchema'
import { TBitfinexCurrencySym } from '../schemas/IBitfinexSymbolSchema'
import {
  BitfinexMarketParser,
  IBitfinexMarketParseParams,
} from '../schemas/parsers/BitfinexMarketParser'



export const BitfinexMarketModule: IAlunaMarketModule = class {

  static enabledMarginMarketsPath = 'pub:list:pair:margin'

  public static async listRaw (): Promise<IBitfinexMarket> {

    BitfinexLog.info('fetching Bitfinex markets')

    const { publicRequest } = BitfinexHttp

    const rawMarkets = await publicRequest<IBitfinexTicker[]>({
      url: 'https://api-pub.bitfinex.com/v2/tickers?symbols=ALL',
    })

    const baseUrl = 'https://api-pub.bitfinex.com/v2/conf/'

    const url = `${baseUrl}${this.enabledMarginMarketsPath}`
      .concat(',pub:map:currency:sym')

    const [
      enabledMarginMarkets,
      symCurrencies,
    ] = await publicRequest<[string[], TBitfinexCurrencySym[]]>({
      url,
    })

    const output: IBitfinexMarket = [
      rawMarkets,
      enabledMarginMarkets,
      symCurrencies,
    ]

    return output

  }

  public static async list (): Promise<any[]> {

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
    rawMarkets: IBitfinexMarket,
  }): IAlunaMarketSchema[] {

    const { rawMarkets } = params

    const [
      rawBitfinexTickers,
      enabledMarginMarkets,
      currencySyms,
    ] = rawMarkets

    const enabledMarginMarketsDict: Record<string, string> = {}
    const currencySymsDict: Record<string, TBitfinexCurrencySym> = {}

    enabledMarginMarkets.forEach((market) => {

      enabledMarginMarketsDict[market] = market

    })

    currencySyms.forEach((currencySym) => {

      const [bitfinexSymbolId] = currencySym

      currencySymsDict[bitfinexSymbolId] = currencySym

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
