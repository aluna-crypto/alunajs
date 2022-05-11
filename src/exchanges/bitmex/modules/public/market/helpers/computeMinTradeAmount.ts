import { IBitmexMarketSchema } from '../../../../schemas/IBitmexMarketSchema'



export const computeMinTradeAmount = (params: {
  rawMarket: IBitmexMarketSchema
}): number => {

  const { rawMarket } = params

  const {
    lotSize,
    underlyingToPositionMultiplier: multiplier,
  } = rawMarket

  const minTradeAmount = Number(lotSize) / (multiplier || 1)

  return minTradeAmount

}
