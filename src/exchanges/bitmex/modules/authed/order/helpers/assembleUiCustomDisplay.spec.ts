import BigNumber from 'bignumber.js'
import { expect } from 'chai'

import { IAlunaInstrumentSchema } from '../../../../../../lib/schemas/IAlunaInstrumentSchema'
import { BitmexOrderTypeEnum } from '../../../../enums/BitmexOrderTypeEnum'
import { IBitmexOrder } from '../../../../schemas/IBitmexOrderSchema'
import { assembleUiCustomDisplay } from './assembleUiCustomDisplay'



describe(__filename, () => {

  it("should properly assemble 'uiCustomDisplay' [INVERSE INSTRUMENT]", () => {

    // preparing data
    const bitmexOrder = {
      ordType: BitmexOrderTypeEnum.LIMIT,
      stopPx: null,
    } as IBitmexOrder

    const instrument = {
      orderValueMultiplier: 2,
      rateSymbolId: 'USD',
      totalSymbolId: 'XBT',
      amountSymbolId: 'USD',
      isInverse: true,
      isTradedByUnitsOfContract: false,
    } as IAlunaInstrumentSchema

    const computedAmount = 0.0033
    const computedTotal = 100
    const computedPrice = 38000


    // executing
    const { uiCustomDisplay } = assembleUiCustomDisplay({
      instrument,
      bitmexOrder,
      computedAmount,
      computedTotal,
      computedPrice,
    })


    // validating
    const expectedAmountSymbol = instrument.amountSymbolId
    const expectedAmountValue = computedTotal

    expect(uiCustomDisplay.amount.symbolId).to.be.eq(expectedAmountSymbol)
    expect(uiCustomDisplay.amount.value).to.be.eq(expectedAmountValue)

    const expectedRateSymbol = instrument.rateSymbolId
    const expectedRateValue = computedPrice

    expect(uiCustomDisplay.rate!.symbolId).to.be.eq(expectedRateSymbol)
    expect(uiCustomDisplay.rate!.value).to.be.eq(expectedRateValue)

    const expectedTotalSymbol = instrument.totalSymbolId
    const expectedTotalValue = computedAmount

    expect(uiCustomDisplay.total.symbolId).to.be.eq(expectedTotalSymbol)
    expect(uiCustomDisplay.total.value).to.be.eq(expectedTotalValue)

  })

  it("should properly assemble 'uiCustomDisplay' [QUANTO INSTRUMENT]", () => {

    // preparing data
    const bitmexOrder = {
      ordType: BitmexOrderTypeEnum.MARKET,
      stopPx: null,
    } as IBitmexOrder

    const instrument = {
      orderValueMultiplier: 2,
      rateSymbolId: 'USD',
      totalSymbolId: 'XBT',
      amountSymbolId: 'Cont',
      isInverse: false,
      isTradedByUnitsOfContract: true,
    } as IAlunaInstrumentSchema

    const computedAmount = 2
    const computedTotal = 3.45
    const computedPrice = 0.867


    // executing
    const { uiCustomDisplay } = assembleUiCustomDisplay({
      instrument,
      bitmexOrder,
      computedAmount,
      computedTotal,
      computedPrice,
    })


    // validating
    const expectedAmountSymbol = instrument.amountSymbolId
    const expectedAmountValue = computedAmount

    expect(uiCustomDisplay.amount.symbolId).to.be.eq(expectedAmountSymbol)
    expect(uiCustomDisplay.amount.value).to.be.eq(expectedAmountValue)

    const expectedRateSymbol = instrument.rateSymbolId
    const expectedRateValue = computedPrice

    expect(uiCustomDisplay.rate!.symbolId).to.be.eq(expectedRateSymbol)
    expect(uiCustomDisplay.rate!.value).to.be.eq(expectedRateValue)

    const expectedTotalSymbol = instrument.totalSymbolId
    const expectedTotalValue = new BigNumber(computedAmount)
      .times(computedPrice)
      .times(instrument.orderValueMultiplier!)
      .toNumber()

    expect(uiCustomDisplay.total.symbolId).to.be.eq(expectedTotalSymbol)
    expect(uiCustomDisplay.total.value).to.be.eq(expectedTotalValue)

  })

  it(
    "should properly assemble 'uiCustomDisplay'[NOR QUANTO/INVERSE INSTRUMENT]",
    () => {

      // preparing data
      const bitmexOrder = {
        ordType: BitmexOrderTypeEnum.STOP_MARKET,
        stopPx: 34000,
      } as IBitmexOrder

      const instrument = {
        orderValueMultiplier: 0.0033,
        rateSymbolId: 'USDT',
        totalSymbolId: 'USDT',
        amountSymbolId: 'XBT',
        isInverse: false,
        isTradedByUnitsOfContract: false,
      } as IAlunaInstrumentSchema

      const computedAmount = 0.0033
      const computedTotal = 100
      const computedPrice = 34000


      // executing
      const { uiCustomDisplay } = assembleUiCustomDisplay({
        instrument,
        bitmexOrder,
        computedAmount,
        computedTotal,
        computedPrice,
      })


      // validating
      const expectedAmountSymbol = instrument.amountSymbolId
      const expectedAmountValue = computedAmount

      expect(uiCustomDisplay.amount.symbolId).to.be.eq(expectedAmountSymbol)
      expect(uiCustomDisplay.amount.value).to.be.eq(expectedAmountValue)

      const expectedRateSymbol = instrument.rateSymbolId
      const expectedRateValue = computedPrice

      expect(uiCustomDisplay.stopRate!.symbolId).to.be.eq(expectedRateSymbol)
      expect(uiCustomDisplay.stopRate!.value).to.be.eq(expectedRateValue)

      const expectedTotalSymbol = instrument.totalSymbolId
      const expectedTotalValue = computedTotal

      expect(uiCustomDisplay.total.symbolId).to.be.eq(expectedTotalSymbol)
      expect(uiCustomDisplay.total.value).to.be.eq(expectedTotalValue)


      // preparing data
      const bitmexOrder2 = {
        ordType: BitmexOrderTypeEnum.STOP_LIMIT,
        stopPx: 21000,
      } as IBitmexOrder

      const instrument2 = {
        orderValueMultiplier: 0.0033,
        rateSymbolId: 'USD',
        totalSymbolId: 'XBT',
        amountSymbolId: 'ETH',
        isInverse: false,
        isTradedByUnitsOfContract: false,
      } as IAlunaInstrumentSchema

      const computedAmount2 = 2
      const computedTotal2 = 2100
      const computedPrice2 = 31000


      // executing
      const { uiCustomDisplay: uiCustomDisplay2 } = assembleUiCustomDisplay({
        bitmexOrder: bitmexOrder2,
        instrument: instrument2,
        computedAmount: computedAmount2,
        computedTotal: computedTotal2,
        computedPrice: computedPrice2,
      })

      const expectedAmountSymbol2 = instrument2.amountSymbolId
      const expectedAmountValue2 = computedAmount2


      // validating
      expect(uiCustomDisplay2.amount.symbolId).to.be.eq(expectedAmountSymbol2)
      expect(uiCustomDisplay2.amount.value).to.be.eq(expectedAmountValue2)

      const expectedRateSymbol2 = instrument2.rateSymbolId
      const expectedRateValue2 = computedPrice2

      expect(uiCustomDisplay2.stopRate!.symbolId).to.be.eq(expectedRateSymbol2)
      expect(uiCustomDisplay2.stopRate!.value).to.be.eq(bitmexOrder2.stopPx)

      expect(uiCustomDisplay2.limitRate!.symbolId).to.be.eq(expectedRateSymbol2)
      expect(uiCustomDisplay2.limitRate!.value).to.be.eq(expectedRateValue2)

      const expectedTotalSymbol2 = instrument2.totalSymbolId
      const expectedTotalValue2 = computedTotal2

      expect(uiCustomDisplay2.total.symbolId).to.be.eq(expectedTotalSymbol2)
      expect(uiCustomDisplay2.total.value).to.be.eq(expectedTotalValue2)

    },
  )

})
