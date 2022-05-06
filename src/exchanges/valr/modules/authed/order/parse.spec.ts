import { expect } from 'chai'

import { cloneDeep, filter } from 'lodash'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { ValrAuthed } from '../../../ValrAuthed'
import { VALR_RAW_GET_ORDERS, VALR_RAW_ORDERS } from '../../../test/fixtures/valrOrders'
import { IAlunaOrderSchema } from '../../../../../lib/schemas/IAlunaOrderSchema'
import { valrBaseSpecs } from '../../../valrSpecs'
import { VALR_RAW_CURRENCY_PAIRS } from '../../../test/fixtures/valrMarket'
import { AlunaAccountEnum } from '../../../../../lib/enums/AlunaAccountEnum'
import { translateOrderSideToAluna } from '../../../enums/adapters/valrOrderSideAdapter'
import { translateOrderTypeToAluna } from '../../../enums/adapters/valrOrderTypeAdapter'
import { translateOrderStatusToAluna } from '../../../enums/adapters/valrOrderStatusAdapter'
import { mockTranslateSymbolId } from '../../../../../utils/mappings/translateSymbolId.mock'
import { ValrOrderStatusEnum } from '../../../enums/ValrOrderStatusEnum'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should parse a Valr raw order just fine', async () => {

    // preparing data
    const rawOrder = cloneDeep(VALR_RAW_ORDERS[0])
    const rawPair = cloneDeep(VALR_RAW_CURRENCY_PAIRS[0])

    rawOrder.currencyPair = rawPair.symbol

    const {
      baseCurrency,
      quoteCurrency,
      symbol,
    } = rawPair

    const {
      orderId,
      originalQuantity,
      price,
      side,
      type,
      status,
      createdAt,
      updatedAt,
      stopPrice,
    } = rawOrder

    const amount = Number(originalQuantity)
    const alnOrderType = translateOrderTypeToAluna({ from: type })
    const alnOrderStatus = translateOrderStatusToAluna({ from: status })

    const rawOrderRequest = {
      order: rawOrder,
      pair: rawPair,
    }

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
      account: AlunaAccountEnum.EXCHANGE,
      side: translateOrderSideToAluna({ from: side }),
      status: alnOrderStatus,
      type: alnOrderType,
      placedAt: new Date(createdAt),
      filledAt: new Date(updatedAt),
      meta: rawOrderRequest,
      canceledAt: undefined,
      rate: undefined,
    }


    // mocking
    const exchange = new ValrAuthed({ credentials })

    const { translateSymbolId } = mockTranslateSymbolId()

    translateSymbolId.onFirstCall().returns(baseCurrency)
    translateSymbolId.onSecondCall().returns(quoteCurrency)

    // executing
    const { order } = exchange.order.parse({ rawOrder: rawOrderRequest })

    // validating
    expect(order).to.deep.eq(expectedParsedOrder)

  })

  it('should parse a Valr raw order just fine', async () => {

    // preparing data
    const rawOrder = cloneDeep(VALR_RAW_GET_ORDERS[0])
    const rawPair = cloneDeep(VALR_RAW_CURRENCY_PAIRS[0])

    rawOrder.currencyPair = rawPair.symbol

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
    } = rawOrder

    const amount = Number(originalQuantity)
    const alnOrderType = translateOrderTypeToAluna({ from: orderType })
    const alnOrderSide = translateOrderSideToAluna({ from: orderSide })
    const alnOrderStatus = translateOrderStatusToAluna(
      { from: orderStatusType },
    )

    const rawOrderRequest = {
      order: rawOrder,
      pair: rawPair,
    }

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
      account: AlunaAccountEnum.EXCHANGE,
      side: alnOrderSide,
      status: alnOrderStatus,
      type: alnOrderType,
      placedAt: new Date(orderCreatedAt),
      filledAt: undefined,
      meta: rawOrderRequest,
      canceledAt: undefined,
      rate: undefined,
    }


    // mocking
    const exchange = new ValrAuthed({ credentials })

    const { translateSymbolId } = mockTranslateSymbolId()

    translateSymbolId.onFirstCall().returns(baseCurrency)
    translateSymbolId.onSecondCall().returns(quoteCurrency)

    // executing
    const { order } = exchange.order.parse({ rawOrder: rawOrderRequest })

    // validating
    expect(order).to.deep.eq(expectedParsedOrder)

  })

  it('should parse a Valr canceled raw order just fine', async () => {

    // preparing data
    const filterCanceledOrder = filter(VALR_RAW_GET_ORDERS, {
      orderStatusType: ValrOrderStatusEnum.CANCELLED,
    })[0]

    const rawOrder = cloneDeep(filterCanceledOrder)
    const rawPair = cloneDeep(VALR_RAW_CURRENCY_PAIRS[0])

    rawOrder.currencyPair = rawPair.symbol

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
      orderUpdatedAt,
    } = rawOrder

    const amount = Number(originalQuantity)
    const alnOrderType = translateOrderTypeToAluna({ from: orderType })
    const alnOrderSide = translateOrderSideToAluna({ from: orderSide })
    const alnOrderStatus = translateOrderStatusToAluna(
      { from: orderStatusType },
    )

    const rawOrderRequest = {
      order: rawOrder,
      pair: rawPair,
    }

    const expectedParsedOrder: IAlunaOrderSchema = {
      id: orderId,
      symbolPair: symbol,
      exchangeId: valrBaseSpecs.id,
      baseSymbolId: baseCurrency,
      quoteSymbolId: quoteCurrency,
      total: amount * Number(originalPrice),
      amount,
      limitRate: undefined,
      stopRate: undefined,
      account: AlunaAccountEnum.EXCHANGE,
      side: alnOrderSide,
      status: alnOrderStatus,
      type: alnOrderType,
      placedAt: new Date(orderCreatedAt),
      filledAt: undefined,
      meta: rawOrderRequest,
      canceledAt: new Date(orderUpdatedAt),
      rate: Number(originalPrice),
    }


    // mocking
    const exchange = new ValrAuthed({ credentials })

    const { translateSymbolId } = mockTranslateSymbolId()

    translateSymbolId.onFirstCall().returns(baseCurrency)
    translateSymbolId.onSecondCall().returns(quoteCurrency)

    // executing
    const { order } = exchange.order.parse({ rawOrder: rawOrderRequest })

    // validating
    expect(order).to.deep.eq(expectedParsedOrder)

  })

})
