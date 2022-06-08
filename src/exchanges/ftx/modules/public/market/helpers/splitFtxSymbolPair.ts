export interface ISplitFtxSymbolPairParams {
  market: string
}



export interface ISplitFtxSymbolPairReturns {
  baseSymbolId: string
  quoteSymbolId: string
}



export const splitFtxSymbolPair = (
  params: ISplitFtxSymbolPairParams,
): ISplitFtxSymbolPairReturns => {

  const { market } = params

  let baseSymbolId: string
  let quoteSymbolId: string

  if (/-/.test(market)) {

    [baseSymbolId] = market.split(/-/)

    // All FTX derivatives markets are quoted in USD
    quoteSymbolId = 'USD'

  } else {

    [baseSymbolId, quoteSymbolId] = market.split(/\//)

  }

  return {
    baseSymbolId,
    quoteSymbolId,
  }

}
