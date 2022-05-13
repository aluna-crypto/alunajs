import BigNumber from 'bignumber.js'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaAccountEnum } from '../../../../../lib/enums/AlunaAccountEnum'
import { AlunaPositionStatusEnum } from '../../../../../lib/enums/AlunaPositionStatusEnum'
import {
  IAlunaPositionParseParams,
  IAlunaPositionParseReturns,
} from '../../../../../lib/modules/authed/IAlunaPositionModule'
import { IAlunaPositionSchema } from '../../../../../lib/schemas/IAlunaPositionSchema'
import { translatePositionSideToAluna } from '../../../enums/adapters/bitmexPositionSideAdapter'
import { BitmexSettlementCurrencyEnum } from '../../../enums/BitmexSettlementCurrencyEnum'
import { IBitmexPositionSchema } from '../../../schemas/IBitmexPositionSchema'
import { computeOrderAmount } from '../order/helpers/computeOrderAmount'
import { computeOrderTotal } from '../order/helpers/computeOrderTotal'
import { assembleUIPositionCustomDisplay } from './helpers/assembleUIPositionCustomDisplay'



export const parse = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaPositionParseParams<IBitmexPositionSchema>,
): IAlunaPositionParseReturns => {

  const { rawPosition } = params

  const {
    market,
    bitmexPosition,
  } = rawPosition

  const {
    baseSymbolId,
    quoteSymbolId,
  } = market

  const instrument = market.instrument!

  const { totalSymbolId } = instrument

  const {
    currentQty,
    avgCostPrice,
    avgEntryPrice,
    homeNotional,
    liquidationPrice,
    unrealisedPnl,
    unrealisedRoePcnt,
    symbol,
    leverage,
    crossMargin,
    openingTimestamp,
    prevClosePrice,
    isOpen,
  } = bitmexPosition


  const openedAt = new Date(openingTimestamp)

  let status: AlunaPositionStatusEnum
  let closedAt: Date | undefined
  let closePrice: number | undefined

  if (isOpen) {

    status = AlunaPositionStatusEnum.OPEN

  } else {

    closedAt = new Date()

    status = AlunaPositionStatusEnum.CLOSED

    closePrice = prevClosePrice

  }

  const basePrice = avgCostPrice
  const openPrice = avgEntryPrice

  const bigNumber = new BigNumber(unrealisedPnl)
  const pl = totalSymbolId === BitmexSettlementCurrencyEnum.BTC
    ? bigNumber.times(10 ** -8).toNumber()
    : bigNumber.times(10 ** -6).toNumber()

  const side = translatePositionSideToAluna({
    homeNotional,
  })

  const computeLeverage = crossMargin
    ? undefined
    : leverage

  const { amount } = computeOrderAmount({
    computedPrice: avgCostPrice,
    instrument,
    orderQty: Math.abs(currentQty),
  })

  const { total } = computeOrderTotal({
    computedPrice: avgCostPrice,
    instrument,
    orderQty: Math.abs(currentQty),
    computedAmount: amount,
  })

  const { uiCustomDisplay } = assembleUIPositionCustomDisplay({
    amount,
    total,
    instrument,
    pl,
    bitmexPosition,
  })

  const position: IAlunaPositionSchema = {
    exchangeId: exchange.id,
    symbolPair: symbol,
    baseSymbolId,
    quoteSymbolId,
    total,
    amount,
    basePrice,
    openPrice,
    closePrice,
    liquidationPrice,
    account: AlunaAccountEnum.DERIVATIVES,
    side,
    status,
    pl,
    plPercentage: unrealisedRoePcnt,
    leverage: computeLeverage,
    crossMargin: !!crossMargin,
    openedAt,
    closedAt,
    uiCustomDisplay,
    meta: rawPosition,
  }

  return { position }

}
