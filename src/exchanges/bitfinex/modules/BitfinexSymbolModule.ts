import { IAlunaSymbolModule } from '../../../lib/modules/IAlunaSymbolModule'
import { IAlunaSymbolSchema } from '../../../lib/schemas/IAlunaSymbolSchema'
import { Bitfinex } from '../Bitfinex'
import { BitfinexHttp } from '../BitfinexHttp'
import { BitfinexLog } from '../BitfinexLog'
import { IBitfinexSymbols } from '../schemas/IBitfinexMarketSchema'



export const BitfinexSymbolModule: IAlunaSymbolModule = class {

  public static async list (): Promise<IAlunaSymbolSchema[]> {

    const rawSymbols = await BitfinexSymbolModule.listRaw()

    const parsedSymbols = BitfinexSymbolModule.parseMany({ rawSymbols })

    return parsedSymbols

  }

  public static listRaw (): Promise<IBitfinexSymbols[]> {

    BitfinexLog.info('fetching Bitfinex symbols')

    const { publicRequest } = BitfinexHttp

    const rawSymbols = publicRequest<IBitfinexSymbols[]>({
      url: 'https://api-pub.bitfinex.com/v2/conf/pub:map:currency:label',
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

    const [symbolTuplesArr] = rawSymbols

    const parsedSymbols = symbolTuplesArr.map((symbolTuple) => {

      const parsedSymbol = BitfinexSymbolModule.parse({
        rawSymbol: symbolTuple,
      })

      return parsedSymbol

    })

    BitfinexLog.info(`parsed ${parsedSymbols.length} symbols for Bitfinex`)

    return parsedSymbols

  }

}
