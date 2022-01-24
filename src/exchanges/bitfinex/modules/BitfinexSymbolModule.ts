import { IAlunaSymbolModule } from '../../../lib/modules/IAlunaSymbolModule'
import { IAlunaSymbolSchema } from '../../../lib/schemas/IAlunaSymbolSchema'
import { Bitfinex } from '../Bitfinex'
import { BitfinexHttp } from '../BitfinexHttp'
import { BitfinexLog } from '../BitfinexLog'
import {
  IBitfinexSymbols,
  TBitfinexLabel,
  TBitfinexProperSymbol,
} from '../schemas/IBitfinexSymbolSchema'



interface IBitfinexParseSymbolParams {
  bitfinexSymbolId: string
  symbolsLabelsDict: Record<string, TBitfinexLabel>
  properSymbolsIdsDict: Record<string, TBitfinexProperSymbol>
}



// TODO: find a better place to define this
const symbolsIdsPath = 'pub:list:currency'
const labelsPath = 'pub:map:currency:label'
const aliasesPath = 'pub:map:currency:sym'

export const BitfinexSymbolModule: IAlunaSymbolModule = class {

  public static async list (): Promise<IAlunaSymbolSchema[]> {

    const rawSymbols = await BitfinexSymbolModule.listRaw()

    const parsedSymbols = BitfinexSymbolModule.parseMany({ rawSymbols })

    return parsedSymbols

  }

  public static async listRaw (): Promise<IBitfinexSymbols> {

    BitfinexLog.info('fetching Bitfinex symbols')

    const { publicRequest } = BitfinexHttp

    const baseUrl = 'https://api-pub.bitfinex.com/v2/conf/'

    const url = `${baseUrl}${symbolsIdsPath},${labelsPath},${aliasesPath}`

    const rawSymbols = publicRequest<IBitfinexSymbols>({
      url,
    })

    return rawSymbols

  }

  public static parse (params:{
    rawSymbol: IBitfinexParseSymbolParams,
  }): IAlunaSymbolSchema {

    // Consider implementing separeted parser
    const { rawSymbol } = params

    const {
      bitfinexSymbolId,
      properSymbolsIdsDict,
      symbolsLabelsDict,
    } = rawSymbol

    let id = bitfinexSymbolId

    let name: string | undefined
    let alias: string | undefined

    const symbolLabel = symbolsLabelsDict[bitfinexSymbolId]

    if (symbolLabel) {

      [, name] = symbolLabel

    }

    const properSymbol = properSymbolsIdsDict[bitfinexSymbolId]

    if (properSymbol) {

      [, id] = properSymbol

      alias = bitfinexSymbolId

    }

    const symbol: IAlunaSymbolSchema = {
      id: id.toUpperCase(), // some symbols ids are like: 'USDt'
      name,
      exchangeId: Bitfinex.ID,
      alias,
      meta: {
        currency: bitfinexSymbolId,
        currencyLabel: symbolLabel,
        currencySym: properSymbol,
      },
    }

    return symbol

  }

  public static parseMany (params: {
    rawSymbols: IBitfinexSymbols,
  }): IAlunaSymbolSchema[] {

    const { rawSymbols } = params

    const [
      symbolsIds,
      symbolsLabels,
      properSymbolsIds,
    ] = rawSymbols

    const symbolsLabelsDict: Record<string, TBitfinexLabel> = {}
    const properSymbolsIdsDict: Record<string, TBitfinexProperSymbol> = {}

    symbolsLabels.forEach((symbolLabel) => {

      const [bitfinexSymbolId] = symbolLabel

      symbolsLabelsDict[bitfinexSymbolId] = symbolLabel

    })

    properSymbolsIds.forEach((properSymbol) => {

      const [bitfinexSymbolId] = properSymbol

      properSymbolsIdsDict[bitfinexSymbolId] = properSymbol

    })

    const parsedSymbols = symbolsIds.reduce((acc, bitfinexSymbolId) => {

      // skipping derivatives symbols for now
      if (/F0/.test(bitfinexSymbolId)) {

        return acc

      }

      const rawSymbol: IBitfinexParseSymbolParams = {
        bitfinexSymbolId,
        properSymbolsIdsDict,
        symbolsLabelsDict,
      }

      const parsedSymbol = BitfinexSymbolModule.parse({ rawSymbol })

      acc.push(parsedSymbol)

      return acc

    }, [] as IAlunaSymbolSchema[])

    BitfinexLog.info(`parsed ${parsedSymbols.length} symbols for Bitfinex`)

    return parsedSymbols

  }

}
