export const translateSymbolId = (params: {
    exchangeSymbolId: string,
    symbolMappings?: Record<string, string>,
  }): string => {

  const {
    exchangeSymbolId,
    symbolMappings = {},
  } = params

  return symbolMappings[exchangeSymbolId] || exchangeSymbolId

}
