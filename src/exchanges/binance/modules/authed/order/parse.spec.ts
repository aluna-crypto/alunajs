import { expect } from 'chai'
import { cloneDeep } from 'lodash'

import { AlunaAccountEnum } from '../../../../../lib/enums/AlunaAccountEnum'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { mockTranslateSymbolId } from '../../../../../utils/mappings/translateSymbolId.mock'
import { BinanceAuthed } from '../../../BinanceAuthed'
import { translateOrderSideToAluna } from '../../../enums/adapters/binanceOrderSideAdapter'
import { translateOrderStatusToAluna } from '../../../enums/adapters/binanceOrderStatusAdapter'
import { translateOrderTypeToAluna } from '../../../enums/adapters/binanceOrderTypeAdapter'
import { BinanceOrderStatusEnum } from '../../../enums/BinanceOrderStatusEnum'
import { BINANCE_RAW_ORDERS } from '../../../test/fixtures/binanceOrders'
import { BINANCE_RAW_SYMBOLS } from '../../../test/fixtures/binanceSymbols'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should parse a Binance open raw order just fine', async () => {

    // preparing data
    const rawOrder = BINANCE_RAW_ORDERS[0]
    const rawSymbol = BINANCE_RAW_SYMBOLS[0]

    const rawOrderRequest = {
      rawOrder,
      rawSymbol,
    }

    const {
      baseAsset,
      quoteAsset,
    } = rawSymbol

    const {
      side,
      orderId,
      symbol,
      type,
      status,
      price,
      time,
    } = rawOrder

    const rate = parseFloat(price)

    const createdAt = new Date(time!)

    const orderStatus = translateOrderStatusToAluna({ from: status })
    const orderSide = translateOrderSideToAluna({ from: side })
    const orderType = translateOrderTypeToAluna({ from: type })

    const exchange = new BinanceAuthed({ credentials })

    // mocking

    const { translateSymbolId } = mockTranslateSymbolId()

    translateSymbolId.onFirstCall().returns(baseAsset)
    translateSymbolId.onSecondCall().returns(quoteAsset)

    // executing
    const { order } = exchange.order.parse({ rawOrder: rawOrderRequest })

    // validating
    expect(order).to.exist

    // TODO -> Need to validate other properties
    expect(order.id).to.be.eq(orderId.toString())
    expect(order.symbolPair).to.be.eq(symbol.toString())
    expect(order.exchangeId).to.be.eq(exchange.id)
    expect(order.baseSymbolId).to.be.eq(baseAsset)
    expect(order.quoteSymbolId).to.be.eq(quoteAsset)
    expect(order.account).to.be.eq(AlunaAccountEnum.EXCHANGE)
    expect(order.rate).to.be.eq(rate)
    expect(order.status).to.be.eq(orderStatus)
    expect(order.side).to.be.eq(orderSide)
    expect(order.type).to.be.eq(orderType)
    expect(order.placedAt.getTime()).to.be.eq(createdAt.getTime())

  })

  it('should parse a Binance market raw order just fine', async () => {

    // preparing data
    const rawOrder = BINANCE_RAW_ORDERS[1]
    const rawSymbol = BINANCE_RAW_SYMBOLS[1]

    const rawOrderRequest = {
      rawOrder,
      rawSymbol,
    }

    const {
      baseAsset,
      quoteAsset,
    } = rawSymbol

    const {
      side,
      orderId,
      symbol,
      type,
      status,
      fills,
    } = rawOrder

    const rate = Number(fills![0].price)

    const exchange = new BinanceAuthed({ credentials })

    // mocking

    const { translateSymbolId } = mockTranslateSymbolId()

    translateSymbolId.onFirstCall().returns(baseAsset)
    translateSymbolId.onSecondCall().returns(quoteAsset)

    const orderStatus = translateOrderStatusToAluna({ from: status })
    const orderSide = translateOrderSideToAluna({ from: side })
    const orderType = translateOrderTypeToAluna({ from: type })

    // executing
    const { order } = exchange.order.parse({ rawOrder: rawOrderRequest })

    // validating
    expect(order).to.exist

    expect(order.id).to.be.eq(orderId.toString())
    expect(order.symbolPair).to.be.eq(symbol.toString())
    expect(order.exchangeId).to.be.eq(exchange.id)
    expect(order.baseSymbolId).to.be.eq(baseAsset)
    expect(order.quoteSymbolId).to.be.eq(quoteAsset)
    expect(order.account).to.be.eq(AlunaAccountEnum.EXCHANGE)
    expect(order.status).to.be.eq(orderStatus)
    expect(order.side).to.be.eq(orderSide)
    expect(order.type).to.be.eq(orderType)
    expect(
      order.filledAt
        ?.getTime()
        .toString()
        .substring(0, 11),
    ).to.be.eq(
      new Date()
        .getTime()
        .toString()
        .substring(0, 11),
    )
    expect(order.rate).to.be.eq(rate)

  })

  it('should parse a Binance market raw order just fine', async () => {

    // preparing data
    const rawOrder = cloneDeep(BINANCE_RAW_ORDERS[1])
    const rawSymbol = BINANCE_RAW_SYMBOLS[1]

    const rawOrderRequest = {
      rawOrder,
      rawSymbol,
    }

    const {
      baseAsset,
      quoteAsset,
    } = rawSymbol

    rawOrder.time = undefined
    rawOrder.transactTime = undefined
    rawOrder.updateTime = 1499827319559
    rawOrder.fills = []

    const {
      side,
      orderId,
      symbol,
      type,
      status,
      updateTime,
    } = rawOrder

    const updatedAt = new Date(updateTime!)

    const exchange = new BinanceAuthed({ credentials })

    // mocking

    const { translateSymbolId } = mockTranslateSymbolId()

    translateSymbolId.onFirstCall().returns(baseAsset)
    translateSymbolId.onSecondCall().returns(quoteAsset)

    const orderStatus = translateOrderStatusToAluna({ from: status })
    const orderSide = translateOrderSideToAluna({ from: side })
    const orderType = translateOrderTypeToAluna({ from: type })

    // executing
    const { order } = exchange.order.parse({ rawOrder: rawOrderRequest })

    // validating
    expect(order).to.exist

    expect(order.id).to.be.eq(orderId.toString())
    expect(order.symbolPair).to.be.eq(symbol.toString())
    expect(order.exchangeId).to.be.eq(exchange.id)
    expect(order.baseSymbolId).to.be.eq(baseAsset)
    expect(order.quoteSymbolId).to.be.eq(quoteAsset)
    expect(order.account).to.be.eq(AlunaAccountEnum.EXCHANGE)
    expect(order.status).to.be.eq(orderStatus)
    expect(order.side).to.be.eq(orderSide)
    expect(order.type).to.be.eq(orderType)
    expect(order.filledAt?.getTime()).to.be.eq(updatedAt.getTime())
    expect(order.placedAt
      .getTime()
      .toString()
      .substring(0, 11)).to.be.eq(
      new Date()
        .getTime()
        .toString()
        .substring(0, 11),
    )

  })

  it('should parse a Binance canceled raw order just fine', async () => {

    // preparing data
    const rawOrder = cloneDeep(BINANCE_RAW_ORDERS[0])
    const rawSymbol = BINANCE_RAW_SYMBOLS[0]

    const rawOrderRequest = {
      rawOrder,
      rawSymbol,
    }

    const {
      baseAsset,
      quoteAsset,
    } = rawSymbol

    rawOrder.status = BinanceOrderStatusEnum.CANCELED

    const {
      side,
      orderId,
      symbol,
      type,
      status,
      price,
      updateTime,
    } = rawOrder

    const rate = parseFloat(price)

    const canceledAt = new Date(updateTime!)

    const orderStatus = translateOrderStatusToAluna({ from: status })
    const orderSide = translateOrderSideToAluna({ from: side })
    const orderType = translateOrderTypeToAluna({ from: type })

    const exchange = new BinanceAuthed({ credentials })

    // mocking

    const { translateSymbolId } = mockTranslateSymbolId()

    translateSymbolId.onFirstCall().returns(baseAsset)
    translateSymbolId.onSecondCall().returns(quoteAsset)

    // executing
    const { order } = exchange.order.parse({ rawOrder: rawOrderRequest })

    // validating
    expect(order).to.exist

    expect(order.id).to.be.eq(orderId.toString())
    expect(order.symbolPair).to.be.eq(symbol.toString())
    expect(order.exchangeId).to.be.eq(exchange.id)
    expect(order.baseSymbolId).to.be.eq(baseAsset)
    expect(order.quoteSymbolId).to.be.eq(quoteAsset)
    expect(order.account).to.be.eq(AlunaAccountEnum.EXCHANGE)
    expect(order.rate).to.be.eq(rate)
    expect(order.status).to.be.eq(orderStatus)
    expect(order.side).to.be.eq(orderSide)
    expect(order.type).to.be.eq(orderType)
    expect(order.canceledAt?.getTime()).to.be.eq(canceledAt.getTime())

  })

  it('should parse a Binance canceled raw order just fine', async () => {

    // preparing data
    const rawOrder = cloneDeep(BINANCE_RAW_ORDERS[0])
    const rawSymbol = BINANCE_RAW_SYMBOLS[0]

    const rawOrderRequest = {
      rawOrder,
      rawSymbol,
    }

    const {
      baseAsset,
      quoteAsset,
    } = rawSymbol


    rawOrder.status = BinanceOrderStatusEnum.FILLED

    const {
      side,
      orderId,
      symbol,
      type,
      status,
      price,
      updateTime,
    } = rawOrder

    const rate = parseFloat(price)

    const filledAt = new Date(updateTime!)

    const orderStatus = translateOrderStatusToAluna({ from: status })
    const orderSide = translateOrderSideToAluna({ from: side })
    const orderType = translateOrderTypeToAluna({ from: type })

    const exchange = new BinanceAuthed({ credentials })

    // mocking

    const { translateSymbolId } = mockTranslateSymbolId()

    translateSymbolId.onFirstCall().returns(baseAsset)
    translateSymbolId.onSecondCall().returns(quoteAsset)

    // executing
    const { order } = exchange.order.parse({ rawOrder: rawOrderRequest })

    // validating
    expect(order).to.exist

    expect(order.id).to.be.eq(orderId.toString())
    expect(order.symbolPair).to.be.eq(symbol.toString())
    expect(order.exchangeId).to.be.eq(exchange.id)
    expect(order.baseSymbolId).to.be.eq(baseAsset)
    expect(order.quoteSymbolId).to.be.eq(quoteAsset)
    expect(order.account).to.be.eq(AlunaAccountEnum.EXCHANGE)
    expect(order.rate).to.be.eq(rate)
    expect(order.status).to.be.eq(orderStatus)
    expect(order.side).to.be.eq(orderSide)
    expect(order.type).to.be.eq(orderType)
    expect(order.filledAt?.getTime()).to.be.eq(filledAt.getTime())

  })

})
