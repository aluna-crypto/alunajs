import { IAlunaSymbolModule } from '../../../lib/modules/IAlunaSymbolModule'
import { IAlunaSymbolSchema } from '../../../lib/schemas/IAlunaSymbolSchema'
import { Bitfinex } from '../Bitfinex'
import { BitfinexHttp } from '../BitfinexHttp'
import { BitfinexLog } from '../BitfinexLog'
import { IBitfinexSymbols } from '../schemas/IBitfinexSymbolSchema'



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
    rawSymbol: [string, string],
  }): IAlunaSymbolSchema {

    const { rawSymbol } = params

    const [id, name] = rawSymbol

    const symbol: IAlunaSymbolSchema = {
      id,
      name,
      exchangeId: Bitfinex.ID,
      meta: rawSymbol,
    }

    return symbol

  }

  public static parseMany (params: {
    rawSymbols: IBitfinexSymbols[],
  }): IAlunaSymbolSchema[] {

    const { rawSymbols } = params

    const [symbolsTupleArr] = rawSymbols

    const parsedSymbols = symbolsTupleArr.map((symbolTuple) => {

      const parsedSymbol = BitfinexSymbolModule.parse({
        rawSymbol: symbolTuple,
      })

      return parsedSymbol

    })

    BitfinexLog.info(`parsed ${parsedSymbols.length} symbols for Bitfinex`)

    return parsedSymbols

  }

}
