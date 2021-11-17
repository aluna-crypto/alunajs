import { IAlunaSymbolModule } from '../../../lib/modules/IAlunaSymbolModule'
import { IAlunaSymbolSchema } from '../../../lib/schemas/IAlunaSymbolSchema'
import { IValrSymbolSchema } from '../schemas/IValrSymbolSchema'
import { Valr } from '../Valr'
import { ValrHttp } from '../ValrHttp'
import { ValrLog } from '../ValrLog'



export const ValrSymbolModule: IAlunaSymbolModule = class {

  public static async list (): Promise<IAlunaSymbolSchema[]> {

    const rawSymbols = await ValrSymbolModule.listRaw()

    const parsedSymbols = ValrSymbolModule.parseMany({ rawSymbols })

    return parsedSymbols

  }



  public static listRaw (): Promise<IValrSymbolSchema[]> {

    ValrLog.info('fetching Valr symbols')

    const rawSymbols = ValrHttp.publicRequest<IValrSymbolSchema[]>({
      url: 'https://api.valr.com/v1/public/currencies',
    })

    return rawSymbols

  }



  public static parse (params:{
    rawSymbol: IValrSymbolSchema,
  }): IAlunaSymbolSchema {

    const { rawSymbol } = params

    const {
      longName,
      shortName,
    } = rawSymbol

    return {
      id: shortName,
      name: longName,
      exchangeId: Valr.ID,
      meta: rawSymbol,
    }

  }



  public static parseMany (params: {
    rawSymbols: IValrSymbolSchema[],
  }): IAlunaSymbolSchema[] {

    const { rawSymbols } = params

    const parsedSymbols = rawSymbols.map((rawSymbol) => {

      const parsedSymbol = ValrSymbolModule.parse({ rawSymbol })

      return parsedSymbol

    })

    ValrLog.info(`parsed ${parsedSymbols.length} symbols for Valr`)

    return parsedSymbols

  }

}
