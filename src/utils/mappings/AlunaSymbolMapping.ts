export class AlunaSymbolMapping {

  public static translateSymbolId (params: {
    exchangeSymbolId: string,
    symbolMappings?: Record<string, string>,
  }) {

    const {
      exchangeSymbolId,
      symbolMappings = {},
    } = params

    return symbolMappings[exchangeSymbolId] || exchangeSymbolId

  }

}
