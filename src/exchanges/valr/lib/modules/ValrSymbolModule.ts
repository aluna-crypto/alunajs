import { AAlunaModule } from '@lib/abstracts/AAlunaModule'
import { IAlunaSymbolModule } from '@lib/modules/IAlunaSymbolModule'
import { IAlunaSymbolSchema } from '@lib/schemas/IAlunaSymbolSchema'

import { IValrSymbolSchema } from '../schemas/IValrSymbolSchema'
import { ValrHttp } from '../ValrHttp'



export class ValrSymbolModule extends AAlunaModule implements IAlunaSymbolModule {

  async list (): Promise<IAlunaSymbolSchema[]> {

    return this.parseMany({
      rawSymbols: await this.listRaw(),
    })

  }

  async listRaw (): Promise<IValrSymbolSchema[]> {

    return ValrHttp.publicRequest<IValrSymbolSchema[]>({
      url: 'https://api.valr.com/v1/public/currencies',
    })

  }



  parse (params:{
    rawSymbol: IValrSymbolSchema,
  }): IAlunaSymbolSchema {

    const {
      rawSymbol: {
        longName, shortName,
      },
    } = params

    return {
      acronym: shortName,
      name: longName,
    }

  }



  parseMany (params: {
    rawSymbols: IValrSymbolSchema[],
  }): IAlunaSymbolSchema[] {

    return params.rawSymbols.map((rawSymbol) => this.parse({
      rawSymbol,
    }))

  }

}
