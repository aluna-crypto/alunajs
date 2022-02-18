import { BigNumber } from 'bignumber.js'

import { AlunaInstrumentStateEnum } from '../../../../lib/enums/AlunaInstrumentStateEnum'
import { IAlunaInstrumentSchema } from '../../../../lib/schemas/IAlunaInstrumentSchema'
import { BitmexInstrumentStateEnum } from '../../enums/BitmexInstrumentStateEnum'
import { BitmexSettlementCurrencyEnum } from '../../enums/BitmexSettlementCurrencyEnum'
import { IBitmexMarketsSchema } from '../IBitmexMarketsSchema'



export class BitmexInstrumentParser {

  public static parse (params: {
    rawMarket: IBitmexMarketsSchema,
  }): IAlunaInstrumentSchema {

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
    } = BitmexInstrumentParser.resolveSymbolsIds({ rawMarket })

    const contractValue = BitmexInstrumentParser.computeContractValue({
      rawMarket,
    })

    const contractCurrency = BitmexInstrumentParser.computeContractCurrency({
      rawMarket,
    })

    const minTradeAmount = BitmexInstrumentParser.computeMinTradeAmount({
      rawMarket,
    })

    const orderValueMultiplier = BitmexInstrumentParser
      .computeOrderValueMultiplier({
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
    }

    return instrument

  }


  public static computeContractValue (params: {
    rawMarket: IBitmexMarketsSchema,
  }): number {

    const { rawMarket } = params

    const {
      isQuanto,
      markPrice,
      multiplier,
      settlCurrency,
    } = rawMarket

    let contractValue = 0

    const absoluteMultiplier = Math.abs(Number(multiplier))

    if (settlCurrency === BitmexSettlementCurrencyEnum.BTC) {

      contractValue = new BigNumber(absoluteMultiplier)
        .times(10 ** -8)
        .toNumber()

      if (isQuanto) {

        contractValue = new BigNumber(contractValue)
          .times(markPrice)
          .toNumber()

      }

    } else {

      contractValue = new BigNumber(absoluteMultiplier)
        .times(10 ** -6)
        .toNumber()

    }

    return contractValue

  }


  public static computeContractCurrency = (params: {
    rawMarket: IBitmexMarketsSchema,
  }): string => {

    const { rawMarket } = params

    const {
      isQuanto,
      isInverse,
      rootSymbol,
      quoteCurrency,
    } = rawMarket

    let contractCurrency

    if (isQuanto) {

      contractCurrency = 'XBT'

    } else {

      contractCurrency = isInverse
        ? quoteCurrency
        : rootSymbol

    }

    return contractCurrency

  }


  public static resolveSymbolsIds = (params: {
    rawMarket: IBitmexMarketsSchema,
  }): {
    rateSymbolId: string,
    totalSymbolId: string,
    amountSymbolId: string,
  } => {

    const { rawMarket } = params

    const {
      isQuanto,
      isInverse,
      settlCurrency,
      quoteCurrency,
      positionCurrency,
    } = rawMarket

    let amountSymbolId: string

    if (isQuanto) {

      amountSymbolId = 'Cont'

    } else if (isInverse) {

      amountSymbolId = quoteCurrency

    } else {

      amountSymbolId = positionCurrency

    }

    const rateSymbolId = quoteCurrency

    const totalSymbolId = settlCurrency.toUpperCase()

    return {
      rateSymbolId,
      totalSymbolId,
      amountSymbolId,
    }

  }

  public static computeMinTradeAmount = (params: {
    rawMarket: IBitmexMarketsSchema,
  }): number => {

    const { rawMarket } = params

    const {
      lotSize,
      underlyingToPositionMultiplier: multiplier,
    } = rawMarket

    const minTradeAmount = Number(lotSize) / (multiplier || 1)

    return minTradeAmount

  }


  public static computeOrderValueMultiplier = (params: {
    rawMarket: IBitmexMarketsSchema,
  }): number | undefined => {

    const { rawMarket } = params

    let orderValueMultiplier: number | undefined

    const {
      maxPrice,
      isInverse,
      multiplier,
      isQuanto,
    } = rawMarket

    const fixedMultiplier = multiplier.toString().replace(/0+/, '')

    if (isQuanto) {

      orderValueMultiplier = (1 / Math.abs(maxPrice)) * Number(fixedMultiplier)

    } else if (!isInverse) {

      orderValueMultiplier = 1

    }

    return orderValueMultiplier

  }

}
