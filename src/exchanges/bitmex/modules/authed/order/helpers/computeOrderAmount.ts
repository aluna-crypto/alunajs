import { BigNumber } from 'bignumber.js'

import { IAlunaInstrumentSchema } from '../../../../../../lib/schemas/IAlunaInstrumentSchema'



export interface IComputeOrderAmountParams {
  orderQty: number
  computedPrice: number
  instrument: IAlunaInstrumentSchema
}



export interface IComputeOrderAmountReturns {
  amount: number
}



export const computeOrderAmount = (
  params: IComputeOrderAmountParams,
): IComputeOrderAmountReturns => {

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

  let amount = orderQty

  if (isTradedByUnitsOfContract) {

    return { amount }

  }

  const bigNumber = new BigNumber(orderQty)

  if (isInverse) {

    amount = bigNumber
      .div(computedPrice)
      .toNumber()

  } else {

    amount = bigNumber
      .times(contractValue)
      .toNumber()

  }

  return { amount }


}
