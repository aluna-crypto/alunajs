import BigNumber from 'bignumber.js'

import { AlunaAccountEnum } from '../../../../lib/enums/AlunaAccountEnum'
import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { AlunaOrderTriggerStatusEnum } from '../../../../lib/enums/AlunaOrderTriggerStatusEnum'
import { AlunaOrderTypesEnum } from '../../../../lib/enums/AlunaOrderTypesEnum'
import { IAlunaInstrumentSchema } from '../../../../lib/schemas/IAlunaInstrumentSchema'
import {
  IAlunaOrderSchema,
  IAlunaOrderUICustomDisplay,
} from '../../../../lib/schemas/IAlunaOrderSchema'
import { IAlunaUICustomDisplaySchema } from '../../../../lib/schemas/IAlunaUICustomDisplaySchema'
import { BitmexSpecs } from '../../BitmexSpecs'
import { BitmexOrderSideAdapter } from '../../enums/adapters/BitmexOrderSideAdapter'
import { BitmexOrderTypeAdapter } from '../../enums/adapters/BitmexOrderTypeAdapter'
import { BitmexStatusAdapter } from '../../enums/adapters/BitmexStatusAdapter'
import { BitmexOrderTypeEnum } from '../../enums/BitmexOrderTypeEnum'
import { IBitmexOrderSchema } from '../IBitmexOrderSchema'



export class BitmexOrderParser {

  public static parse (params: {
    rawOrder: IBitmexOrderSchema,
    baseSymbolId: string,
    quoteSymbolId: string,
    instrument: IAlunaInstrumentSchema,
  }): IAlunaOrderSchema {

    const {
      rawOrder,
      instrument,
      baseSymbolId,
      quoteSymbolId,
    } = params

    const {
      symbol,
      orderID,
      orderQty,
      ordStatus,
      side,
      price,
      stopPx,
      ordType,
      transactTime,
      timestamp,
      triggered,
    } = rawOrder

    const computedStatus = BitmexStatusAdapter.translateToAluna({
      from: ordStatus,
    })

    const computedSide = BitmexOrderSideAdapter.translateToAluna({
      from: side,
    })

    const computedType = BitmexOrderTypeAdapter.translateToAluna({
      from: ordType,
    })

    const triggerStatus = triggered === ''
      ? AlunaOrderTriggerStatusEnum.UNTRIGGERED
      : AlunaOrderTriggerStatusEnum.TRIGGERED

    let rate: number | undefined
    let stopRate: number | undefined
    let limitRate: number | undefined

    let computedPrice: number

    switch (computedType) {

      case AlunaOrderTypesEnum.STOP_MARKET:
        stopRate = stopPx!
        computedPrice = stopPx!
        break

      case AlunaOrderTypesEnum.STOP_LIMIT:
        stopRate = stopPx!
        limitRate = price!
        computedPrice = limitRate
        break

      // 'Limit' and 'Market'
      default:
        rate = price!
        computedPrice = rate

    }

    const computedAmount = BitmexOrderParser.computeOrderAmount({
      orderQty,
      instrument,
      computedPrice,
    })

    const computedTotal = BitmexOrderParser.computeOrderTotal({
      instrument,
      orderQty,
      computedPrice,
      computedAmount,
    })

    const placedAt = new Date(transactTime)
    const computedTimeStamp = new Date(timestamp)

    let filledAt: Date | undefined
    let canceledAt: Date | undefined

    if (computedStatus === AlunaOrderStatusEnum.FILLED) {

      filledAt = computedTimeStamp

    } else if (computedStatus === AlunaOrderStatusEnum.CANCELED) {

      canceledAt = computedTimeStamp

    }

    const uiCustomDisplay = BitmexOrderParser.assembleUiCustomDisplay({
      instrument,
      rawOrder,
      computedAmount,
      computedPrice,
      computedTotal,
    })

    const order: IAlunaOrderSchema = {
      id: orderID,
      symbolPair: symbol,
      baseSymbolId,
      quoteSymbolId,
      exchangeId: BitmexSpecs.id,
      account: AlunaAccountEnum.DERIVATIVES,
      type: computedType,
      amount: computedAmount,
      total: computedTotal,
      status: computedStatus,
      side: computedSide,
      rate,
      stopRate,
      limitRate,
      uiCustomDisplay,
      placedAt,
      filledAt,
      canceledAt,
      triggerStatus,
      meta: rawOrder,
    }

    return order

  }

  public static assembleUiCustomDisplay (params: {
    instrument: IAlunaInstrumentSchema,
    rawOrder: IBitmexOrderSchema,
    computedPrice: number,
    computedAmount: number,
    computedTotal: number,
  }): IAlunaOrderUICustomDisplay {

    const {
      instrument,
      rawOrder,
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
    } = rawOrder

    const uiCustomDisplayAmount: IAlunaUICustomDisplaySchema = {
      symbolId: amountSymbolId,
      value: 0,
    }

    const uiCustomDisplayTotal: IAlunaUICustomDisplaySchema = {
      symbolId: totalSymbolId,
      value: 0,
    }

    const output: IAlunaOrderUICustomDisplay = {
      amount: uiCustomDisplayAmount,
      total: uiCustomDisplayTotal,
    }

    switch (ordType) {

      case BitmexOrderTypeEnum.LIMIT:
      case BitmexOrderTypeEnum.MARKET:

        output.rate = {
          symbolId: rateSymbolId,
          value: computedPrice,
        }

        break

      case BitmexOrderTypeEnum.STOP_MARKET:

        output.stopRate = {
          symbolId: rateSymbolId,
          value: computedPrice,
        }

        break

      default:

        output.stopRate = {
          symbolId: rateSymbolId,
          value: stopPx!,
        }

        output.limitRate = {
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

    return output

  }

  public static computeOrderTotal (params: {
    computedPrice: number,
    computedAmount: number,
    orderQty: number,
    instrument: IAlunaInstrumentSchema,
  }) {

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

    let computedTotal: number

    if (isTradedByUnitsOfContract) {

      const priceRatio = new BigNumber(computedPrice)
        .div(price)
        .toNumber()

      const pricePerContract = new BigNumber(priceRatio)
        .times(usdPricePerUnit!)
        .toNumber()

      computedTotal = new BigNumber(computedAmount)
        .times(pricePerContract)
        .toNumber()

    } else if (isInverse) {

      computedTotal = orderQty

    } else {

      computedTotal = new BigNumber(computedAmount)
        .times(computedPrice)
        .toNumber()

    }

    return computedTotal

  }


  public static computeOrderAmount (params: {
    orderQty: number,
    computedPrice: number,
    instrument: IAlunaInstrumentSchema,
  }): number {

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


  static translateAmountToOrderQty (params: {
    amount: number,
    instrument: IAlunaInstrumentSchema,
  }): number {

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

}
