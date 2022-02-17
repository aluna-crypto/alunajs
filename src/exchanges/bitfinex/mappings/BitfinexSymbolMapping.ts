interface ISymbolMappingResponse {
  baseSymbolId: string
  quoteSymbolId: string
}



export class BitfinexSymbolMapping {


  static translateToAluna (params: {
    symbolPair: string,
    mappings?: Record<string, string>,
  }): ISymbolMappingResponse {

    const {
      symbolPair,
      mappings,
    } = params

    let baseSymbolId: string
    let quoteSymbolId: string

    const spliter = symbolPair.indexOf(':')

    if (spliter >= 0) {

      baseSymbolId = symbolPair.slice(1, spliter)
      quoteSymbolId = symbolPair.slice(spliter + 1)

    } else {

      baseSymbolId = symbolPair.slice(1, 4)
      quoteSymbolId = symbolPair.slice(4)

    }

    const translated: ISymbolMappingResponse = {
      baseSymbolId: mappings?.[baseSymbolId] || baseSymbolId,
      quoteSymbolId: mappings?.[quoteSymbolId] || quoteSymbolId,
    }

    return translated

  }

}
