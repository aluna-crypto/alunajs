import { IAlunaSymbolModule } from '../../../lib/modules/IAlunaSymbolModule'
import { IAlunaSymbolSchema } from '../../../lib/schemas/IAlunaSymbolSchema'
import { IValrSymbolSchema } from '../schemas/IValrSymbolSchema'
import { ValrHttp } from '../ValrHttp'
import { ValrLog } from '../ValrLog'



export const ValrSymbolModule: IAlunaSymbolModule = class {

  public static async list (): Promise<IAlunaSymbolSchema[]> {

    return ValrSymbolModule.parseMany({
      rawSymbols: await ValrSymbolModule.listRaw(),
    })

  }



  public static listRaw (): Promise<IValrSymbolSchema[]> {

    ValrLog.info()

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

    ValrLog.info(JSON.stringify({
      longName,
      shortName,
    }))

    return {
      id: shortName,
      name: longName,
    }

  }



  public static parseMany (params: {
    rawSymbols: IValrSymbolSchema[],
  }): IAlunaSymbolSchema[] {

    const {
      rawSymbols,
    } = params

    ValrLog.info(JSON.stringify({
      rawSymbolsNum: rawSymbols.length,
    }))

    return rawSymbols.map((rawSymbol) => ValrSymbolModule.parse({
      rawSymbol,
    }))

  }

}
