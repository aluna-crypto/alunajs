import { AAlunaPublicModule } from '@lib/abstracts/AAlunaPublicModule'
import { IAlunaSymbol } from '@lib/modules/IAlunaSymbol'
import { IAlunaSymbolSchema } from '@lib/schemas/IAlunaSymbolSchema'

import { IValrSymbolSchema } from '../../schemas/IValrSymbolSchema'
import { ValrSymbolParser } from './parsers/ValrSymbolParser'
import { ValrSymbolList } from './ValrSymbolList'



export class ValrSymbol extends AAlunaPublicModule implements IAlunaSymbol {

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

    return ValrSymbolParser.parseMany({
      rawSymbols: params.rawSymbols,
    })

  }

}
