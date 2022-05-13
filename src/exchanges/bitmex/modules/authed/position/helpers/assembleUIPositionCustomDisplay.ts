import { IAlunaInstrumentSchema } from '../../../../../../lib/schemas/IAlunaInstrumentSchema'
import { IAlunaUIPositionCustomDisplay } from '../../../../../../lib/schemas/IAlunaPositionSchema'
import { IAlunaUICustomDisplaySchema } from '../../../../../../lib/schemas/IAlunaUICustomDisplaySchema'
import { IBitmexPosition } from '../../../../schemas/IBitmexPositionSchema'



export interface IAssembleUIPositionCustomDisplayParams {
  bitmexPosition: IBitmexPosition
  amount: number
  total: number
  pl: number
  instrument: IAlunaInstrumentSchema
}



export interface IAssembleUIPositionCustomDisplayReturns {
  uiCustomDisplay: IAlunaUIPositionCustomDisplay
}



export const assembleUIPositionCustomDisplay = (
  params: IAssembleUIPositionCustomDisplayParams,
): IAssembleUIPositionCustomDisplayReturns => {

  const {
    total,
    instrument,
    amount,
    bitmexPosition,
    pl,
  } = params

  const {
    homeNotional,
    underlying,
    quoteCurrency,
    avgCostPrice,
  } = bitmexPosition

  const {
    isInverse,
    totalSymbolId,
    isTradedByUnitsOfContract,
    amountSymbolId,
  } = instrument

  const uiCustomDisplayRate: IAlunaUICustomDisplaySchema = {
    symbolId: quoteCurrency,
    value: avgCostPrice,
  }

  const uiCustomDisplayAmount: IAlunaUICustomDisplaySchema = {
    symbolId: '',
    value: 0,
  }

  const uiCustomDisplayTotal: IAlunaUICustomDisplaySchema = {
    symbolId: '',
    value: 0,
  }

  const uiCustomDisplayPl: IAlunaUICustomDisplaySchema = {
    symbolId: totalSymbolId,
    value: pl,
  }

  if (isTradedByUnitsOfContract) {

    uiCustomDisplayAmount.symbolId = 'Cont'
    uiCustomDisplayAmount.value = amount

    uiCustomDisplayTotal.symbolId = underlying
    uiCustomDisplayTotal.value = homeNotional

  } else if (isInverse) {

    uiCustomDisplayAmount.symbolId = amountSymbolId
    uiCustomDisplayAmount.value = total

    uiCustomDisplayTotal.symbolId = 'XBT'
    uiCustomDisplayTotal.value = amount

  } else {

    uiCustomDisplayAmount.symbolId = amountSymbolId
    uiCustomDisplayAmount.value = amount

    uiCustomDisplayTotal.symbolId = amountSymbolId
    uiCustomDisplayTotal.value = amount

    uiCustomDisplayRate.symbolId = totalSymbolId

  }

  const uiCustomDisplay: IAlunaUIPositionCustomDisplay = {
    amount: uiCustomDisplayAmount,
    rate: uiCustomDisplayRate,
    total: uiCustomDisplayTotal,
    pnl: uiCustomDisplayPl,
  }

  return { uiCustomDisplay }

}
