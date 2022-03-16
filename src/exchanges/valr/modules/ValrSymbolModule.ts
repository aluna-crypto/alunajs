import {
  IAlunaSymbolListRawReturns,
  IAlunaSymbolListReturns,
  IAlunaSymbolModule,
  IAlunaSymbolParseManyReturns,
  IAlunaSymbolParseReturns,
} from '../../../lib/modules/IAlunaSymbolModule'
import { AlunaSymbolMapping } from '../../../utils/mappings/AlunaSymbolMapping'
import { IValrSymbolSchema } from '../schemas/IValrSymbolSchema'
import { Valr } from '../Valr'
import { ValrHttp } from '../ValrHttp'
import { ValrLog } from '../ValrLog'



export const ValrSymbolModule: IAlunaSymbolModule = class {

  public static async list (): Promise<IAlunaSymbolListReturns> {

    const { apiRequestCount: listRawCount, rawSymbols } = await ValrSymbolModule.listRaw()

    let apiRequestCount = 0

    const {
      symbols,
      apiRequestCount: parseManyApiRequestCount,
    } = ValrSymbolModule.parseMany({ rawSymbols })

    apiRequestCount += 1

    const totalApiRequestCount = listRawCount
    + parseManyApiRequestCount
    + apiRequestCount

    return {
      symbols,
      apiRequestCount: totalApiRequestCount,
    }

  }

  public static async listRaw ()
    : Promise<IAlunaSymbolListRawReturns<IValrSymbolSchema>> {

    ValrLog.info('fetching Valr symbols')

    const { data: rawSymbols, apiRequestCount } = await ValrHttp
      .publicRequest<IValrSymbolSchema[]>({
        url: 'https://api.valr.com/v1/public/currencies',
      })

    return {
      rawSymbols,
      apiRequestCount,
    }

  }

  public static parse (params:{
    rawSymbol: IValrSymbolSchema,
  }): IAlunaSymbolParseReturns {

    const { rawSymbol } = params

    const {
      longName,
      shortName,
    } = rawSymbol

    const id = AlunaSymbolMapping.translateSymbolId({
      exchangeSymbolId: shortName,
      symbolMappings: Valr.settings.mappings,
    })

    let alias: string | undefined

    if (id !== shortName) {

      alias = shortName

    }

    const symbol = {
      id,
      name: longName,
      exchangeId: Valr.ID,
      alias,
      meta: rawSymbol,
    }

    const response: IAlunaSymbolParseReturns = {
      symbol,
      apiRequestCount: 1,
    }

    return response

  }

  public static parseMany (params: {
    rawSymbols: IValrSymbolSchema[],
  }): IAlunaSymbolParseManyReturns {

    const { rawSymbols } = params

    let parsedSymbolsCount = 0

    const parsedSymbols = rawSymbols.map((rawSymbol) => {

      const {
        symbol: parsedSymbol,
        apiRequestCount,
      } = ValrSymbolModule.parse({ rawSymbol })

      parsedSymbolsCount += apiRequestCount + 1

      return parsedSymbol

    })

    ValrLog.info(`parsed ${parsedSymbols.length} symbols for Valr`)

    const response: IAlunaSymbolParseManyReturns = {
      symbols: parsedSymbols,
      apiRequestCount: parsedSymbolsCount,
    }

    return response

  }

}
