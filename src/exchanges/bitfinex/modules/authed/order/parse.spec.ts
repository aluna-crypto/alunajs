import { expect } from 'chai'
import { cloneDeep } from 'lodash'

import { AlunaOrderSideEnum } from '../../../../../lib/enums/AlunaOrderSideEnum'
import { AlunaOrderStatusEnum } from '../../../../../lib/enums/AlunaOrderStatusEnum'
import { AlunaOrderTypesEnum } from '../../../../../lib/enums/AlunaOrderTypesEnum'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { BitfinexAuthed } from '../../../BitfinexAuthed'
import { bitfinexBaseSpecs } from '../../../bitfinexSpecs'
import { translateAccountToAluna } from '../../../enums/adapters/bitfinexAccountsAdapter'
import { translateOrderStatusToAluna } from '../../../enums/adapters/bitfinexOrderStatusAdapter'
import { translateOrderTypeToAluna } from '../../../enums/adapters/bitfinexOrderTypeAdapter'
import { BitfinexOrderTypeEnum } from '../../../enums/BitfinexOrderTypeEnum'
import { IBitfinexOrderSchema } from '../../../schemas/IBitfinexOrderSchema'
import { BITFINEX_RAW_ORDERS } from '../../../test/fixtures/bitfinexOrders'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  const runTest = (params: {
    rawOrder: IBitfinexOrderSchema
  }) => {

    const { rawOrder } = params


    // executing
    const exchange = new BitfinexAuthed({ credentials })

    const { order } = exchange.order.parse({
      rawOrder,
    })


    // validating
    const {
      expectedId: id,
      expectedRate,
      expectedStopRate,
      expectedLimitRate,
      expectedStatus,
      expectedAccount,
      expectedType,
      expectedSide,
      expectedFilledAt,
      expectedCanceledAt,
      expectedComputedPrice,
      expectedBaseSymbolId,
      expectedQuoteSymbolId,
      expectedAmount,
      expectedPlacedAt,
      expectedSymbolPair,
    } = getParsedOrderExpectedValues({ rawOrder })


    expect(order.id).to.be.eq(id)
    expect(order.symbolPair).to.be.eq(expectedSymbolPair)

    expect(order.exchangeId).to.be.eq(bitfinexBaseSpecs.id)
    expect(order.baseSymbolId).to.be.eq(expectedBaseSymbolId)
    expect(order.quoteSymbolId).to.be.eq(expectedQuoteSymbolId)

    expect(order.amount).to.be.eq(Math.abs(expectedAmount))
    expect(order.total).to.be.eq(expectedComputedPrice * order.amount)
    expect(order.uiCustomDisplay).not.to.be.ok

    expect(order.rate).to.be.eq(expectedRate)
    expect(order.limitRate).to.be.eq(expectedLimitRate)
    expect(order.stopRate).to.be.eq(expectedStopRate)

    expect(order.account).to.be.eq(expectedAccount)
    expect(order.side).to.be.eq(expectedSide)
    expect(order.status).to.be.eq(expectedStatus)
    expect(order.type).to.be.eq(expectedType)

    expect(order.placedAt).to.deep.eq(new Date(expectedPlacedAt))
    expect(order.filledAt).to.deep.eq(expectedFilledAt)
    expect(order.canceledAt).to.deep.eq(expectedCanceledAt)

    expect(order.meta).to.be.eq(rawOrder)

  }



  const getParsedOrderExpectedValues = (params: {
    rawOrder: IBitfinexOrderSchema
  }) => {

    const { rawOrder } = params

    const [
      id,
      _gid,
      _cid,
      symbolPair,
      mtsCreate,
      mtsUpdate,
      _amount,
      amountOrig,
      orderType,
      _typePrev,
      _placeholder1,
      _placeholder2,
      _flags,
      orderStatus,
      _placeholder3,
      _placeholder4,
      price,
      priceAvg,
      _priceTrailing,
      priceAuxLimit,
    ] = rawOrder

    let expectedBaseSymbolId: string
    let expectedQuoteSymbolId: string

    const spliter = symbolPair.indexOf(':')

    if (spliter >= 0) {

      expectedBaseSymbolId = symbolPair.slice(1, spliter)
      expectedQuoteSymbolId = symbolPair.slice(spliter + 1)

    } else {

      expectedBaseSymbolId = symbolPair.slice(1, 4)
      expectedQuoteSymbolId = symbolPair.slice(4)

    }

    let expectedRate
    let expectedStopRate
    let expectedLimitRate


    const expectedStatus = translateOrderStatusToAluna({
      from: orderStatus,
    })

    const expectedAccount = translateAccountToAluna({
      value: orderType,
    })

    const expectedType = translateOrderTypeToAluna({
      from: orderType,
    })

    const expectedSide = amountOrig > 0
      ? AlunaOrderSideEnum.BUY
      : AlunaOrderSideEnum.SELL

    const fixedPrice = price || priceAvg
    let expectedComputedPrice = fixedPrice

    if (expectedType === AlunaOrderTypesEnum.STOP_LIMIT) {

      expectedStopRate = fixedPrice
      expectedLimitRate = priceAuxLimit
      expectedComputedPrice = priceAuxLimit

    } else if (expectedType === AlunaOrderTypesEnum.STOP_MARKET) {

      expectedStopRate = fixedPrice

    } else {

      expectedRate = fixedPrice

    }

    let expectedFilledAt: Date | undefined
    let expectedCanceledAt: Date | undefined

    if (expectedStatus === AlunaOrderStatusEnum.FILLED) {

      expectedFilledAt = new Date(mtsUpdate)

    } else if (expectedStatus === AlunaOrderStatusEnum.CANCELED) {

      expectedCanceledAt = new Date(mtsUpdate)

    }

    return {
      expectedId: id,
      expectedSymbolPair: symbolPair,
      expectedRate,
      expectedStopRate,
      expectedLimitRate,
      expectedStatus,
      expectedAccount,
      expectedType,
      expectedSide,
      expectedFilledAt,
      expectedCanceledAt,
      expectedComputedPrice,
      expectedBaseSymbolId,
      expectedQuoteSymbolId,
      expectedAmount: amountOrig,
      expectedPlacedAt: mtsCreate,
    }
  }

  it('should parse a Bitfinex raw order just fine (OPEN)', async () => {

    // preparing data
    const rawOrder = cloneDeep(BITFINEX_RAW_ORDERS[0])
    rawOrder[13] = 'ACTIVE'


    // executing
    runTest({ rawOrder })

  })

  it('should parse a Bitfinex raw order just fine (FILLED)', async () => {

    // preparing data
    const rawOrder = cloneDeep(BITFINEX_RAW_ORDERS[0])
    rawOrder[13] = 'EXECUTED'


    // executing
    runTest({ rawOrder })

  })

  it('should parse a Bitfinex raw order just fine (CANCELED)', async () => {

    // preparing data
    const rawOrder = cloneDeep(BITFINEX_RAW_ORDERS[0])
    rawOrder[13] = 'CANCELED'


    // executing
    runTest({ rawOrder })

  })

  it('should parse a Bitfinex raw order just fine (STOP_LIMIT)', async () => {

    // preparing data
    const rawOrder = cloneDeep(BITFINEX_RAW_ORDERS[0])
    rawOrder[8] = BitfinexOrderTypeEnum.STOP_LIMIT


    // executing
    runTest({ rawOrder })

  })

  it('should parse a Bitfinex raw order just fine (STOP_MARKET)', async () => {

    // preparing data
    const rawOrder = cloneDeep(BITFINEX_RAW_ORDERS[0])
    rawOrder[8] = BitfinexOrderTypeEnum.EXCHANGE_STOP


    // executing
    runTest({ rawOrder })

  })

  it('should parse a Bitfinex raw order just fine (BUY)', async () => {

    // preparing data
    const rawOrder = cloneDeep(BITFINEX_RAW_ORDERS[0])
    rawOrder[7] = 10


    // executing
    runTest({ rawOrder })

  })

  it('should parse a Bitfinex raw order just fine (SELL)', async () => {

    // preparing data
    const rawOrder = cloneDeep(BITFINEX_RAW_ORDERS[0])
    rawOrder[7] = -10


    // executing
    runTest({ rawOrder })

  })

  it('should parse a Bitfinex raw order just fine (symbol w/ ":")', async () => {

    // preparing data
    const rawOrder = cloneDeep(BITFINEX_RAW_ORDERS[0])
    rawOrder[3] = 'tLUNA:USD'


    // executing
    runTest({ rawOrder })

  })

  it('should parse a Bitfinex raw order just fine (symbol w/o ":")', async () => {

    // preparing data
    const rawOrder = cloneDeep(BITFINEX_RAW_ORDERS[0])
    rawOrder[3] = 'tBTCUSD'


    // executing
    runTest({ rawOrder })
  })

})
