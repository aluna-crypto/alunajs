import { AAlunaModule } from '@lib/abstracts/AAlunaModule'
import { IAlunaSymbolModule } from '@lib/modules/IAlunaSymbolModule'
import { IAlunaSymbolSchema } from '@lib/schemas/IAlunaSymbolSchema'

import { ValrRequests } from '../requests/ValrRequests'
import { IValrSymbolSchema } from '../schemas/IValrSymbolSchema'



export class ValrSymbolModule extends AAlunaModule implements IAlunaSymbolModule {

  async list (): Promise<IAlunaSymbolSchema[]> {

    const rawSymbols = await new ValrRequests().get<IValrSymbolSchema[]>({
      url: 'https://api.valr.com/v1/public/currencies',
    })


    return this.parseMany({
      rawSymbols,
    })

  }

  parse (params: { rawSymbol: IValrSymbolSchema }): IAlunaSymbolSchema {

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
    rawSymbols: IValrSymbolSchema[]
  }): IAlunaSymbolSchema[] {

    return params.rawSymbols.map((rawSymbol) => this.parse({
      rawSymbol,
    }))

  }

}
