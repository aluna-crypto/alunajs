import BigNumber from 'bignumber.js'

import { IBitmexMarketSchema } from '../../../../schemas/IBitmexMarketSchema'



export const computeUsdPricePerUnit = (params: {
    rawMarket: IBitmexMarketSchema
  }): number => {

  const { rawMarket } = params

  const {
    multiplier,
    markPrice,
    quoteToSettleMultiplier,
  } = rawMarket

  const usdPricePerUnit = new BigNumber(Math.abs(multiplier))
    .times(markPrice)
    .div(quoteToSettleMultiplier)
    .toNumber()

  return usdPricePerUnit

}

