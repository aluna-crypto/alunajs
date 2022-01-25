import { IAlunaSymbolModule } from '../../../lib/modules/IAlunaSymbolModule'
import { IAlunaSymbolSchema } from '../../../lib/schemas/IAlunaSymbolSchema'
import { BitfinexHttp } from '../BitfinexHttp'
import { BitfinexLog } from '../BitfinexLog'
import {
  IBitfinexSymbols,
  TBitfinexCurrencyLabel,
  TBitfinexCurrencySym,
} from '../schemas/IBitfinexSymbolSchema'
import { BitfinexSymbolParser } from '../schemas/parsers/BitfinexSymbolParser'



export interface IBitfinexParseSymbolParams {
  bitfinexCurrency: string
  bitfinexCurrencyLabel: TBitfinexCurrencyLabel | undefined
  bitfinexSym: TBitfinexCurrencySym | undefined
}



export const BitfinexSymbolModule: IAlunaSymbolModule = class {

  static currenciesPath = 'pub:list:currency'
  static labelsPath = 'pub:map:currency:label'
  static currenciesSymsPath = 'pub:map:currency:sym'

  public static async list (): Promise<IAlunaSymbolSchema[]> {

    const rawSymbols = await BitfinexSymbolModule.listRaw()

    const parsedSymbols = BitfinexSymbolModule.parseMany({ rawSymbols })

    return parsedSymbols

  }

  public static async listRaw (): Promise<IBitfinexSymbols> {

    BitfinexLog.info('fetching Bitfinex symbols')

    const { publicRequest } = BitfinexHttp

    const baseUrl = 'https://api-pub.bitfinex.com/v2/conf/'

    const url = `${baseUrl}${this.currenciesPath},${this.labelsPath}`
      .concat(`,${this.currenciesSymsPath}`)

    const rawSymbols = publicRequest<IBitfinexSymbols>({
      url,
    })

    return rawSymbols

  }

  public static parse (params:{
    rawSymbol: IBitfinexParseSymbolParams,
  }): IAlunaSymbolSchema {

    const { rawSymbol } = params

    const parsedSymbol = BitfinexSymbolParser.parse(rawSymbol)

    return parsedSymbol

  }

  public static parseMany (params: {
    rawSymbols: IBitfinexSymbols,
  }): IAlunaSymbolSchema[] {

    const { rawSymbols } = params

    const [
      symbolsIds,
      symbolsLabels,
      currencySyms,
    ] = rawSymbols

    const currencyLabelsDict: Record<string, TBitfinexCurrencyLabel> = {}
    const currencySymsDict: Record<string, TBitfinexCurrencySym> = {}

    symbolsLabels.forEach((currencyLabel) => {

      const [bitfinexSymbolId] = currencyLabel

      currencyLabelsDict[bitfinexSymbolId] = currencyLabel

    })

    currencySyms.forEach((currencySym) => {

      const [bitfinexSymbolId] = currencySym

      currencySymsDict[bitfinexSymbolId] = currencySym

    })

    const parsedSymbols = symbolsIds.reduce((acc, bitfinexCurrency) => {

      // skipping derivatives symbols for now
      if (/F0/.test(bitfinexCurrency)) {

        return acc

      }

      const rawSymbol: IBitfinexParseSymbolParams = {
        bitfinexCurrency,
        bitfinexCurrencyLabel: currencyLabelsDict[bitfinexCurrency],
        bitfinexSym: currencySymsDict[bitfinexCurrency],
      }

      const parsedSymbol = BitfinexSymbolModule.parse({ rawSymbol })

      acc.push(parsedSymbol)

      return acc

    }, [] as IAlunaSymbolSchema[])

    BitfinexLog.info(`parsed ${parsedSymbols.length} symbols for Bitfinex`)

    return parsedSymbols

  }

}
