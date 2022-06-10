import { IBitmexMarketSchema } from '../../../../schemas/IBitmexMarketSchema'



export const computeMinMaxTradeAmount = (params: {
  rawMarket: IBitmexMarketSchema
}): {
  minTradeAmount: number
  maxTradeAmount: number
} => {

  const { rawMarket } = params

  const {
    lotSize,
    maxOrderQty,
    underlyingToPositionMultiplier: multiplier,
  } = rawMarket

  const minTradeAmount = lotSize / (multiplier || 1)

  const maxTradeAmount = maxOrderQty / (multiplier || 1)

  return {
    minTradeAmount,
    maxTradeAmount,
  }

}
