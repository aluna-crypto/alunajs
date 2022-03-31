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

    const {
      requestCount: listRawCount,
      rawSymbols,
    } = await ValrSymbolModule.listRaw()

    const requestCount = 0

    const {
      symbols,
      requestCount: parseManyrequestCount,
    } = ValrSymbolModule.parseMany({ rawSymbols })

    const totalRequestCount = listRawCount
    + parseManyrequestCount
    + requestCount

    return {
      symbols,
      requestCount: totalRequestCount,
    }

  }

  public static async listRaw ()
    : Promise<IAlunaSymbolListRawReturns<IValrSymbolSchema>> {

    ValrLog.info('fetching Valr symbols')

    const { data: rawSymbols, requestCount } = await ValrHttp
      .publicRequest<IValrSymbolSchema[]>({
        url: 'https://api.valr.com/v1/public/currencies',
      })

    return {
      rawSymbols,
      requestCount,
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
      requestCount: 0,
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
        requestCount,
      } = ValrSymbolModule.parse({ rawSymbol })

      parsedSymbolsCount += requestCount

      return parsedSymbol

    })

    ValrLog.info(`parsed ${parsedSymbols.length} symbols for Valr`)

    const response: IAlunaSymbolParseManyReturns = {
      symbols: parsedSymbols,
      requestCount: parsedSymbolsCount,
    }

    return response

  }

}
