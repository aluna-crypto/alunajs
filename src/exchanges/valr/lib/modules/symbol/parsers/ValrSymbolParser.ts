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

  static parseMany (params: {
    rawSymbols: IValrSymbolSchema[]
  }): IAlunaSymbolSchema[] {

    return params.rawSymbols.map((rawSymbol: IValrSymbolSchema) => this.parse({
      rawSymbol,
    }))

  }

}
