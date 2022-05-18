import { expect } from 'chai'
import { cloneDeep } from 'lodash'

import { AlunaAccountEnum } from '../../../../../lib/enums/AlunaAccountEnum'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { IAlunaOrderSchema } from '../../../../../lib/schemas/IAlunaOrderSchema'
import { mockTranslateSymbolId } from '../../../../../utils/mappings/translateSymbolId.mock'
import { translateOrderSideToAluna } from '../../../enums/adapters/valrOrderSideAdapter'
import { translateOrderStatusToAluna } from '../../../enums/adapters/valrOrderStatusAdapter'
import { translateOrderTypeToAluna } from '../../../enums/adapters/valrOrderTypeAdapter'
import { ValrOrderStatusEnum } from '../../../enums/ValrOrderStatusEnum'
import { ValrOrderTypeEnum } from '../../../enums/ValrOrderTypeEnum'
import { VALR_RAW_CURRENCY_PAIRS } from '../../../test/fixtures/valrMarket'
import {
  VALR_RAW_GET_RESPONSE_ORDERS,
  VALR_RAW_LIST_RESPONSE_ORDERS,
} from '../../../test/fixtures/valrOrders'
import { ValrAuthed } from '../../../ValrAuthed'
import { valrBaseSpecs } from '../../../valrSpecs'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should parse a Valr raw order just fine (GET TYPE RESPONSE)', async () => {

    // preparing data
    const valrOrder = cloneDeep(VALR_RAW_GET_RESPONSE_ORDERS[0])
    const rawPair = cloneDeep(VALR_RAW_CURRENCY_PAIRS[0])

    valrOrder.currencyPair = rawPair.symbol
    valrOrder.orderStatusType = ValrOrderStatusEnum.ACTIVE



    // mocking
    const { translateSymbolId } = mockTranslateSymbolId()

    translateSymbolId.onFirstCall().returns(rawPair.baseCurrency)
    translateSymbolId.onSecondCall().returns(rawPair.quoteCurrency)

    // executing
    const exchange = new ValrAuthed({ credentials })

    const rawOrder = {
      valrOrder,
      pair: rawPair,
    }

    const { order } = exchange.order.parse({ rawOrder })


    // validating
    const {
      baseCurrency,
      quoteCurrency,
      symbol,
    } = rawPair

    const {
      orderId,
      originalQuantity,
      orderSide,
      orderCreatedAt,
      orderStatusType,
      orderType,
      originalPrice,
      stopPrice,
    } = valrOrder

    const amount = Number(originalQuantity)
    const alnOrderType = translateOrderTypeToAluna({ from: orderType })
    const alnOrderSide = translateOrderSideToAluna({ from: orderSide })
    const alnOrderStatus = translateOrderStatusToAluna(
      { from: orderStatusType },
    )

    const expectedParsedOrder: IAlunaOrderSchema = {
      id: orderId,
      symbolPair: symbol,
      exchangeId: valrBaseSpecs.id,
      baseSymbolId: baseCurrency,
      quoteSymbolId: quoteCurrency,
      total: amount * Number(originalPrice),
      amount,
      limitRate: Number(originalPrice),
      stopRate: Number(stopPrice),
      account: AlunaAccountEnum.SPOT,
      side: alnOrderSide,
      status: alnOrderStatus,
      type: alnOrderType,
      placedAt: new Date(orderCreatedAt),
      filledAt: undefined,
      meta: valrOrder,
      canceledAt: undefined,
      rate: undefined,
    }

    expect(order).to.deep.eq(expectedParsedOrder)

  })

  it('should parse a Valr raw order just fine (LIST TYPE RESPONSE)', async () => {

    // preparing data
    const valrOrder = cloneDeep(VALR_RAW_LIST_RESPONSE_ORDERS[0])
    const rawPair = cloneDeep(VALR_RAW_CURRENCY_PAIRS[0])

    valrOrder.status = ValrOrderStatusEnum.ACTIVE
    valrOrder.currencyPair = rawPair.symbol


    // mocking
    const { translateSymbolId } = mockTranslateSymbolId()

    translateSymbolId.onFirstCall().returns(rawPair.baseCurrency)
    translateSymbolId.onSecondCall().returns(rawPair.quoteCurrency)

    // executing
    const exchange = new ValrAuthed({ credentials })

    const rawOrder = {
      valrOrder,
      pair: rawPair,
    }

    const { order } = exchange.order.parse({ rawOrder })


    // validating
    const {
      baseCurrency,
      quoteCurrency,
      symbol,
    } = rawPair

    const {
      orderId,
      originalQuantity,
      side,
      price,
      status,
      type,
      createdAt,
      stopPrice,
    } = valrOrder

    const amount = Number(originalQuantity)
    const alnOrderType = translateOrderTypeToAluna({ from: type })
    const alnOrderSide = translateOrderSideToAluna({ from: side })
    const alnOrderStatus = translateOrderStatusToAluna(
      { from: status },
    )

    const expectedParsedOrder: IAlunaOrderSchema = {
      id: orderId,
      symbolPair: symbol,
      exchangeId: valrBaseSpecs.id,
      baseSymbolId: baseCurrency,
      quoteSymbolId: quoteCurrency,
      total: amount * Number(price),
      amount,
      limitRate: Number(price),
      stopRate: Number(stopPrice),
      account: AlunaAccountEnum.SPOT,
      side: alnOrderSide,
      status: alnOrderStatus,
      type: alnOrderType,
      placedAt: new Date(createdAt),
      filledAt: undefined,
      meta: valrOrder,
      canceledAt: undefined,
      rate: undefined,
    }

    expect(order).to.deep.eq(expectedParsedOrder)

  })

  it('should parse a Valr raw order just fine (CANCELED)', async () => {

    // preparing data
    const valrOrder = cloneDeep(VALR_RAW_GET_RESPONSE_ORDERS[0])
    valrOrder.orderStatusType = ValrOrderStatusEnum.CANCELLED

    const rawPair = cloneDeep(VALR_RAW_CURRENCY_PAIRS[0])

    valrOrder.currencyPair = rawPair.symbol


    // mocking
    const { translateSymbolId } = mockTranslateSymbolId()

    translateSymbolId.onFirstCall().returns(rawPair.baseCurrency)
    translateSymbolId.onSecondCall().returns(rawPair.quoteCurrency)

    // executing
    const exchange = new ValrAuthed({ credentials })

    const rawOrder = {
      valrOrder,
      pair: rawPair,
    }

    const { order } = exchange.order.parse({ rawOrder })


    // validating
    const {
      baseCurrency,
      quoteCurrency,
      symbol,
    } = rawPair

    const {
      orderId,
      originalQuantity,
      orderSide,
      orderCreatedAt,
      orderStatusType,
      orderType,
      originalPrice,
      stopPrice,
      orderUpdatedAt,
    } = valrOrder

    const amount = Number(originalQuantity)
    const alnOrderType = translateOrderTypeToAluna({ from: orderType })
    const alnOrderSide = translateOrderSideToAluna({ from: orderSide })
    const alnOrderStatus = translateOrderStatusToAluna(
      { from: orderStatusType },
    )

    const expectedParsedOrder: IAlunaOrderSchema = {
      id: orderId,
      symbolPair: symbol,
      exchangeId: valrBaseSpecs.id,
      baseSymbolId: baseCurrency,
      quoteSymbolId: quoteCurrency,
      total: amount * Number(originalPrice),
      amount,
      limitRate: Number(originalPrice),
      stopRate: Number(stopPrice),
      account: AlunaAccountEnum.SPOT,
      side: alnOrderSide,
      status: alnOrderStatus,
      type: alnOrderType,
      placedAt: new Date(orderCreatedAt),
      filledAt: undefined,
      meta: valrOrder,
      canceledAt: new Date(orderUpdatedAt),
      rate: undefined,
    }

    expect(order).to.deep.eq(expectedParsedOrder)

  })

  it('should parse a Valr raw order just fine (FILLED)', async () => {

    // preparing data
    const valrOrder = cloneDeep(VALR_RAW_GET_RESPONSE_ORDERS[0])
    valrOrder.orderStatusType = ValrOrderStatusEnum.FILLED

    const rawPair = cloneDeep(VALR_RAW_CURRENCY_PAIRS[0])

    valrOrder.currencyPair = rawPair.symbol


    // mocking
    const { translateSymbolId } = mockTranslateSymbolId()

    translateSymbolId.onFirstCall().returns(rawPair.baseCurrency)
    translateSymbolId.onSecondCall().returns(rawPair.quoteCurrency)

    // executing
    const exchange = new ValrAuthed({ credentials })

    const rawOrder = {
      valrOrder,
      pair: rawPair,
    }

    const { order } = exchange.order.parse({ rawOrder })


    // validating
    const {
      baseCurrency,
      quoteCurrency,
      symbol,
    } = rawPair

    const {
      orderId,
      originalQuantity,
      orderSide,
      orderCreatedAt,
      orderStatusType,
      orderType,
      originalPrice,
      stopPrice,
      orderUpdatedAt,
    } = valrOrder

    const amount = Number(originalQuantity)
    const alnOrderType = translateOrderTypeToAluna({ from: orderType })
    const alnOrderSide = translateOrderSideToAluna({ from: orderSide })
    const alnOrderStatus = translateOrderStatusToAluna(
      { from: orderStatusType },
    )

    const expectedParsedOrder: IAlunaOrderSchema = {
      id: orderId,
      symbolPair: symbol,
      exchangeId: valrBaseSpecs.id,
      baseSymbolId: baseCurrency,
      quoteSymbolId: quoteCurrency,
      total: amount * Number(originalPrice),
      amount,
      limitRate: Number(originalPrice),
      stopRate: Number(stopPrice),
      account: AlunaAccountEnum.SPOT,
      side: alnOrderSide,
      status: alnOrderStatus,
      type: alnOrderType,
      placedAt: new Date(orderCreatedAt),
      filledAt: new Date(orderUpdatedAt),
      meta: valrOrder,
      canceledAt: undefined,
      rate: undefined,
    }

    expect(order).to.deep.eq(expectedParsedOrder)

  })

  it('should parse a Valr raw order just fine (LIMIT)', async () => {

    // preparing data
    const valrOrder = cloneDeep(VALR_RAW_GET_RESPONSE_ORDERS[0])
    valrOrder.orderType = ValrOrderTypeEnum.LIMIT
    valrOrder.orderStatusType = ValrOrderStatusEnum.ACTIVE

    const rawPair = cloneDeep(VALR_RAW_CURRENCY_PAIRS[0])

    valrOrder.currencyPair = rawPair.symbol


    // mocking
    const { translateSymbolId } = mockTranslateSymbolId()

    translateSymbolId.onFirstCall().returns(rawPair.baseCurrency)
    translateSymbolId.onSecondCall().returns(rawPair.quoteCurrency)

    // executing
    const exchange = new ValrAuthed({ credentials })

    const rawOrder = {
      valrOrder,
      pair: rawPair,
    }

    const { order } = exchange.order.parse({ rawOrder })


    // validating
    const {
      baseCurrency,
      quoteCurrency,
      symbol,
    } = rawPair

    const {
      orderId,
      originalQuantity,
      orderSide,
      orderCreatedAt,
      orderStatusType,
      orderType,
      originalPrice,
    } = valrOrder

    const amount = Number(originalQuantity)
    const alnOrderType = translateOrderTypeToAluna({ from: orderType })
    const alnOrderSide = translateOrderSideToAluna({ from: orderSide })
    const alnOrderStatus = translateOrderStatusToAluna(
      { from: orderStatusType },
    )

    const expectedParsedOrder: IAlunaOrderSchema = {
      id: orderId,
      symbolPair: symbol,
      exchangeId: valrBaseSpecs.id,
      baseSymbolId: baseCurrency,
      quoteSymbolId: quoteCurrency,
      total: amount * Number(originalPrice),
      amount,
      rate: Number(originalPrice),
      account: AlunaAccountEnum.SPOT,
      side: alnOrderSide,
      status: alnOrderStatus,
      type: alnOrderType,
      placedAt: new Date(orderCreatedAt),
      meta: valrOrder,
      canceledAt: undefined,
      filledAt: undefined,
      stopRate: undefined,
      limitRate: undefined,
    }

    expect(order).to.deep.eq(expectedParsedOrder)

  })

})
