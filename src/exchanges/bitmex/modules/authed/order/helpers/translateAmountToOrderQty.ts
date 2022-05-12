import BigNumber from 'bignumber.js'

import { IAlunaInstrumentSchema } from '../../../../../../lib/schemas/IAlunaInstrumentSchema'



export const translateAmountToOrderQty = (params: {
    amount: number
    instrument: IAlunaInstrumentSchema
  }): number => {

  const {
    amount,
    instrument,
  } = params

  const {
    isInverse,
    contractValue,
    isTradedByUnitsOfContract,
  } = instrument

  const orderQtyIsCorrect = isTradedByUnitsOfContract || isInverse

  if (orderQtyIsCorrect) {

    return amount

  }

  const orderQty = new BigNumber(amount)
    .div(contractValue)
    .toNumber()

  return orderQty

}
