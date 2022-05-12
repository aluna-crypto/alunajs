import BigNumber from 'bignumber.js'

import { IAlunaInstrumentSchema } from '../../../../../../lib/schemas/IAlunaInstrumentSchema'



export const computeOrderTotal = (params: {
    computedPrice: number
    computedAmount: number
    orderQty: number
    instrument: IAlunaInstrumentSchema
  }) => {

  const {
    instrument,
    computedPrice,
    computedAmount,
    orderQty,
  } = params

  const {
    isInverse,
    isTradedByUnitsOfContract,
    usdPricePerUnit,
    price,
  } = instrument

  let computedTotal: number

  if (isTradedByUnitsOfContract) {

    const priceRatio = new BigNumber(computedPrice)
      .div(price)
      .toNumber()

    const pricePerContract = new BigNumber(priceRatio)
      .times(usdPricePerUnit!)
      .toNumber()

    computedTotal = new BigNumber(computedAmount)
      .times(pricePerContract)
      .toNumber()

  } else if (isInverse) {

    computedTotal = orderQty

  } else {

    computedTotal = new BigNumber(computedAmount)
      .times(computedPrice)
      .toNumber()

  }

  return computedTotal

}
