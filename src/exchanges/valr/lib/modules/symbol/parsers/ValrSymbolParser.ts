import { IAlunaSymbolSchema } from '@lib/schemas/IAlunaSymbolSchema'

import { IValrSymbolSchema } from '../../../schemas/IValrSymbolSchema'



export class ValrSymbolParser {

  static parse (params: {
    rawSymbol: IValrSymbolSchema
  }): IAlunaSymbolSchema {

    const {
      rawSymbol,
    } = params

    return {
      acronym: rawSymbol.shortName,
      name: rawSymbol.longName,
    }

  }

}
