import { IAlunaSymbolModule } from '../../../lib/modules/IAlunaSymbolModule'
import { IAlunaSymbolSchema } from '../../../lib/schemas/IAlunaSymbolSchema'
import { IValrSymbolSchema } from '../schemas/IValrSymbolSchema'
import { ValrHttp } from '../ValrHttp'



export const ValrSymbolModule: IAlunaSymbolModule = class {

  public static async list (): Promise<IAlunaSymbolSchema[]> {

    return ValrSymbolModule.parseMany({
      rawSymbols: await ValrSymbolModule.listRaw(),
    })

  }



  public static listRaw (): Promise<IValrSymbolSchema[]> {

    return ValrHttp.publicRequest<IValrSymbolSchema[]>({
      url: 'https://api.valr.com/v1/public/currencies',
    })

  }



  public static parse (params:{
    rawSymbol: IValrSymbolSchema,
  }): IAlunaSymbolSchema {

    const {
      rawSymbol: {
        longName, shortName,
      },
    } = params

    return {
      id: shortName,
      name: longName,
    }

  }



  public static parseMany (params: {
    rawSymbols: IValrSymbolSchema[],
  }): IAlunaSymbolSchema[] {

    return params.rawSymbols.map((rawSymbol) => ValrSymbolModule.parse({
      rawSymbol,
    }))

  }

}
