import BigNumber from 'bignumber.js'

import { AlunaAccountEnum } from '../../../../lib/enums/AlunaAccountEnum'
import { AlunaPositionStatusEnum } from '../../../../lib/enums/AlunaPositionStatusEnum'
import { AlunaSideEnum } from '../../../../lib/enums/AlunaSideEnum'
import { IAlunaInstrumentSchema } from '../../../../lib/schemas/IAlunaInstrumentSchema'
import { IAlunaPositionSchema } from '../../../../lib/schemas/IAlunaPositionSchema'
import { BitmexSpecs } from '../../BitmexSpecs'
import { BitmexSettlementCurrencyEnum } from '../../enums/BitmexSettlementCurrencyEnum'
import { IBitmexPositionSchema } from '../IBitmexPositionSchema'
import { BitmexOrderParser } from './BitmexOrderParser'



export class BitmexPositionParser {

  public static parse (params: {
    rawPosition: IBitmexPositionSchema,
    baseSymbolId: string,
    quoteSymbolId: string,
    instrument: IAlunaInstrumentSchema,
  }): IAlunaPositionSchema {

    const {
      rawPosition,
      instrument,
    } = params

    const {
      totalSymbolId,
    } = instrument

    const {
      underlying,
      quoteCurrency,
      currentQty,
      openingQty,
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
    } = rawPosition

    const openedAt = new Date(openingTimestamp)

    let status: AlunaPositionStatusEnum
    let closedAt: Date | undefined
    let closePrice: number | undefined

    if (openingQty !== 0) {

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

    const side = homeNotional > 0
      ? AlunaSideEnum.LONG
      : AlunaSideEnum.SHORT

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
      computedAmount: amount,
    })

    const position: IAlunaPositionSchema = {
      exchangeId: BitmexSpecs.id,
      symbolPair: symbol,
      baseSymbolId: underlying,
      quoteSymbolId: quoteCurrency,
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
      meta: rawPosition,
    }

    return position

  }

}

