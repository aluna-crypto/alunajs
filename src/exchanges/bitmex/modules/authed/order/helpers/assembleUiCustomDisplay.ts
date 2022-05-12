import BigNumber from 'bignumber.js'

import { IAlunaInstrumentSchema } from '../../../../../../lib/schemas/IAlunaInstrumentSchema'
import { IAlunaOrderUICustomDisplay } from '../../../../../../lib/schemas/IAlunaOrderSchema'
import { IAlunaUICustomDisplaySchema } from '../../../../../../lib/schemas/IAlunaUICustomDisplaySchema'
import { BitmexOrderTypeEnum } from '../../../../enums/BitmexOrderTypeEnum'
import { IBitmexOrder } from '../../../../schemas/IBitmexOrderSchema'



export interface IAssembleUiCustomDisplayReturns {
  uiCustomDisplay: IAlunaOrderUICustomDisplay
}
export const assembleUiCustomDisplay = (params: {
    instrument: IAlunaInstrumentSchema
    bitmexOrder: IBitmexOrder
    computedPrice: number
    computedAmount: number
    computedTotal: number
  }): IAssembleUiCustomDisplayReturns => {

  const {
    instrument,
    bitmexOrder,
    computedPrice,
    computedAmount,
    computedTotal,
  } = params

  const {
    isInverse,
    rateSymbolId,
    totalSymbolId,
    amountSymbolId,
    orderValueMultiplier,
    isTradedByUnitsOfContract,
  } = instrument

  const {
    stopPx,
    ordType,
  } = bitmexOrder

  const uiCustomDisplayAmount: IAlunaUICustomDisplaySchema = {
    symbolId: amountSymbolId,
    value: 0,
  }

  const uiCustomDisplayTotal: IAlunaUICustomDisplaySchema = {
    symbolId: totalSymbolId,
    value: 0,
  }

  const uiCustomDisplay: IAlunaOrderUICustomDisplay = {
    amount: uiCustomDisplayAmount,
    total: uiCustomDisplayTotal,
  }

  switch (ordType) {

    case BitmexOrderTypeEnum.LIMIT:
    case BitmexOrderTypeEnum.MARKET:

      uiCustomDisplay.rate = {
        symbolId: rateSymbolId,
        value: computedPrice,
      }

      break

    case BitmexOrderTypeEnum.STOP_MARKET:

      uiCustomDisplay.stopRate = {
        symbolId: rateSymbolId,
        value: computedPrice,
      }

      break

    default:

      uiCustomDisplay.stopRate = {
        symbolId: rateSymbolId,
        value: stopPx!,
      }

      uiCustomDisplay.limitRate = {
        symbolId: rateSymbolId,
        value: computedPrice,
      }

      break

  }

  if (isTradedByUnitsOfContract) {

    uiCustomDisplayAmount.value = computedAmount

    uiCustomDisplayTotal.value = new BigNumber(computedAmount)
      .times(computedPrice)
      .times(orderValueMultiplier!)
      .toNumber()

  } else if (isInverse) {

    uiCustomDisplayAmount.value = computedTotal

    uiCustomDisplayTotal.value = computedAmount

  } else {

    uiCustomDisplayAmount.value = computedAmount

    uiCustomDisplayTotal.value = computedTotal

  }

  return { uiCustomDisplay }

}
