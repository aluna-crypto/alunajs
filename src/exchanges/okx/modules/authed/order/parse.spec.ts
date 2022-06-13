import { expect } from 'chai'

import { cloneDeep } from 'lodash'
import { ImportMock } from 'ts-mock-imports'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { translateOrderSideToAluna } from '../../../enums/adapters/okxOrderSideAdapter'
import { translateOrderStatusToAluna } from '../../../enums/adapters/okxOrderStatusAdapter'
import { translateOrderTypeToAluna } from '../../../enums/adapters/okxOrderTypeAdapter'
import { OkxAuthed } from '../../../OkxAuthed'
import { OKX_RAW_CONDITIONAL_ORDERS, OKX_RAW_ORDERS } from '../../../test/fixtures/okxOrders'
import { mockTranslateSymbolId } from '../../../../../utils/mappings/translateSymbolId.mock'
import { OkxOrderStatusEnum } from '../../../enums/OkxOrderStatusEnum'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should parse a Okx raw order just fine', async () => {

    // preparing data
    const rawOrder = cloneDeep(OKX_RAW_ORDERS[0])

    rawOrder.state = OkxOrderStatusEnum.CANCELED
    rawOrder.cTime = null as any

    const {
      side,
      instId,
      ordId,
      px,
      state,
      sz,
      ordType,
      ccy,
      tgtCcy,
      uTime,
    } = rawOrder

    const amount = Number(sz)
    const rate = Number(px)
    const total = amount * rate

    const orderStatus = translateOrderStatusToAluna({ from: state })
    const orderSide = translateOrderSideToAluna({ from: side })
    const orderType = translateOrderTypeToAluna({ from: ordType })

    const timestamp = new Date()

    // mocking

    ImportMock.mockFunction(
      global,
      'Date',
      timestamp,
    )

    const { translateSymbolId } = mockTranslateSymbolId()

    translateSymbolId.onFirstCall().returns(ccy)

    translateSymbolId.onSecondCall().returns(tgtCcy)

    const exchange = new OkxAuthed({ credentials })


    // executing
    const { order } = exchange.order.parse({ rawOrder })


    // validating
    expect(order).to.exist

    expect(order.id).to.be.eq(ordId)
    expect(order.symbolPair).to.be.eq(instId)
    expect(order.status).to.be.eq(orderStatus)
    expect(order.side).to.be.eq(orderSide)
    expect(order.type).to.be.eq(orderType)
    expect(order.baseSymbolId).to.be.eq(ccy)
    expect(order.quoteSymbolId).to.be.eq(tgtCcy)
    expect(order.total).to.be.eq(total)
    expect(order.amount).to.be.eq(amount)
    expect(order.placedAt.getTime()).to.be.eq(timestamp.getTime())
    expect(order.canceledAt?.getTime()).to.be.eq(new Date(Number(uTime)).getTime())

    expect(translateSymbolId.callCount).to.be.eq(2)

  })

  it('should parse a Okx raw stop limit order just fine', async () => {

    // preparing data
    const rawOrder = cloneDeep(OKX_RAW_CONDITIONAL_ORDERS[0])

    const {
      side,
      instId,
      px,
      state,
      sz,
      ordType,
      ccy,
      tgtCcy,
      algoId,
      slOrdPx,
      slTriggerPx,
    } = rawOrder

    const amount = Number(sz)
    const limitRate = Number(slTriggerPx)
    const stopRate = Number(slOrdPx)
    const total = amount * limitRate

    const orderStatus = translateOrderStatusToAluna({ from: state })
    const orderSide = translateOrderSideToAluna({ from: side })
    const orderType = translateOrderTypeToAluna({ from: ordType, slOrdPx })

    const timestamp = new Date()

    // mocking

    ImportMock.mockFunction(
      global,
      'Date',
      timestamp,
    )

    const { translateSymbolId } = mockTranslateSymbolId()

    translateSymbolId.onFirstCall().returns(ccy)

    translateSymbolId.onSecondCall().returns(tgtCcy)

    const exchange = new OkxAuthed({ credentials })


    // executing
    const { order } = exchange.order.parse({ rawOrder })


    // validating
    expect(order).to.exist

    expect(order.id).to.be.eq(algoId)
    expect(order.symbolPair).to.be.eq(instId)
    expect(order.status).to.be.eq(orderStatus)
    expect(order.side).to.be.eq(orderSide)
    expect(order.type).to.be.eq(orderType)
    expect(order.baseSymbolId).to.be.eq(ccy)
    expect(order.quoteSymbolId).to.be.eq(tgtCcy)
    expect(order.total).to.be.eq(total)
    expect(order.limitRate).to.be.eq(limitRate)
    expect(order.stopRate).to.be.eq(stopRate)
    expect(order.amount).to.be.eq(amount)
    expect(order.placedAt.getTime()).to.be.eq(timestamp.getTime())

    expect(translateSymbolId.callCount).to.be.eq(2)

  })

  it('should parse a Okx raw stop market order just fine', async () => {

    // preparing data
    const rawOrder = cloneDeep(OKX_RAW_CONDITIONAL_ORDERS[1])

    const {
      side,
      instId,
      px,
      state,
      sz,
      ordType,
      ccy,
      tgtCcy,
      algoId,
      slOrdPx,
      slTriggerPx,
    } = rawOrder

    const amount = Number(sz)
    const stopRate = Number(slTriggerPx)
    const total = amount * stopRate

    const orderStatus = translateOrderStatusToAluna({ from: state })
    const orderSide = translateOrderSideToAluna({ from: side })
    const orderType = translateOrderTypeToAluna({ from: ordType, slOrdPx })

    const timestamp = new Date()

    // mocking

    ImportMock.mockFunction(
      global,
      'Date',
      timestamp,
    )

    const { translateSymbolId } = mockTranslateSymbolId()

    translateSymbolId.onFirstCall().returns(ccy)

    translateSymbolId.onSecondCall().returns(tgtCcy)

    const exchange = new OkxAuthed({ credentials })


    // executing
    const { order } = exchange.order.parse({ rawOrder })


    // validating
    expect(order).to.exist

    expect(order.id).to.be.eq(algoId)
    expect(order.symbolPair).to.be.eq(instId)
    expect(order.status).to.be.eq(orderStatus)
    expect(order.side).to.be.eq(orderSide)
    expect(order.type).to.be.eq(orderType)
    expect(order.baseSymbolId).to.be.eq(ccy)
    expect(order.quoteSymbolId).to.be.eq(tgtCcy)
    expect(order.total).to.be.eq(total)
    expect(order.stopRate).to.be.eq(stopRate)
    expect(order.amount).to.be.eq(amount)
    expect(order.placedAt.getTime()).to.be.eq(timestamp.getTime())

    expect(translateSymbolId.callCount).to.be.eq(2)

  })

  it('should parse a Okx raw order just fine', async () => {

    // preparing data
    const rawOrder = cloneDeep(OKX_RAW_ORDERS[1])

    rawOrder.state = OkxOrderStatusEnum.FILLED
    rawOrder.uTime = null as any

    const {
      side,
      cTime,
      instId,
      ordId,
      px,
      state,
      sz,
      ordType,
      ccy,
      tgtCcy,
    } = rawOrder

    const amount = Number(sz)
    const total = amount

    const orderStatus = translateOrderStatusToAluna({ from: state })
    const orderSide = translateOrderSideToAluna({ from: side })
    const orderType = translateOrderTypeToAluna({ from: ordType })

    const timestamp = new Date()


    // mocking

    ImportMock.mockFunction(
      global,
      'Date',
      timestamp,
    )

    const { translateSymbolId } = mockTranslateSymbolId()

    translateSymbolId.onFirstCall().returns(ccy)

    translateSymbolId.onSecondCall().returns(tgtCcy)

    const exchange = new OkxAuthed({ credentials })


    // executing
    const { order } = exchange.order.parse({ rawOrder })


    // validating
    expect(order).to.exist

    expect(order.id).to.be.eq(ordId)
    expect(order.symbolPair).to.be.eq(instId)
    expect(order.status).to.be.eq(orderStatus)
    expect(order.side).to.be.eq(orderSide)
    expect(order.type).to.be.eq(orderType)
    expect(order.baseSymbolId).to.be.eq(ccy)
    expect(order.quoteSymbolId).to.be.eq(tgtCcy)
    expect(order.total).to.be.eq(total)
    expect(order.amount).to.be.eq(amount)
    expect(order.placedAt.getTime()).to.be.eq(new Date(Number(cTime)).getTime())
    expect(order.filledAt?.getTime()).to.be.eq(timestamp.getTime())

    expect(translateSymbolId.callCount).to.be.eq(2)

  })

})
