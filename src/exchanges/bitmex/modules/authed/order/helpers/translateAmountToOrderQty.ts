import BigNumber from 'bignumber.js'

import { IAlunaInstrumentSchema } from '../../../../../../lib/schemas/IAlunaInstrumentSchema'



export interface ITranslateAmountToOrderQtyParams {
  amount: number
  instrument: IAlunaInstrumentSchema
}



export interface ITranslateAmountToOrderQtyReturns {
  orderQty: number
}



export const translateAmountToOrderQty = (params: {
    amount: number
    instrument: IAlunaInstrumentSchema
  }): ITranslateAmountToOrderQtyReturns => {

  const {
    amount,
    instrument,
  } = params

  const {
    isInverse,
    contractValue,
    isTradedByUnitsOfContract,
  } = instrument

  let orderQty = amount

  const orderQtyIsCorrect = isTradedByUnitsOfContract || isInverse

  if (orderQtyIsCorrect) {

    return { orderQty }

  }

  orderQty = new BigNumber(amount)
    .div(contractValue)
    .toNumber()

  return { orderQty }

}
