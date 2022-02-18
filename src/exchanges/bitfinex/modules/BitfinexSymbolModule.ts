import { IAlunaSymbolModule } from '../../../lib/modules/IAlunaSymbolModule'
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

  static currenciesPath = 'pub:list:currency'
  static labelsPath = 'pub:map:currency:label'

  public static async list (): Promise<IAlunaSymbolSchema[]> {

    const rawSymbols = await BitfinexSymbolModule.listRaw()

    const parsedSymbols = BitfinexSymbolModule.parseMany({ rawSymbols })

    return parsedSymbols

  }

  public static async listRaw (): Promise<IBitfinexSymbolSchema> {

    BitfinexLog.info('fetching Bitfinex symbols')

    const { publicRequest } = BitfinexHttp

    const baseUrl = 'https://api-pub.bitfinex.com/v2/conf/'

    const url = `${baseUrl}${this.currenciesPath},${this.labelsPath}`

    const rawSymbols = publicRequest<IBitfinexSymbolSchema>({
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
    rawSymbols: IBitfinexSymbolSchema,
  }): IAlunaSymbolSchema[] {

    const { rawSymbols } = params

    const [
      symbolsIds,
      symbolsLabels,
    ] = rawSymbols

    const currencyLabelsDict: Record<string, TBitfinexCurrencyLabel> = {}

    symbolsLabels.forEach((currencyLabel) => {

      const [bitfinexSymbolId] = currencyLabel

      currencyLabelsDict[bitfinexSymbolId] = currencyLabel

    })

    const parsedSymbols = symbolsIds.reduce((acc, bitfinexCurrency) => {

      // skipping derivatives symbols for now
      if (/F0/.test(bitfinexCurrency)) {

        return acc

      }

      const rawSymbol: IBitfinexParseSymbolParams = {
        bitfinexCurrency,
        bitfinexCurrencyLabel: currencyLabelsDict[bitfinexCurrency],
      }

      const parsedSymbol = BitfinexSymbolModule.parse({ rawSymbol })

      acc.push(parsedSymbol)

      return acc

    }, [] as IAlunaSymbolSchema[])

    BitfinexLog.info(`parsed ${parsedSymbols.length} symbols for Bitfinex`)

    return parsedSymbols

  }

}
