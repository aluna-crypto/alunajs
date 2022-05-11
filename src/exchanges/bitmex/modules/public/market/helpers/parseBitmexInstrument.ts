import { AlunaInstrumentStateEnum } from '../../../../../../lib/enums/AlunaInstrumentStateEnum'
import { IAlunaInstrumentSchema } from '../../../../../../lib/schemas/IAlunaInstrumentSchema'
import { BitmexInstrumentStateEnum } from '../../../../enums/BitmexInstrumentStateEnum'
import { IBitmexMarketSchema } from '../../../../schemas/IBitmexMarketSchema'
import { computeContractCurrency } from './computeContractCurrency'
import { computeContractValue } from './computeContractValue'
import { computeMinTradeAmount } from './computeMinTradeAmount'
import { computeOrderValueMultiplier } from './computeOrderValueMultiplier'
import { computeUsdPricePerUnit } from './computeUsdPricePerUnit'
import { resolveSymbolsIds } from './resolveSymbolsIds'



export interface IParseBitmexInstrumentReturns {
  instrument: IAlunaInstrumentSchema
}



export const parseBitmexInstrument = (params: {
    rawMarket: IBitmexMarketSchema
  }): IParseBitmexInstrumentReturns => {

  const { rawMarket } = params

  const {
    state,
    expiry,
    front,
    listing,
    settle,
    symbol,
    isQuanto,
    isInverse,
    lastPrice,
    rootSymbol,
    sessionInterval,
    openingTimestamp,
    closingTimestamp,
  } = rawMarket

  const {
    rateSymbolId,
    totalSymbolId,
    amountSymbolId,
  } = resolveSymbolsIds({ rawMarket })

  const contractValue = computeContractValue({
    rawMarket,
  })

  const contractCurrency = computeContractCurrency({
    rawMarket,
  })

  const minTradeAmount = computeMinTradeAmount({
    rawMarket,
  })

  let usdPricePerUnit: number | undefined

  if (isQuanto) {

    usdPricePerUnit = computeUsdPricePerUnit({
      rawMarket,
    })

  }

  const orderValueMultiplier = computeOrderValueMultiplier({
    rawMarket,
  })

  const splittedName = symbol.replace(
    new RegExp(`${rootSymbol}`),
    `${rootSymbol} `,
  )

  const computedExpireDate = expiry
    ? new Date(expiry)
    : null

  const computedSettleDate = settle
    ? new Date(settle)
    : null

  const computedState = state === BitmexInstrumentStateEnum.OPEN
    ? AlunaInstrumentStateEnum.OPEN
    : AlunaInstrumentStateEnum.CLOSED

  const instrument: IAlunaInstrumentSchema = {
    name: symbol,
    splittedName,
    state: computedState,
    openDate: new Date(openingTimestamp),
    closeDate: new Date(closingTimestamp),
    sessionIntervalDate: new Date(sessionInterval),
    listingDate: new Date(listing),
    frontDate: new Date(front),
    expireDate: computedExpireDate,
    settleDate: computedSettleDate,
    price: lastPrice,
    isTradedByUnitsOfContract: isQuanto,
    isInverse,
    rateSymbolId,
    totalSymbolId,
    amountSymbolId,
    minTradeAmount,
    contractValue,
    contractCurrency,
    orderValueMultiplier,
    usdPricePerUnit,
  }

  return { instrument }

}
