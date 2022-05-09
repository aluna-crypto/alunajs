export interface ISplitSymbolPairResponse {
  baseSymbolId: string
  quoteSymbolId: string
}

export const splitSymbolPair = (params: {
  symbolPair: string
}): ISplitSymbolPairResponse => {

  const { symbolPair } = params

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

  return {
    baseSymbolId,
    quoteSymbolId,
  }

}
