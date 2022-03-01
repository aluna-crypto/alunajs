import BigNumber from 'bignumber.js'
import { expect } from 'chai'
import { each } from 'lodash'
import { ImportMock } from 'ts-mock-imports'

import { AlunaAccountEnum } from '../../../../lib/enums/AlunaAccountEnum'
import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { AlunaOrderTypesEnum } from '../../../../lib/enums/AlunaOrderTypesEnum'
import { IAlunaInstrumentSchema } from '../../../../lib/schemas/IAlunaInstrumentSchema'
import { IAlunaUICustomDisplaySchema } from '../../../../lib/schemas/IAlunaUICustomDisplaySchema'
import { BitmexOrderTypeAdapter } from '../../enums/adapters/BitmexOrderTypeAdapter'
import { BitmexSideAdapter } from '../../enums/adapters/BitmexSideAdapter'
import { BitmexStatusAdapter } from '../../enums/adapters/BitmexStatusAdapter'
import { BitmexOrderTypeEnum } from '../../enums/BitmexOrderTypeEnum'
import { BITMEX_RAW_ORDERS } from '../../test/bitmexOrders'
import { IBitmexOrderSchema } from '../IBitmexOrderSchema'
import { BitmexOrderParser } from './BitmexOrderParser'



describe('BitmexOrderParser', () => {

  const {
    parse,
    computeOrderAmount,
    computeOrderTotal,
    assembleUiCustomDisplay,
    translateAmountToOrderQty,
  } = BitmexOrderParser

  it('should properly parse Bitmex orders', () => {

    const expectedUICustonDisplay = {} as IAlunaUICustomDisplaySchema
    const expectedBaseSymbolId = 'XBT'
    const expectedQuoteSymbolId = 'USD'
    const computedAmount = 10
    const computedTotal = 20

    const mockedDate = Date.now()
    const mockedInstrument = {} as IAlunaInstrumentSchema

    ImportMock.mockFunction(
      global.Date,
      'now',
      mockedDate,
    )

    const assembleUiCustomDisplayMock = ImportMock.mockFunction(
      BitmexOrderParser,
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

    each(BITMEX_RAW_ORDERS, (rawOrder, index) => {

      const {
        ordStatus,
        side,
        ordType,
        stopPx,
        price,
        transactTime,
        timestamp,
      } = rawOrder

      const expectedComputedStatus = BitmexStatusAdapter.translateToAluna({
        from: ordStatus,
      })

      const expectedComputedSide = BitmexSideAdapter.translateToAluna({
        from: side,
      })

      const expectedComputedType = BitmexOrderTypeAdapter.translateToAluna({
        from: ordType,
      })

      let expectedRate: number | undefined
      let expectedStopRate: number | undefined
      let expectedLimitRate: number | undefined

      let expectedComputedPrice: number

      switch (expectedComputedType) {

        case AlunaOrderTypesEnum.STOP_MARKET:
          expectedStopRate = stopPx!
          expectedComputedPrice = stopPx!
          break

        case AlunaOrderTypesEnum.STOP_LIMIT:
          expectedStopRate = stopPx!
          expectedLimitRate = price!
          expectedComputedPrice = expectedLimitRate
          break

        // 'Limit' and 'Market'
        default:
          expectedRate = price!
          expectedComputedPrice = expectedRate

      }

      const expectedPlacedAt = new Date(transactTime)
      const expectedComputedTimeStamp = new Date(timestamp)

      let expectedFilledAt: Date | undefined
      let expectedCanceledAt: Date | undefined

      if (expectedComputedStatus === AlunaOrderStatusEnum.FILLED) {

        expectedFilledAt = expectedComputedTimeStamp

      } else if (expectedComputedStatus === AlunaOrderStatusEnum.CANCELED) {

        expectedCanceledAt = expectedComputedTimeStamp

      }

      const parsedOrder = parse({
        instrument: mockedInstrument,
        baseSymbolId: expectedBaseSymbolId,
        quoteSymbolId: expectedQuoteSymbolId,
        rawOrder,
      })

      expect(parsedOrder.id).to.be.eq(rawOrder.orderID)
      expect(parsedOrder.symbolPair).to.be.eq(rawOrder.symbol)
      expect(parsedOrder.baseSymbolId).to.be.eq(expectedBaseSymbolId)
      expect(parsedOrder.quoteSymbolId).to.be.eq(expectedQuoteSymbolId)
      expect(parsedOrder.account).to.be.eq(AlunaAccountEnum.DERIVATIVES)
      expect(parsedOrder.amount).to.be.eq(computedAmount)
      expect(parsedOrder.total).to.be.eq(computedTotal)
      expect(parsedOrder.rate).to.be.eq(expectedRate)
      expect(parsedOrder.stopRate).to.be.eq(expectedStopRate)
      expect(parsedOrder.limitRate).to.be.eq(expectedLimitRate)
      expect(parsedOrder.status).to.be.eq(expectedComputedStatus)
      expect(parsedOrder.side).to.be.eq(expectedComputedSide)
      expect(parsedOrder.type).to.be.eq(expectedComputedType)
      expect(parsedOrder.placedAt).to.deep.eq(expectedPlacedAt)
      expect(parsedOrder.filledAt).to.deep.eq(expectedFilledAt)
      expect(parsedOrder.canceledAt).to.deep.eq(expectedCanceledAt)
      expect(parsedOrder.uiCustomDisplay).to.deep.eq(expectedUICustonDisplay)
      expect(parsedOrder.meta).to.deep.eq(rawOrder)

      expect(assembleUiCustomDisplayMock.callCount).to.be.eq(index + 1)
      expect(assembleUiCustomDisplayMock.args[index][0]).to.deep.eq({
        instrument: mockedInstrument,
        rawOrder,
        computedAmount,
        computedPrice: expectedComputedPrice,
        computedTotal,
      })


      expect(computeOrderAmountMock.callCount).to.be.eq(index + 1)
      expect(computeOrderAmountMock.args[index][0]).to.deep.eq({
        orderQty: rawOrder.orderQty,
        instrument: mockedInstrument,
        computedPrice: expectedComputedPrice,
      })

      expect(computeOrderTotalMock.callCount).to.be.eq(index + 1)
      expect(computeOrderTotalMock.args[index][0]).to.deep.eq({
        instrument: mockedInstrument,
        computedPrice: expectedComputedPrice,
        computedAmount,
      })

    })

  })

  it("should properly compute order 'amount' [INVERSE INSTRUMENT]", () => {

    const orderQty = 100

    const computedPrice = 32000

    const instrument = {
      isInverse: true,
      isTradedByUnitsOfContract: false,
      contractValue: 0.0898,
    } as IAlunaInstrumentSchema


    const expectedAmount = new BigNumber(orderQty)
      .div(computedPrice)
      .toNumber()

    const computedAmount = computeOrderAmount({
      computedPrice,
      instrument,
      orderQty,
    })

    expect(computedAmount).to.be.eq(expectedAmount)

  })

  it("should properly compute order 'amount' [QUANTO INSTRUMENT]", () => {

    const orderQty = 5

    const computedPrice = 32000

    const instrument = {
      isInverse: false,
      isTradedByUnitsOfContract: true,
      contractValue: 0.0898,
    } as IAlunaInstrumentSchema


    const expectedAmount = orderQty

    const computedAmount = computeOrderAmount({
      computedPrice,
      instrument,
      orderQty,
    })

    expect(computedAmount).to.be.eq(expectedAmount)

  })

  it(
    "should properly compute order 'amount' [NOR QUANTO/INVERSE INSTRUMENT]",
    () => {

      const orderQty = 0.05

      const computedPrice = 32000

      const instrument = {
        isInverse: false,
        isTradedByUnitsOfContract: false,
        contractValue: 0.0898,
      } as IAlunaInstrumentSchema


      const expectedAmount = new BigNumber(orderQty)
        .times(instrument.contractValue)
        .toNumber()


      const computedAmount = computeOrderAmount({
        computedPrice,
        instrument,
        orderQty,
      })

      expect(computedAmount).to.be.eq(expectedAmount)

    },
  )

  it("should properly compute order 'total' [INVERSE INSTRUMENT]", () => {

    const computedPrice = 32000
    const computedAmount = 10

    const instrument = {
      isInverse: true,
      isTradedByUnitsOfContract: false,
      usdPricePerUnit: 20,
      price: 200,
    } as IAlunaInstrumentSchema


    const expectedTotal = computedAmount

    const computedTotal = computeOrderTotal({
      computedPrice,
      computedAmount,
      instrument,
    })

    expect(computedTotal).to.be.eq(expectedTotal)

  })

  it("should properly compute order 'total' [QUANTO INSTRUMENT]", () => {

    const computedPrice = 200
    const computedAmount = 290

    const instrument = {
      isInverse: false,
      isTradedByUnitsOfContract: true,
      usdPricePerUnit: 10,
      price: 50,
    } as IAlunaInstrumentSchema

    const priceRatio = new BigNumber(computedPrice)
      .div(instrument.price)
      .toNumber()

    const pricePerContract = new BigNumber(priceRatio)
      .times(instrument.usdPricePerUnit!)
      .toNumber()

    const expectedTotal = new BigNumber(computedAmount)
      .times(pricePerContract)
      .toNumber()

    const computedTotal = computeOrderTotal({
      computedPrice,
      computedAmount,
      instrument,
    })

    expect(computedTotal).to.be.eq(expectedTotal)

  })

  it(
    "should properly compute order 'total' [NOR QUANTO/INVERSE INSTRUMENT]",
    () => {

      const computedPrice = 200
      const computedAmount = 290

      const instrument = {
        isInverse: false,
        isTradedByUnitsOfContract: false,
        usdPricePerUnit: 10,
        price: 50,
      } as IAlunaInstrumentSchema

      const expectedTotal = new BigNumber(computedAmount)
        .times(computedPrice)
        .toNumber()

      const computedTotal = computeOrderTotal({
        computedPrice,
        computedAmount,
        instrument,
      })

      expect(computedTotal).to.be.eq(expectedTotal)

    },
  )

  it(
    "should properly translate amount to 'orderQty' [INVERSE INSTRUMENT]",
    () => {

      const amount = 300

      const instrument = {
        isInverse: true,
        contractValue: 10,
        isTradedByUnitsOfContract: false,
      } as IAlunaInstrumentSchema

      const expectedOrderQty = amount

      const orderQty = translateAmountToOrderQty({
        amount,
        instrument,
      })

      expect(orderQty).to.be.eq(expectedOrderQty)

    },
  )

  it(
    "should properly translate amount to 'orderQty' [QUANTO INSTRUMENT]",
    () => {

      const amount = 0.04

      const instrument = {
        isInverse: false,
        contractValue: 10,
        isTradedByUnitsOfContract: true,
      } as IAlunaInstrumentSchema

      const expectedOrderQty = amount

      const orderQty = translateAmountToOrderQty({
        amount,
        instrument,
      })

      expect(orderQty).to.be.eq(expectedOrderQty)

    },
  )

  it(
    "should translate amount to 'orderQty' [NOR QUANTO/INVERSE INSTRUMENT]",
    () => {

      const amount = 0.04

      const instrument = {
        isInverse: false,
        contractValue: 10,
        isTradedByUnitsOfContract: false,
      } as IAlunaInstrumentSchema

      const expectedOrderQty = new BigNumber(amount)
        .div(instrument.contractValue)
        .toNumber()

      const orderQty = translateAmountToOrderQty({
        amount,
        instrument,
      })

      expect(orderQty).to.be.eq(expectedOrderQty)

    },
  )

  it("should properly assemble 'uiCustomDisplay' [INVERSE INSTRUMENT]", () => {

    const rawOrder = {
      ordType: BitmexOrderTypeEnum.LIMIT,
      stopPx: null,
    } as IBitmexOrderSchema

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

    const uiCustomDisplay = assembleUiCustomDisplay({
      instrument,
      rawOrder,
      computedAmount,
      computedTotal,
      computedPrice,
    })

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

    const rawOrder = {
      ordType: BitmexOrderTypeEnum.MARKET,
      stopPx: null,
    } as IBitmexOrderSchema

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

    const uiCustomDisplay = assembleUiCustomDisplay({
      instrument,
      rawOrder,
      computedAmount,
      computedTotal,
      computedPrice,
    })

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

      const rawOrder = {
        ordType: BitmexOrderTypeEnum.STOP_MARKET,
        stopPx: 34000,
      } as IBitmexOrderSchema

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

      const uiCustomDisplay = assembleUiCustomDisplay({
        instrument,
        rawOrder,
        computedAmount,
        computedTotal,
        computedPrice,
      })

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


      const rawOrder2 = {
        ordType: BitmexOrderTypeEnum.STOP_LIMIT,
        stopPx: 21000,
      } as IBitmexOrderSchema

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

      const uiCustomDisplay2 = assembleUiCustomDisplay({
        rawOrder: rawOrder2,
        instrument: instrument2,
        computedAmount: computedAmount2,
        computedTotal: computedTotal2,
        computedPrice: computedPrice2,
      })

      const expectedAmountSymbol2 = instrument2.amountSymbolId
      const expectedAmountValue2 = computedAmount2

      expect(uiCustomDisplay2.amount.symbolId).to.be.eq(expectedAmountSymbol2)
      expect(uiCustomDisplay2.amount.value).to.be.eq(expectedAmountValue2)

      const expectedRateSymbol2 = instrument2.rateSymbolId
      const expectedRateValue2 = computedPrice2

      expect(uiCustomDisplay2.stopRate!.symbolId).to.be.eq(expectedRateSymbol2)
      expect(uiCustomDisplay2.stopRate!.value).to.be.eq(rawOrder2.stopPx)

      expect(uiCustomDisplay2.limitRate!.symbolId).to.be.eq(expectedRateSymbol2)
      expect(uiCustomDisplay2.limitRate!.value).to.be.eq(expectedRateValue2)

      const expectedTotalSymbol2 = instrument2.totalSymbolId
      const expectedTotalValue2 = computedTotal2

      expect(uiCustomDisplay2.total.symbolId).to.be.eq(expectedTotalSymbol2)
      expect(uiCustomDisplay2.total.value).to.be.eq(expectedTotalValue2)

    },
  )

})
