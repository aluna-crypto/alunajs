import { AAlunaModule } from '@lib/abstracts/AAlunaModule'
import { IAlunaSymbolModule } from '@lib/modules/IAlunaSymbolModule'
import { IAlunaSymbolSchema } from '@lib/schemas/IAlunaSymbolSchema'

import { IValrSymbolSchema } from '../../schemas/IValrSymbolSchema'
import { ValrSymbolParser } from './parsers/ValrSymbolParser'
import { ValrSymbolList } from './ValrSymbolList'



export class ValrSymbol extends AAlunaModule implements IAlunaSymbolModule {

  async list (): Promise<IAlunaSymbolSchema[]> {

    const rawSymbols = await new ValrSymbolList(this.requestHandler).list()

    return this.parseMany({
      rawSymbols,
    })

  }

  parse (params: { rawSymbol: IValrSymbolSchema }): IAlunaSymbolSchema {

    return ValrSymbolParser.parse({
      rawSymbol: params.rawSymbol,
    })

  }

  parseMany (params: {
    rawSymbols: IValrSymbolSchema[]
  }): IAlunaSymbolSchema[] {

    return params.rawSymbols.map((rawSymbol) => ValrSymbolParser.parse({
      rawSymbol,
    }))

  }

}
