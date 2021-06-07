import { IAlunaSymbolModule } from '../../../lib/modules/IAlunaSymbolModule'
import { IAlunaSymbolSchema } from '../../../lib/schemas/IAlunaSymbolSchema'
import { IValrSymbolSchema } from '../schemas/IValrSymbolSchema'
import { ValrHttp } from '../ValrHttp'



export const ValrSymbolModule: IAlunaSymbolModule = class {

  static async list (): Promise<IAlunaSymbolSchema[]> {

    return ValrSymbolModule.parseMany({
      rawSymbols: await ValrSymbolModule.listRaw(),
    })

  }



  static async listRaw (): Promise<IValrSymbolSchema[]> {

    return ValrHttp.publicRequest<IValrSymbolSchema[]>({
      url: 'https://api.valr.com/v1/public/currencies',
    })

  }



  static parse (params:{
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



  static parseMany (params: {
    rawSymbols: IValrSymbolSchema[],
  }): IAlunaSymbolSchema[] {

    return params.rawSymbols.map((rawSymbol) => ValrSymbolModule.parse({
      rawSymbol,
    }))

  }

}
