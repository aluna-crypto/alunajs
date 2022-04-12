import BigNumber from 'bignumber.js'

import { AlunaAccountEnum } from '../../../../lib/enums/AlunaAccountEnum'
import { AlunaPositionStatusEnum } from '../../../../lib/enums/AlunaPositionStatusEnum'
import { IAlunaInstrumentSchema } from '../../../../lib/schemas/IAlunaInstrumentSchema'
import {
  IAlunaPositionSchema,
  IAlunaUIPositionCustomDisplay,
} from '../../../../lib/schemas/IAlunaPositionSchema'
import { IAlunaUICustomDisplaySchema } from '../../../../lib/schemas/IAlunaUICustomDisplaySchema'
import { BitmexSpecs } from '../../BitmexSpecs'
import { BitmexPositionSideAdapter } from '../../enums/adapters/BitmexPositionSideAdapter'
import { BitmexSettlementCurrencyEnum } from '../../enums/BitmexSettlementCurrencyEnum'
import { IBitmexPositionSchema } from '../IBitmexPositionSchema'
import { BitmexOrderParser } from './BitmexOrderParser'



export class BitmexPositionParser {

  public static parse (params: {
    rawPosition: IBitmexPositionSchema,
    instrument: IAlunaInstrumentSchema,
    baseSymbolId: string,
    quoteSymbolId: string,
  }): IAlunaPositionSchema {

    const {
      rawPosition,
      instrument,
      baseSymbolId,
      quoteSymbolId,
    } = params

    const {
      totalSymbolId,
    } = instrument

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
    } = rawPosition

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
    const computedPl = totalSymbolId === BitmexSettlementCurrencyEnum.BTC
      ? bigNumber.times(10 ** -8).toNumber()
      : bigNumber.times(10 ** -6).toNumber()

    const side = BitmexPositionSideAdapter.translateToAluna({
      homeNotional,
    })

    const computeLeverage = crossMargin
      ? undefined
      : leverage

    const amount = BitmexOrderParser.computeOrderAmount({
      computedPrice: avgCostPrice,
      instrument,
      orderQty: Math.abs(currentQty),
    })

    const total = BitmexOrderParser.computeOrderTotal({
      computedPrice: avgCostPrice,
      instrument,
      orderQty: Math.abs(currentQty),
      computedAmount: amount,
    })

    const uiCustomDisplay = BitmexPositionParser.assembleUiCustomDisplay({
      computedAmount: amount,
      computedTotal: total,
      instrument,
      computedPl,
      rawPosition,
    })

    const position: IAlunaPositionSchema = {
      exchangeId: BitmexSpecs.id,
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
      pl: computedPl,
      plPercentage: unrealisedRoePcnt,
      leverage: computeLeverage,
      crossMargin: !!crossMargin,
      openedAt,
      closedAt,
      uiCustomDisplay,
      meta: rawPosition,
    }

    return position

  }

  public static assembleUiCustomDisplay (params: {
    rawPosition: IBitmexPositionSchema,
    computedAmount: number,
    computedTotal: number,
    computedPl: number,
    instrument: IAlunaInstrumentSchema,
  }): IAlunaUIPositionCustomDisplay {

    const {
      computedTotal,
      instrument,
      computedAmount,
      rawPosition,
      computedPl,
    } = params

    const {
      homeNotional,
      underlying,
      quoteCurrency,
      avgCostPrice,
    } = rawPosition

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
      value: computedPl,
    }

    if (isTradedByUnitsOfContract) {

      uiCustomDisplayAmount.symbolId = 'Cont'
      uiCustomDisplayAmount.value = computedAmount

      uiCustomDisplayTotal.symbolId = underlying
      uiCustomDisplayTotal.value = homeNotional

    } else if (isInverse) {

      uiCustomDisplayAmount.symbolId = amountSymbolId
      uiCustomDisplayAmount.value = computedTotal

      uiCustomDisplayTotal.symbolId = 'XBT'
      uiCustomDisplayTotal.value = computedAmount

    } else {

      uiCustomDisplayAmount.symbolId = amountSymbolId
      uiCustomDisplayAmount.value = computedAmount

      uiCustomDisplayTotal.symbolId = amountSymbolId
      uiCustomDisplayTotal.value = computedAmount

      uiCustomDisplayRate.symbolId = totalSymbolId

    }

    return {
      amount: uiCustomDisplayAmount,
      rate: uiCustomDisplayRate,
      total: uiCustomDisplayTotal,
      pnl: uiCustomDisplayPl,
    }

  }

}

