import { IBitmexMarketSchema } from '../../../../schemas/IBitmexMarketSchema'



export const computeOrderValueMultiplier = (params: {
    rawMarket: IBitmexMarketSchema
  }): number | undefined => {

  const { rawMarket } = params

  let orderValueMultiplier: number | undefined

  const {
    maxPrice,
    isInverse,
    multiplier,
    isQuanto,
  } = rawMarket

  const fixedMultiplier = multiplier.toString().replace(/0+/, '')

  if (isQuanto) {

    orderValueMultiplier = (1 / Math.abs(maxPrice)) * Number(fixedMultiplier)

  } else if (!isInverse) {

    orderValueMultiplier = 1

  }

  return orderValueMultiplier

}
