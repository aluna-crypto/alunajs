import BigNumber from 'bignumber.js'
import { expect } from 'chai'
import { each } from 'lodash'
import { ImportMock } from 'ts-mock-imports'

import { AlunaAccountEnum } from '../../../../lib/enums/AlunaAccountEnum'
import { AlunaPositionStatusEnum } from '../../../../lib/enums/AlunaPositionStatusEnum'
import { AlunaSideEnum } from '../../../../lib/enums/AlunaSideEnum'
import { IAlunaInstrumentSchema } from '../../../../lib/schemas/IAlunaInstrumentSchema'
import { IAlunaUICustomDisplaySchema } from '../../../../lib/schemas/IAlunaUICustomDisplaySchema'
import { BitmexSettlementCurrencyEnum } from '../../enums/BitmexSettlementCurrencyEnum'
import { BITMEX_RAW_POSITIONS } from '../../test/bitmexPositions'
import { IBitmexPositionSchema } from '../IBitmexPositionSchema'
import { BitmexOrderParser } from './BitmexOrderParser'
import { BitmexPositionParser } from './BitmexPositionParser'



describe('BitmexPositionParser', () => {


  const {
    parse,
    assembleUiCustomDisplay,
  } = BitmexPositionParser

  it('should properly parse Bitmex positions', () => {

    const expectedUICustonDisplay = {} as IAlunaUICustomDisplaySchema
    const expectedBaseSymbolId = 'XBT'
    const expectedQuoteSymbolId = 'USD'
    const computedAmount = 10
    const computedTotal = 20

    const mockedDate = Date.now()

    ImportMock.mockFunction(
      global.Date,
      'now',
      mockedDate,
    )

    const assembleUiCustomDisplayMock = ImportMock.mockFunction(
      BitmexPositionParser,
      'assembleUiCustomDisplay',
      expectedUICustonDisplay,
    )

    const computeOrderAmountMock = ImportMock.mockFunction(
      BitmexOrderParser,
      'computeOrderAmount',
      computedAmount,
    )

    const computeOrderTotalMock = ImportMock.mockFunction(
      BitmexOrderParser,
      'computeOrderTotal',
      computedTotal,
    )

    each(BITMEX_RAW_POSITIONS, (rawPosition, index) => {

      const {
        currency,
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

      const mockedInstrument = {
        totalSymbolId: currency,
      } as IAlunaInstrumentSchema

      const {
        totalSymbolId,
      } = mockedInstrument

      const expectedOpenedAt = new Date(openingTimestamp)

      let expectedStatus: AlunaPositionStatusEnum
      let expectedClosedAt: Date | undefined
      let expectedClosePrice: number | undefined

      if (isOpen) {

        expectedStatus = AlunaPositionStatusEnum.OPEN

      } else {

        expectedClosedAt = new Date()

        expectedStatus = AlunaPositionStatusEnum.CLOSED

        expectedClosePrice = prevClosePrice

      }

      const expectedBasePrice = avgCostPrice
      const expectedOpenPrice = avgEntryPrice

      const bigNumber = new BigNumber(unrealisedPnl)
      const expectedPl = totalSymbolId === BitmexSettlementCurrencyEnum.BTC
        ? bigNumber.times(10 ** -8).toNumber()
        : bigNumber.times(10 ** -6).toNumber()

      const expectedPlPercentage = unrealisedRoePcnt

      const expectedSide = homeNotional > 0
        ? AlunaSideEnum.LONG
        : AlunaSideEnum.SHORT

      const expectedLeverage = crossMargin
        ? undefined
        : leverage

      const expectedCrossMargin = !!crossMargin

      const parsedPosition = parse({
        instrument: mockedInstrument,
        baseSymbolId: expectedBaseSymbolId,
        quoteSymbolId: expectedQuoteSymbolId,
        rawPosition,
      })

      expect(parsedPosition.symbolPair).to.be.eq(symbol)
      expect(parsedPosition.baseSymbolId).to.be.eq(expectedBaseSymbolId)
      expect(parsedPosition.quoteSymbolId).to.be.eq(expectedQuoteSymbolId)
      expect(parsedPosition.account).to.be.eq(AlunaAccountEnum.DERIVATIVES)
      expect(parsedPosition.amount).to.be.eq(computedAmount)
      expect(parsedPosition.total).to.be.eq(computedTotal)
      expect(parsedPosition.openPrice).to.be.eq(expectedOpenPrice)
      expect(parsedPosition.basePrice).to.be.eq(expectedBasePrice)
      expect(parsedPosition.pl).to.be.eq(expectedPl)
      expect(parsedPosition.plPercentage).to.be.eq(expectedPlPercentage)
      expect(parsedPosition.status).to.be.eq(expectedStatus)
      expect(parsedPosition.side).to.be.eq(expectedSide)
      expect(parsedPosition.liquidationPrice).to.be.eq(liquidationPrice)
      expect(parsedPosition.openedAt).to.deep.eq(expectedOpenedAt)
      expect(parsedPosition.closedAt).to.deep.eq(expectedClosedAt)
      expect(parsedPosition.closePrice).to.deep.eq(expectedClosePrice)
      expect(parsedPosition.leverage).to.deep.eq(expectedLeverage)
      expect(parsedPosition.crossMargin).to.deep.eq(expectedCrossMargin)
      expect(parsedPosition.uiCustomDisplay).to.deep.eq(expectedUICustonDisplay)
      expect(parsedPosition.meta).to.deep.eq(rawPosition)

      expect(assembleUiCustomDisplayMock.callCount).to.be.eq(index + 1)
      expect(assembleUiCustomDisplayMock.args[index][0]).to.deep.eq({
        computedAmount,
        computedTotal,
        instrument: mockedInstrument,
        computedPl: expectedPl,
        rawPosition,
      })

      expect(computeOrderAmountMock.callCount).to.be.eq(index + 1)
      expect(computeOrderAmountMock.args[index][0]).to.deep.eq({
        orderQty: Math.abs(currentQty),
        instrument: mockedInstrument,
        computedPrice: avgCostPrice,
      })

      expect(computeOrderTotalMock.callCount).to.be.eq(index + 1)
      expect(computeOrderTotalMock.args[index][0]).to.deep.eq({
        instrument: mockedInstrument,
        computedPrice: avgCostPrice,
        computedAmount,
      })

    })

  })

  it("should properly assemble 'uiCustomDisplay' [INVERSE INSTRUMENT]", () => {

    const computedAmount = 90
    const computedTotal = 240
    const computedPl = 0.9435

    const rawPosition = {
      homeNotional: 10,
      underlying: 'USDT',
      quoteCurrency: 'USD',
      avgCostPrice: 100,
    } as IBitmexPositionSchema

    const instrument = {
      isInverse: true,
      totalSymbolId: 'XBT',
      isTradedByUnitsOfContract: false,
      amountSymbolId: 'ADA',
    } as IAlunaInstrumentSchema

    const uiCustomDisplay = assembleUiCustomDisplay({
      instrument,
      rawPosition,
      computedAmount,
      computedTotal,
      computedPl,
    })

    const expectedAmountSymbol = instrument.amountSymbolId
    const expectedAmountValue = computedTotal

    expect(uiCustomDisplay.amount.symbolId).to.be.eq(expectedAmountSymbol)
    expect(uiCustomDisplay.amount.value).to.be.eq(expectedAmountValue)

    const expectedRateSymbol = rawPosition.quoteCurrency
    const expectedRateValue = rawPosition.avgCostPrice

    expect(uiCustomDisplay.rate.symbolId).to.be.eq(expectedRateSymbol)
    expect(uiCustomDisplay.rate.value).to.be.eq(expectedRateValue)

    const expectedTotalSymbol = instrument.totalSymbolId
    const expectedTotalValue = computedAmount

    expect(uiCustomDisplay.total.symbolId).to.be.eq(expectedTotalSymbol)
    expect(uiCustomDisplay.total.value).to.be.eq(expectedTotalValue)

    const expectedPlSymbol = instrument.totalSymbolId
    const expectedPlValue = computedPl

    expect(uiCustomDisplay.pnl.symbolId).to.be.eq(expectedPlSymbol)
    expect(uiCustomDisplay.pnl.value).to.be.eq(expectedPlValue)

  })

  it("should properly assemble 'uiCustomDisplay' [QUANTO INSTRUMENT]", () => {

    const computedAmount = 90
    const computedTotal = 240
    const computedPl = 0.9435

    const rawPosition = {
      homeNotional: -10,
      underlying: 'XBT',
      quoteCurrency: 'USD',
      avgCostPrice: 100,
    } as IBitmexPositionSchema

    const instrument = {
      isInverse: false,
      totalSymbolId: 'USDT',
      isTradedByUnitsOfContract: true,
      amountSymbolId: 'LTC',
    } as IAlunaInstrumentSchema

    const uiCustomDisplay = assembleUiCustomDisplay({
      instrument,
      rawPosition,
      computedAmount,
      computedTotal,
      computedPl,
    })

    const expectedAmountSymbol = 'Cont'
    const expectedAmountValue = computedAmount

    expect(uiCustomDisplay.amount.symbolId).to.be.eq(expectedAmountSymbol)
    expect(uiCustomDisplay.amount.value).to.be.eq(expectedAmountValue)

    const expectedRateSymbol = rawPosition.quoteCurrency
    const expectedRateValue = rawPosition.avgCostPrice

    expect(uiCustomDisplay.rate.symbolId).to.be.eq(expectedRateSymbol)
    expect(uiCustomDisplay.rate.value).to.be.eq(expectedRateValue)

    const expectedTotalSymbol = rawPosition.underlying
    const expectedTotalValue = rawPosition.homeNotional

    expect(uiCustomDisplay.total.symbolId).to.be.eq(expectedTotalSymbol)
    expect(uiCustomDisplay.total.value).to.be.eq(expectedTotalValue)

    const expectedPlSymbol = instrument.totalSymbolId
    const expectedPlValue = computedPl

    expect(uiCustomDisplay.pnl.symbolId).to.be.eq(expectedPlSymbol)
    expect(uiCustomDisplay.pnl.value).to.be.eq(expectedPlValue)

  })

  it(
    "should properly assemble 'uiCustomDisplay'[NOR QUANTO/INVERSE INSTRUMENT]",
    () => {

      const computedAmount = 934
      const computedTotal = 424
      const computedPl = 0.232

      const rawPosition = {
        homeNotional: 10,
        underlying: 'USDT',
        quoteCurrency: 'XBT',
        avgCostPrice: 32,
      } as IBitmexPositionSchema

      const instrument = {
        isInverse: false,
        totalSymbolId: 'USD',
        isTradedByUnitsOfContract: false,
        amountSymbolId: 'ETH',
      } as IAlunaInstrumentSchema

      const uiCustomDisplay = assembleUiCustomDisplay({
        instrument,
        rawPosition,
        computedAmount,
        computedTotal,
        computedPl,
      })

      const expectedAmountSymbol = instrument.amountSymbolId
      const expectedAmountValue = computedAmount

      expect(uiCustomDisplay.amount.symbolId).to.be.eq(expectedAmountSymbol)
      expect(uiCustomDisplay.amount.value).to.be.eq(expectedAmountValue)

      const expectedRateSymbol = instrument.totalSymbolId
      const expectedRateValue = rawPosition.avgCostPrice

      expect(uiCustomDisplay.rate.symbolId).to.be.eq(expectedRateSymbol)
      expect(uiCustomDisplay.rate.value).to.be.eq(expectedRateValue)

      const expectedTotalSymbol = instrument.amountSymbolId
      const expectedTotalValue = computedAmount

      expect(uiCustomDisplay.total.symbolId).to.be.eq(expectedTotalSymbol)
      expect(uiCustomDisplay.total.value).to.be.eq(expectedTotalValue)

      const expectedPlSymbol = instrument.totalSymbolId
      const expectedPlValue = computedPl

      expect(uiCustomDisplay.pnl.symbolId).to.be.eq(expectedPlSymbol)
      expect(uiCustomDisplay.pnl.value).to.be.eq(expectedPlValue)

    },
  )

})
