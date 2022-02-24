import BigNumber from 'bignumber.js'

import { AlunaAccountEnum } from '../../../../lib/enums/AlunaAccountEnum'
import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { AlunaOrderTypesEnum } from '../../../../lib/enums/AlunaOrderTypesEnum'
import { IAlunaInstrumentSchema } from '../../../../lib/schemas/IAlunaInstrumentSchema'
import {
  IAlunaOrderSchema,
  IAlunaOrderUICustomDisplay,
} from '../../../../lib/schemas/IAlunaOrderSchema'
import { IAlunaUICustomDisplaySchema } from '../../../../lib/schemas/IAlunaUICustomDisplaySchema'
import { BitmexSpecs } from '../../BitmexSpecs'
import { BitmexOrderTypeAdapter } from '../../enums/adapters/BitmexOrderTypeAdapter'
import { BitmexSideAdapter } from '../../enums/adapters/BitmexSideAdapter'
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
      baseSymbolId,
      quoteSymbolId,
      instrument,
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
    } = rawOrder

    const computedStatus = BitmexStatusAdapter.translateToAluna({
      from: ordStatus,
    })

    const computedSide = BitmexSideAdapter.translateToAluna({
      from: side,
    })

    const computedType = BitmexOrderTypeAdapter.translateToAluna({
      from: ordType,
    })

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

    const {
      computedAmount,
      computedTotal,
    } = BitmexOrderParser.computeAmountAndTotal({
      computedPrice,
      instrument,
      orderQty,
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

  public static computeAmountAndTotal (params: {
    orderQty: number,
    computedPrice: number,
    instrument: IAlunaInstrumentSchema,
  }) {

    const {
      orderQty,
      instrument,
      computedPrice,
    } = params

    const {
      isInverse,
      isTradedByUnitsOfContract,
      contractValue,
      usdPricePerUnit,
      price,
    } = instrument

    let computedAmount: number
    let computedTotal: number

    if (isTradedByUnitsOfContract) {

      computedAmount = orderQty

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

      computedAmount = new BigNumber(orderQty)
        .div(computedPrice)
        .toNumber()

    } else {

      computedAmount = new BigNumber(orderQty)
        .times(contractValue)
        .toNumber()

      computedTotal = new BigNumber(computedAmount)
        .times(computedPrice)
        .toNumber()

    }

    return {
      computedAmount,
      computedTotal,
    }

  }

}
