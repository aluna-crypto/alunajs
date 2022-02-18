import { BigNumber } from 'bignumber.js'
import { expect } from 'chai'
import { each } from 'lodash'
import { ImportMock } from 'ts-mock-imports'

import { AlunaInstrumentStateEnum } from '../../../../lib/enums/AlunaInstrumentStateEnum'
import { BitmexInstrumentStateEnum } from '../../enums/BitmexInstrumentStateEnum'
import { BitmexSettlementCurrencyEnum } from '../../enums/BitmexSettlementCurrencyEnum'
import { BITMEX_RAW_SYMBOLS } from '../../test/bitmexSymbols'
import { BitmexInstrumentParser } from './BitmexInstrumentParser'



describe('BitmexInstrumentParser', () => {

  const {
    parse,
    resolveSymbolsIds,
    computeContractValue,
    computeMinTradeAmount,
    computeContractCurrency,
    computeOrderValueMultiplier,
  } = BitmexInstrumentParser

  it('should properly create Aluna instrument', () => {

    const mockedContractValue = 10
    const mockedContractCurrency = 'TORREs'
    const mockedMinTradeAmount = 1000
    const mockedOrderValueMultiplier = 0.9
    const mockedAmountSymbolId = 'ETH'
    const mockedRateSymbolId = 'XBT'
    const mockedTotalSymbolId = 'USD'

    const computeContractValueMock = ImportMock.mockFunction(
      BitmexInstrumentParser,
      'computeContractValue',
      mockedContractValue,
    )

    const computeContractCurrencyMock = ImportMock.mockFunction(
      BitmexInstrumentParser,
      'computeContractCurrency',
      mockedContractCurrency,
    )

    const computeMinTradeAmountMock = ImportMock.mockFunction(
      BitmexInstrumentParser,
      'computeMinTradeAmount',
      mockedMinTradeAmount,
    )

    const computeOrderValueMultiplierMock = ImportMock.mockFunction(
      BitmexInstrumentParser,
      'computeOrderValueMultiplier',
      mockedOrderValueMultiplier,
    )

    const resolveSymbolsIdsMock = ImportMock.mockFunction(
      BitmexInstrumentParser,
      'resolveSymbolsIds',
      {
        rateSymbolId: mockedRateSymbolId,
        totalSymbolId: mockedTotalSymbolId,
        amountSymbolId: mockedAmountSymbolId,
      },
    )

    each(BITMEX_RAW_SYMBOLS, (rawMarket) => {

      const {
        symbol,
        rootSymbol,
        expiry,
        settle,
        state,
        openingTimestamp,
        closingTimestamp,
        sessionInterval,
        listing,
        front,
        isQuanto,
        isInverse,
        lastPrice,
      } = rawMarket

      const expectedSplittedName = symbol.replace(
        new RegExp(`${rootSymbol}`),
        `${rootSymbol} `,
      )

      const expectedExpireDate = expiry
        ? new Date(expiry)
        : null

      const expectedSettleDate = settle
        ? new Date(settle)
        : null

      const expectedState = state === BitmexInstrumentStateEnum.OPEN
        ? AlunaInstrumentStateEnum.OPEN
        : AlunaInstrumentStateEnum.CLOSED

      const instrument = parse({ rawMarket })

      expect(instrument.name).to.be.eq(symbol)
      expect(instrument.splittedName).to.be.eq(expectedSplittedName)
      expect(instrument.state).to.be.eq(expectedState)
      expect(instrument.openDate).to.deep.eq(new Date(openingTimestamp))
      expect(instrument.closeDate).to.deep.eq(new Date(closingTimestamp))
      expect(instrument.sessionIntervalDate)
        .to.deep.eq(new Date(sessionInterval))
      expect(instrument.listingDate).to.deep.eq(new Date(listing))
      expect(instrument.frontDate).to.deep.eq(new Date(front))
      expect(instrument.expireDate).to.deep.eq(expectedExpireDate)
      expect(instrument.settleDate).to.deep.eq(expectedSettleDate)
      expect(instrument.price).to.be.eq(lastPrice)
      expect(instrument.isTradedByUnitsOfContract).to.be.eq(isQuanto)
      expect(instrument.isInverse).to.be.eq(isInverse)
      expect(instrument.amountSymbolId).to.be.eq(mockedAmountSymbolId)
      expect(instrument.rateSymbolId).to.be.eq(mockedRateSymbolId)
      expect(instrument.totalSymbolId).to.be.eq(mockedTotalSymbolId)
      expect(instrument.minTradeAmount).to.be.eq(mockedMinTradeAmount)
      expect(instrument.contractValue).to.be.eq(mockedContractValue)
      expect(instrument.contractCurrency).to.be.eq(mockedContractCurrency)
      expect(instrument.orderValueMultiplier)
        .to.be.eq(mockedOrderValueMultiplier)

    })

    const { length } = BITMEX_RAW_SYMBOLS

    expect(computeContractValueMock.callCount).to.be.eq(length)
    expect(computeContractCurrencyMock.callCount).to.be.eq(length)
    expect(computeMinTradeAmountMock.callCount).to.be.eq(length)
    expect(computeOrderValueMultiplierMock.callCount).to.be.eq(length)
    expect(resolveSymbolsIdsMock.callCount).to.be.eq(length)

  })

  it('should properly compute contract value', () => {

    each(BITMEX_RAW_SYMBOLS, (rawMarket) => {

      const {
        isQuanto,
        markPrice,
        multiplier,
        settlCurrency,
      } = rawMarket

      let expectedContractValue = 0

      const absoluteMultiplier = Math.abs(Number(multiplier))

      if (settlCurrency === BitmexSettlementCurrencyEnum.BTC) {

        expectedContractValue = new BigNumber(absoluteMultiplier)
          .times(10 ** -8)
          .toNumber()

        if (isQuanto) {

          expectedContractValue = new BigNumber(expectedContractValue)
            .times(markPrice)
            .toNumber()

        }

      } else {

        expectedContractValue = new BigNumber(absoluteMultiplier)
          .times(10 ** -6)
          .toNumber()

      }

      const contractValue = computeContractValue({
        rawMarket,
      })

      expect(contractValue).to.be.eq(expectedContractValue)

    })

  })

  it('should properly compute contract currency', () => {

    each(BITMEX_RAW_SYMBOLS, (rawMarket) => {

      const {
        isQuanto,
        isInverse,
        rootSymbol,
        quoteCurrency,
      } = rawMarket

      let expectedContractCurrency

      if (isQuanto) {

        expectedContractCurrency = 'XBT'

      } else {

        expectedContractCurrency = isInverse
          ? quoteCurrency
          : rootSymbol

      }

      const contractCurrency = computeContractCurrency({
        rawMarket,
      })

      expect(contractCurrency).to.be.eq(expectedContractCurrency)

    })

  })

  it('should properly compute minimun trade amount', () => {

    each(BITMEX_RAW_SYMBOLS, (rawMarket) => {

      const {
        lotSize,
        underlyingToPositionMultiplier: multiplier,
      } = rawMarket

      const expectedMinTradeAmount = Number(lotSize) / (multiplier || 1)

      const minTradeAmount = computeMinTradeAmount({
        rawMarket,
      })

      expect(minTradeAmount).to.be.eq(expectedMinTradeAmount)

    })

  })

  it('should properly compute order value multiplier', () => {

    each(BITMEX_RAW_SYMBOLS, (rawMarket) => {

      let expectedMultiplier: number | undefined

      const {
        maxPrice,
        isInverse,
        multiplier,
        isQuanto,
      } = rawMarket

      const fixedMultiplier = multiplier.toString().replace(/0+/, '')

      if (isQuanto) {

        expectedMultiplier = (1 / Math.abs(maxPrice)) * Number(fixedMultiplier)

      } else if (!isInverse) {

        expectedMultiplier = 1

      }

      const orderValueMultiplier = computeOrderValueMultiplier({
        rawMarket,
      })

      expect(orderValueMultiplier).to.be.eq(expectedMultiplier)

    })

  })

  it('should properly resolve instrument symbols ids', () => {

    each(BITMEX_RAW_SYMBOLS, (rawMarket) => {

      const {
        isQuanto,
        isInverse,
        settlCurrency,
        quoteCurrency,
        positionCurrency,
      } = rawMarket

      let expectedAmountSymbolId: string

      if (isQuanto) {

        expectedAmountSymbolId = 'Cont'

      } else if (isInverse) {

        expectedAmountSymbolId = quoteCurrency

      } else {

        expectedAmountSymbolId = positionCurrency

      }

      const expectedRateSymbolId = quoteCurrency

      const expectedTotalSymbolId = settlCurrency.toUpperCase()

      const {
        amountSymbolId,
        rateSymbolId,
        totalSymbolId,
      } = resolveSymbolsIds({
        rawMarket,
      })


      expect(amountSymbolId).to.be.eq(expectedAmountSymbolId)
      expect(rateSymbolId).to.be.eq(expectedRateSymbolId)
      expect(totalSymbolId).to.be.eq(expectedTotalSymbolId)

    })

  })

})
