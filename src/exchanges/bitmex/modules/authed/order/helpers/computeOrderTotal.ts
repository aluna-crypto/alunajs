import BigNumber from 'bignumber.js'

import { IAlunaInstrumentSchema } from '../../../../../../lib/schemas/IAlunaInstrumentSchema'



export interface IComputeOrderTotalParams {
  computedPrice: number
  computedAmount: number
  orderQty: number
  instrument: IAlunaInstrumentSchema
}



export interface IComputeOrderTotalReturns {
  total: number
}



export const computeOrderTotal = (
  params: IComputeOrderTotalParams,
): IComputeOrderTotalReturns => {

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

  let total: number

  if (isTradedByUnitsOfContract) {

    const priceRatio = new BigNumber(computedPrice)
      .div(price)
      .toNumber()

    const pricePerContract = new BigNumber(priceRatio)
      .times(usdPricePerUnit!)
      .toNumber()

    total = new BigNumber(computedAmount)
      .times(pricePerContract)
      .toNumber()

  } else if (isInverse) {

    total = orderQty

  } else {

    total = new BigNumber(computedAmount)
      .times(computedPrice)
      .toNumber()

  }

  return { total }

}
