import { IAlunaSymbolModule } from '../../../lib/modules/IAlunaSymbolModule'
import { IAlunaSymbolSchema } from '../../../lib/schemas/IAlunaSymbolSchema'
import { IValrSymbolSchema } from '../schemas/IValrSymbolSchema'
import { Valr } from '../Valr'
import { ValrHttp } from '../ValrHttp'
import { ValrLog } from '../ValrLog'



export const ValrSymbolModule: IAlunaSymbolModule = class {

  public static async list (): Promise<IAlunaSymbolSchema[]> {

    return ValrSymbolModule.parseMany({
      rawSymbols: await ValrSymbolModule.listRaw(),
    })

  }



  public static listRaw (): Promise<IValrSymbolSchema[]> {

    ValrLog.info('fetching Valr symbols')

    return ValrHttp.publicRequest<IValrSymbolSchema[]>({
      url: 'https://api.valr.com/v1/public/currencies',
    })

  }



  public static parse (params:{
    rawSymbol: IValrSymbolSchema,
  }): IAlunaSymbolSchema {

    const {
      rawSymbol: {
        longName,
        shortName,
      },
    } = params

    return {
      id: shortName,
      name: longName,
      exchangeId: Valr.ID,
    }

  }



  public static parseMany (params: {
    rawSymbols: IValrSymbolSchema[],
  }): IAlunaSymbolSchema[] {

    const {
      rawSymbols,
    } = params

    const parsedSymbols = rawSymbols.map((rawSymbol) => ValrSymbolModule.parse({
      rawSymbol,
    }))

    ValrLog.info(`parsed ${parsedSymbols.length} symbols for Valr`)

    return parsedSymbols

  }

}
