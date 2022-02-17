import { IAlunaSymbolModule } from '../../../lib/modules/IAlunaSymbolModule'
import { IAlunaSymbolSchema } from '../../../lib/schemas/IAlunaSymbolSchema'
import { Bittrex } from '../Bittrex'
import { BittrexHttp } from '../BittrexHttp'
import { BittrexLog } from '../BittrexLog'
import { PROD_BITTREX_URL } from '../BittrexSpecs'
import { IBittrexSymbolSchema } from '../schemas/IBittrexSymbolSchema'



export const BittrexSymbolModule: IAlunaSymbolModule = class {

  public static async listRaw (): Promise<IBittrexSymbolSchema[]> {

    BittrexLog.info('fetching Bittrex symbols')

    const rawSymbols = await BittrexHttp
      .publicRequest<IBittrexSymbolSchema[]>({
        url: `${PROD_BITTREX_URL}/currencies`,
      })

    return rawSymbols

  }



  public static async list (): Promise<IAlunaSymbolSchema[]> {

    const rawSymbols = await BittrexSymbolModule.listRaw()

    const parsedSymbols = BittrexSymbolModule.parseMany({ rawSymbols })

    return parsedSymbols

  }



  public static parse (params:{
    rawSymbol: IBittrexSymbolSchema,
  }): IAlunaSymbolSchema {

    const { rawSymbol } = params

    const {
      symbol,
      name,
    } = rawSymbol

    const parsedSymbol: IAlunaSymbolSchema = {
      id: symbol,
      name,
      exchangeId: Bittrex.ID,
      meta: rawSymbol,
    }

    return parsedSymbol

  }



  public static parseMany (params: {
    rawSymbols: IBittrexSymbolSchema[],
  }): IAlunaSymbolSchema[] {

    const { rawSymbols } = params

    const parsedSymbols = rawSymbols.map((rawSymbol) => {

      const parsedSymbol = BittrexSymbolModule.parse({ rawSymbol })

      return parsedSymbol

    })

    BittrexLog.info(`parsed ${parsedSymbols.length} symbols for Bittrex`)

    return parsedSymbols

  }

}
