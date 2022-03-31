import {
  IAlunaSymbolListRawReturns,
  IAlunaSymbolListReturns,
  IAlunaSymbolModule,
  IAlunaSymbolParseManyReturns,
  IAlunaSymbolParseReturns,
} from '../../../lib/modules/IAlunaSymbolModule'
import { IAlunaSymbolSchema } from '../../../lib/schemas/IAlunaSymbolSchema'
import { BitfinexHttp } from '../BitfinexHttp'
import { BitfinexLog } from '../BitfinexLog'
import {
  IBitfinexSymbolSchema,
  TBitfinexCurrencyLabel,
} from '../schemas/IBitfinexSymbolSchema'
import { BitfinexSymbolParser } from '../schemas/parsers/BitfinexSymbolParser'



export interface IBitfinexParseSymbolParams {
  bitfinexCurrency: string
  bitfinexCurrencyLabel: TBitfinexCurrencyLabel | undefined
}

export const BitfinexSymbolModule: IAlunaSymbolModule = class {

  static currenciesPath = 'pub:list:currency';
  static labelsPath = 'pub:map:currency:label';

  public static async list (): Promise<IAlunaSymbolListReturns> {

    const requestCount = 0

    const {
      rawSymbols,
      requestCount: listRawCount,
    } = await BitfinexSymbolModule.listRaw()

    const {
      symbols: parsedSymbols,
      requestCount: parseManyCount,
    } = BitfinexSymbolModule.parseMany({ rawSymbols })

    const totalRequestCount = requestCount + listRawCount + parseManyCount

    return {
      symbols: parsedSymbols,
      requestCount: totalRequestCount,
    }

  }

  public static async listRaw (): Promise<IAlunaSymbolListRawReturns<any>> {

    BitfinexLog.info('fetching Bitfinex symbols')

    const { publicRequest } = BitfinexHttp

    const baseUrl = 'https://api-pub.bitfinex.com/v2/conf/'

    const url = `${baseUrl}${this.currenciesPath},${this.labelsPath}`

    const {
      data: rawSymbols,
      requestCount,
    } = await publicRequest<IBitfinexSymbolSchema>({
      url,
    })

    return {
      rawSymbols,
      requestCount,
    }

  }

  public static parse (params: {
    rawSymbol: IBitfinexParseSymbolParams,
  }): IAlunaSymbolParseReturns {

    const { rawSymbol } = params

    const parsedSymbol = BitfinexSymbolParser.parse(rawSymbol)

    return {
      symbol: parsedSymbol,
      requestCount: 0,
    }

  }

  public static parseMany (params: {
    rawSymbols: IBitfinexSymbolSchema,
  }): IAlunaSymbolParseManyReturns {

    const { rawSymbols } = params

    const [symbolsIds, symbolsLabels] = rawSymbols

    const currencyLabelsDict: Record<string, TBitfinexCurrencyLabel> = {}

    symbolsLabels.forEach((currencyLabel) => {

      const [bitfinexSymbolId] = currencyLabel

      currencyLabelsDict[bitfinexSymbolId] = currencyLabel

    })

    let requestCount = 0

    const parsedSymbols = symbolsIds.reduce((acc, bitfinexCurrency) => {

      // skipping derivatives symbols for now
      if (/F0/.test(bitfinexCurrency)) {

        return acc

      }

      const rawSymbol: IBitfinexParseSymbolParams = {
        bitfinexCurrency,
        bitfinexCurrencyLabel: currencyLabelsDict[bitfinexCurrency],
      }

      const { symbol: parsedSymbol, requestCount: parseCount } = this.parse({
        rawSymbol,
      })

      requestCount += parseCount

      acc.push(parsedSymbol)

      return acc

    }, [] as IAlunaSymbolSchema[])

    BitfinexLog.info(`parsed ${parsedSymbols.length} symbols for Bitfinex`)

    return {
      symbols: parsedSymbols,
      requestCount,
    }

  }

}
