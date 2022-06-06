import { expect } from 'chai'
import { cloneDeep } from 'lodash'

import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { mockTranslateSymbolId } from '../../../../../utils/mappings/translateSymbolId.mock'
import { translateOrderSideToAluna } from '../../../enums/adapters/huobiOrderSideAdapter'
import { translateOrderStatusToAluna } from '../../../enums/adapters/huobiOrderStatusAdapter'
import { translateOrderTypeToAluna } from '../../../enums/adapters/huobiOrderTypeAdapter'
import { HuobiOrderSideEnum } from '../../../enums/HuobiOrderSideEnum'
import { HuobiOrderTypeEnum } from '../../../enums/HuobiOrderTypeEnum'
import { HuobiAuthed } from '../../../HuobiAuthed'
import { HUOBI_RAW_ORDERS } from '../../../test/fixtures/huobiOrders'
import { HUOBI_RAW_SYMBOLS } from '../../../test/fixtures/huobiSymbols'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should parse a Huobi raw limit order just fine', async () => {

    // preparing data
    const rawOrder = HUOBI_RAW_ORDERS[0]
    const rawSymbol = HUOBI_RAW_SYMBOLS[0]

    const rawOrderRequest = {
      rawOrder,
      rawSymbol,
    }

    const {
      symbol,
      price,
      type,
      'created-at': createdAt,
      amount,
      state,
      id,
    } = rawOrder

    const {
      bc: baseSymbolId,
      qc: quoteSymbolId,
    } = rawSymbol

    const orderStatus = translateOrderStatusToAluna({
      from: state,
    })
    const orderSide = type.split('-')[0] as HuobiOrderSideEnum
    const orderType = type.split('-')[1] as HuobiOrderTypeEnum
    const translatedOrderSide = translateOrderSideToAluna({
      from: orderSide,
    })
    const translatedOrderType = translateOrderTypeToAluna({
      from: orderType,
    })
    const orderAmount = Number(amount)
    const rate = Number(price)
    const total = orderAmount * rate

    // mocking
    const exchange = new HuobiAuthed({ credentials })

    const { translateSymbolId } = mockTranslateSymbolId()

    translateSymbolId
      .onFirstCall()
      .returns(baseSymbolId)

    translateSymbolId
      .onSecondCall()
      .returns(quoteSymbolId)

    // executing
    const { order } = exchange.order.parse({
      rawOrder: rawOrderRequest,
    })

    // validating
    expect(order).to.exist

    expect(order.id).to.be.eq(id.toString())
    expect(order.symbolPair).to.be.eq(symbol)
    expect(order.baseSymbolId).to.be.eq(baseSymbolId)
    expect(order.quoteSymbolId).to.be.eq(quoteSymbolId)
    expect(order.total).to.be.eq(total)
    expect(order.rate).to.be.eq(rate)
    expect(order.amount).to.be.eq(orderAmount)
    expect(order.type).to.be.eq(translatedOrderType)
    expect(order.side).to.be.eq(translatedOrderSide)
    expect(order.status).to.be.eq(orderStatus)
    expect(order.placedAt.getTime()).to.be.eq(new Date(createdAt).getTime())
    expect(order.canceledAt).to.be.ok
    expect(order.filledAt).not.to.be.ok

  })

  it('should parse a Huobi raw stop limit order just fine', async () => {

    // preparing data
    const rawOrder = cloneDeep(HUOBI_RAW_ORDERS[0])
    const rawSymbol = HUOBI_RAW_SYMBOLS[0]

    rawOrder.type = `buy-${HuobiOrderTypeEnum.STOP_LIMIT}`

    rawOrder['stop-price'] = '0.1'

    const rawOrderRequest = {
      rawOrder,
      rawSymbol,
    }

    const {
      symbol,
      price,
      type,
      'created-at': createdAt,
      amount,
      state,
      id,
    } = rawOrder

    const {
      bc: baseSymbolId,
      qc: quoteSymbolId,
    } = rawSymbol

    const orderStatus = translateOrderStatusToAluna({
      from: state,
    })
    const orderSide = type.split('-')[0] as HuobiOrderSideEnum
    const orderType = `${type.split('-')[1]}-${type.split('-')[2]}` as HuobiOrderTypeEnum
    const translatedOrderSide = translateOrderSideToAluna({
      from: orderSide,
    })
    const translatedOrderType = translateOrderTypeToAluna({
      from: orderType,
    })
    const orderAmount = Number(amount)
    const rate = Number(price)
    const total = orderAmount * rate

    // mocking
    const exchange = new HuobiAuthed({ credentials })

    const { translateSymbolId } = mockTranslateSymbolId()

    translateSymbolId
      .onFirstCall()
      .returns(baseSymbolId)

    translateSymbolId
      .onSecondCall()
      .returns(quoteSymbolId)

    // executing
    const { order } = exchange.order.parse({
      rawOrder: rawOrderRequest,
    })

    // validating
    expect(order).to.exist

    expect(order.id).to.be.eq(id.toString())
    expect(order.symbolPair).to.be.eq(symbol)
    expect(order.baseSymbolId).to.be.eq(baseSymbolId)
    expect(order.quoteSymbolId).to.be.eq(quoteSymbolId)
    expect(order.total).to.be.eq(total)
    expect(order.limitRate).to.be.eq(rate)
    expect(order.rate).not.to.be.ok
    expect(order.amount).to.be.eq(orderAmount)
    expect(order.type).to.be.eq(translatedOrderType)
    expect(order.side).to.be.eq(translatedOrderSide)
    expect(order.stopRate).to.be.eq(Number(rawOrder['stop-price']))
    expect(order.status).to.be.eq(orderStatus)
    expect(order.placedAt.getTime()).to.be.eq(new Date(createdAt).getTime())
    expect(order.canceledAt).to.be.ok
    expect(order.filledAt).not.to.be.ok

  })

  it('should parse a Huobi raw stop market order just fine', async () => {

    // preparing data
    const rawOrder = cloneDeep(HUOBI_RAW_ORDERS[0])
    const rawSymbol = HUOBI_RAW_SYMBOLS[0]

    rawOrder.type = `buy-${HuobiOrderTypeEnum.STOP_MARKET}`

    rawOrder['stop-price'] = '0.1'

    const rawOrderRequest = {
      rawOrder,
      rawSymbol,
    }

    const {
      symbol,
      type,
      'created-at': createdAt,
      amount,
      state,
      id,
    } = rawOrder

    const {
      bc: baseSymbolId,
      qc: quoteSymbolId,
    } = rawSymbol

    const orderStatus = translateOrderStatusToAluna({
      from: state,
    })
    const orderSide = type.split('-')[0] as HuobiOrderSideEnum
    const orderType = `${type.split('-')[1]}-${type.split('-')[2]}` as HuobiOrderTypeEnum
    const translatedOrderSide = translateOrderSideToAluna({
      from: orderSide,
    })
    const translatedOrderType = translateOrderTypeToAluna({
      from: orderType,
    })
    const orderAmount = Number(amount)
    const total = orderAmount

    // mocking
    const exchange = new HuobiAuthed({ credentials })

    const { translateSymbolId } = mockTranslateSymbolId()

    translateSymbolId
      .onFirstCall()
      .returns(baseSymbolId)

    translateSymbolId
      .onSecondCall()
      .returns(quoteSymbolId)

    // executing
    const { order } = exchange.order.parse({
      rawOrder: rawOrderRequest,
    })

    // validating
    expect(order).to.exist

    expect(order.id).to.be.eq(id.toString())
    expect(order.symbolPair).to.be.eq(symbol)
    expect(order.baseSymbolId).to.be.eq(baseSymbolId)
    expect(order.quoteSymbolId).to.be.eq(quoteSymbolId)
    expect(order.total).to.be.eq(total)
    expect(order.limitRate).not.to.be.ok
    expect(order.rate).not.to.be.ok
    expect(order.amount).to.be.eq(orderAmount)
    expect(order.type).to.be.eq(translatedOrderType)
    expect(order.side).to.be.eq(translatedOrderSide)
    expect(order.stopRate).to.be.eq(Number(rawOrder['stop-price']))
    expect(order.status).to.be.eq(orderStatus)
    expect(order.placedAt.getTime()).to.be.eq(new Date(createdAt).getTime())
    expect(order.canceledAt).to.be.ok
    expect(order.filledAt).not.to.be.ok

  })

  it('should parse a Huobi raw market order just fine', async () => {

    // preparing data
    const rawOrder = HUOBI_RAW_ORDERS[1]
    const rawSymbol = HUOBI_RAW_SYMBOLS[1]

    const rawOrderRequest = {
      rawOrder,
      rawSymbol,
    }

    const {
      symbol,
      price,
      type,
      'created-at': createdAt,
      amount,
      state,
      id,
    } = rawOrder

    const {
      bc: baseSymbolId,
      qc: quoteSymbolId,
    } = rawSymbol

    const orderStatus = translateOrderStatusToAluna({
      from: state,
    })
    const orderSide = type.split('-')[0] as HuobiOrderSideEnum
    const orderType = type.split('-')[1] as HuobiOrderTypeEnum
    const translatedOrderSide = translateOrderSideToAluna({
      from: orderSide,
    })
    const translatedOrderType = translateOrderTypeToAluna({
      from: orderType,
    })
    const orderAmount = Number(amount)
    const total = orderAmount

    // mocking
    const exchange = new HuobiAuthed({ credentials })

    const { translateSymbolId } = mockTranslateSymbolId()

    translateSymbolId
      .onFirstCall()
      .returns(baseSymbolId)

    translateSymbolId
      .onSecondCall()
      .returns(quoteSymbolId)

    // executing
    const { order } = exchange.order.parse({
      rawOrder: rawOrderRequest,
    })

    // validating
    expect(order).to.exist

    expect(order.id).to.be.eq(id.toString())
    expect(order.symbolPair).to.be.eq(symbol)
    expect(order.baseSymbolId).to.be.eq(baseSymbolId)
    expect(order.quoteSymbolId).to.be.eq(quoteSymbolId)
    expect(order.total).to.be.eq(total)
    expect(order.rate).not.to.be.ok
    expect(order.amount).to.be.eq(orderAmount)
    expect(order.type).to.be.eq(translatedOrderType)
    expect(order.side).to.be.eq(translatedOrderSide)
    expect(order.status).to.be.eq(orderStatus)
    expect(order.placedAt.getTime()).to.be.eq(new Date(createdAt).getTime())
    expect(order.filledAt).to.be.ok
    expect(order.canceledAt).not.to.be.ok

  })

})
