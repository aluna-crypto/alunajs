import { expect } from 'chai'
import { cloneDeep } from 'lodash'

import { IAlunaInstrumentSchema } from '../../../../../../lib/schemas/IAlunaInstrumentSchema'
import { BITMEX_RAW_POSITIONS } from '../../../../test/fixtures/bitmexPositions'
import { assembleUIPositionCustomDisplay } from './assembleUIPositionCustomDisplay'



describe(__filename, () => {


  it("should properly assemble 'uiCustomDisplay' [INVERSE INSTRUMENT]", () => {

    const amount = 90
    const total = 240
    const pl = 0.9435

    const bitmexPosition = cloneDeep(BITMEX_RAW_POSITIONS[0])
    bitmexPosition.homeNotional = 10
    bitmexPosition.underlying = 'USDT'
    bitmexPosition.quoteCurrency = 'USD'
    bitmexPosition.avgCostPrice = 100

    const instrument = {
      isInverse: true,
      totalSymbolId: 'XBT',
      isTradedByUnitsOfContract: false,
      amountSymbolId: 'ADA',
    } as IAlunaInstrumentSchema

    const { uiCustomDisplay } = assembleUIPositionCustomDisplay({
      instrument,
      bitmexPosition,
      amount,
      total,
      pl,
    })

    const expectedAmountSymbol = instrument.amountSymbolId
    const expectedAmountValue = total

    expect(uiCustomDisplay.amount.symbolId).to.be.eq(expectedAmountSymbol)
    expect(uiCustomDisplay.amount.value).to.be.eq(expectedAmountValue)

    const expectedRateSymbol = bitmexPosition.quoteCurrency
    const expectedRateValue = bitmexPosition.avgCostPrice

    expect(uiCustomDisplay.rate.symbolId).to.be.eq(expectedRateSymbol)
    expect(uiCustomDisplay.rate.value).to.be.eq(expectedRateValue)

    const expectedTotalSymbol = instrument.totalSymbolId
    const expectedTotalValue = amount

    expect(uiCustomDisplay.total.symbolId).to.be.eq(expectedTotalSymbol)
    expect(uiCustomDisplay.total.value).to.be.eq(expectedTotalValue)

    const expectedPlSymbol = instrument.totalSymbolId
    const expectedPlValue = pl

    expect(uiCustomDisplay.pnl.symbolId).to.be.eq(expectedPlSymbol)
    expect(uiCustomDisplay.pnl.value).to.be.eq(expectedPlValue)

  })

  it("should properly assemble 'uiCustomDisplay' [QUANTO INSTRUMENT]", () => {

    const amount = 90
    const total = 240
    const pl = 0.9435

    const bitmexPosition = cloneDeep(BITMEX_RAW_POSITIONS[0])
    bitmexPosition.homeNotional = -10
    bitmexPosition.underlying = 'XBT'
    bitmexPosition.quoteCurrency = 'USD'
    bitmexPosition.avgCostPrice = 100


    const instrument = {
      isInverse: false,
      totalSymbolId: 'USDT',
      isTradedByUnitsOfContract: true,
      amountSymbolId: 'LTC',
    } as IAlunaInstrumentSchema

    const { uiCustomDisplay } = assembleUIPositionCustomDisplay({
      instrument,
      bitmexPosition,
      amount,
      total,
      pl,
    })

    const expectedAmountSymbol = 'Cont'
    const expectedAmountValue = amount

    expect(uiCustomDisplay.amount.symbolId).to.be.eq(expectedAmountSymbol)
    expect(uiCustomDisplay.amount.value).to.be.eq(expectedAmountValue)

    const expectedRateSymbol = bitmexPosition.quoteCurrency
    const expectedRateValue = bitmexPosition.avgCostPrice

    expect(uiCustomDisplay.rate.symbolId).to.be.eq(expectedRateSymbol)
    expect(uiCustomDisplay.rate.value).to.be.eq(expectedRateValue)

    const expectedTotalSymbol = bitmexPosition.underlying
    const expectedTotalValue = bitmexPosition.homeNotional

    expect(uiCustomDisplay.total.symbolId).to.be.eq(expectedTotalSymbol)
    expect(uiCustomDisplay.total.value).to.be.eq(expectedTotalValue)

    const expectedPlSymbol = instrument.totalSymbolId
    const expectedPlValue = pl

    expect(uiCustomDisplay.pnl.symbolId).to.be.eq(expectedPlSymbol)
    expect(uiCustomDisplay.pnl.value).to.be.eq(expectedPlValue)

  })

  it(
    "should properly assemble 'uiCustomDisplay'[NOR QUANTO/INVERSE INSTRUMENT]",
    () => {

      const amount = 934
      const total = 424
      const pl = 0.232

      const bitmexPosition = cloneDeep(BITMEX_RAW_POSITIONS[0])
      bitmexPosition.homeNotional = 10
      bitmexPosition.underlying = 'USDT'
      bitmexPosition.quoteCurrency = 'XBT'
      bitmexPosition.avgCostPrice = 32

      const instrument = {
        isInverse: false,
        totalSymbolId: 'USD',
        isTradedByUnitsOfContract: false,
        amountSymbolId: 'ETH',
      } as IAlunaInstrumentSchema

      const { uiCustomDisplay } = assembleUIPositionCustomDisplay({
        instrument,
        bitmexPosition,
        amount,
        total,
        pl,
      })

      const expectedAmountSymbol = instrument.amountSymbolId
      const expectedAmountValue = amount

      expect(uiCustomDisplay.amount.symbolId).to.be.eq(expectedAmountSymbol)
      expect(uiCustomDisplay.amount.value).to.be.eq(expectedAmountValue)

      const expectedRateSymbol = instrument.totalSymbolId
      const expectedRateValue = bitmexPosition.avgCostPrice

      expect(uiCustomDisplay.rate.symbolId).to.be.eq(expectedRateSymbol)
      expect(uiCustomDisplay.rate.value).to.be.eq(expectedRateValue)

      const expectedTotalSymbol = instrument.amountSymbolId
      const expectedTotalValue = amount

      expect(uiCustomDisplay.total.symbolId).to.be.eq(expectedTotalSymbol)
      expect(uiCustomDisplay.total.value).to.be.eq(expectedTotalValue)

      const expectedPlSymbol = instrument.totalSymbolId
      const expectedPlValue = pl

      expect(uiCustomDisplay.pnl.symbolId).to.be.eq(expectedPlSymbol)
      expect(uiCustomDisplay.pnl.value).to.be.eq(expectedPlValue)

    },
  )

})
