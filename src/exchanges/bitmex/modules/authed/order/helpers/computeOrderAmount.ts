import { BigNumber } from 'bignumber.js'

import { IAlunaInstrumentSchema } from '../../../../../../lib/schemas/IAlunaInstrumentSchema'



export const computeOrderAmount = (params: {
    orderQty: number
    computedPrice: number
    instrument: IAlunaInstrumentSchema
  }): number => {

  const {
    orderQty,
    computedPrice,
    instrument,
  } = params

  const {
    isInverse,
    contractValue,
    isTradedByUnitsOfContract,
  } = instrument

  if (isTradedByUnitsOfContract) {

    return orderQty

  }

  const bigNumber = new BigNumber(orderQty)

  let amount: number

  if (isInverse) {

    amount = bigNumber
      .div(computedPrice)
      .toNumber()

  } else {

    amount = bigNumber
      .times(contractValue)
      .toNumber()

  }

  return amount


}
