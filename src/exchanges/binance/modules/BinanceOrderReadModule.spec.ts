import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { IAlunaExchange } from '../../../lib/core/IAlunaExchange'
import { AlunaAccountEnum } from '../../../lib/enums/AlunaAccountEnum'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaOrderSideEnum } from '../../../lib/enums/AlunaOrderSideEnum'
import { AlunaOrderStatusEnum } from '../../../lib/enums/AlunaOrderStatusEnum'
import { AlunaOrderTypesEnum } from '../../../lib/enums/AlunaOrderTypesEnum'
import { IAlunaOrderSchema } from '../../../lib/schemas/IAlunaOrderSchema'
import { Binance } from '../Binance'
import { BinanceHttp } from '../BinanceHttp'
import { PROD_BINANCE_URL } from '../BinanceSpecs'
import { BinanceOrderStatusEnum } from '../enums/BinanceOrderStatusEnum'
import { BinanceOrderTypeEnum } from '../enums/BinanceOrderTypeEnum'
import { BinanceSideEnum } from '../enums/BinanceSideEnum'
import { IBinanceMarketWithCurrency } from '../schemas/IBinanceMarketSchema'
import { IBinanceOrderSchema } from '../schemas/IBinanceOrderSchema'
import { BinanceOrderParser } from '../schemas/parses/BinanceOrderParser'
import { BINANCE_RAW_MARKETS_WITH_CURRENCY } from '../test/fixtures/binanceMarket'
import {
  BINANCE_PARSED_ORDER,
  BINANCE_RAW_ORDER,
} from '../test/fixtures/binanceOrder'
import { BinanceMarketModule } from './BinanceMarketModule'
import { BinanceOrderReadModule } from './BinanceOrderReadModule'



describe('BinanceOrderReadModule', () => {

  const binanceOrderReadModule = BinanceOrderReadModule.prototype

  it('should list all Binance raw open orders just fine', async () => {

    const binanceRawOrders = [BINANCE_RAW_ORDER]

    ImportMock.mockOther(
      binanceOrderReadModule,
      'exchange',
      {
        keySecret: {
          key: '',
          secret: '',
        },
      } as IAlunaExchange,
    )

    const requestMock = ImportMock.mockFunction(
      BinanceHttp,
      'privateRequest',
      binanceRawOrders,
    )

    const rawOrders = await binanceOrderReadModule.listRaw()

    expect(requestMock.callCount).to.be.eq(1)

    expect(rawOrders.length).to.be.eq(1)

    rawOrders.forEach((order, index) => {

      const {
        orderId,
        price,
        side,
        status,
        timeInForce,
        type,
        stopPrice,
        clientOrderId,
        cummulativeQuoteQty,
        executedQty,
        icebergQty,
        isWorking,
        orderListId,
        origQty,
        origQuoteOrderQty,
        symbol,
        time,
        updateTime,
      } = binanceRawOrders[index]

      expect(order.orderId).to.be.eq(orderId)
      expect(order.clientOrderId).to.be.eq(clientOrderId)
      expect(order.cummulativeQuoteQty).to.be.eq(cummulativeQuoteQty)
      expect(order.origQuoteOrderQty).to.be.eq(origQuoteOrderQty)
      expect(order.symbol).to.be.eq(symbol)
      expect(order.time).to.be.eq(time)
      expect(order.updateTime).to.be.eq(updateTime)
      expect(order.executedQty).to.be.eq(executedQty)
      expect(order.icebergQty).to.be.eq(icebergQty)
      expect(order.price).to.be.eq(price)
      expect(order.isWorking).to.be.eq(isWorking)
      expect(order.side).to.be.eq(side)
      expect(order.status).to.be.eq(status)
      expect(order.timeInForce).to.be.eq(timeInForce)
      expect(order.type).to.be.eq(type)
      expect(order.orderListId).to.be.eq(orderListId)
      expect(order.origQty).to.be.eq(origQty)
      expect(order.stopPrice).to.be.eq(stopPrice)

    })

  })

  it('should list all Binance parsed open orders just fine', async () => {

    const binanceParsedOrders = [BINANCE_PARSED_ORDER]

    const listRawMock = ImportMock.mockFunction(
      binanceOrderReadModule,
      'listRaw',
      ['raw-orders'],
    )

    const parseManyMock = ImportMock.mockFunction(
      binanceOrderReadModule,
      'parseMany',
      binanceParsedOrders,
    )

    const parsedOrders = await binanceOrderReadModule.list()

    expect(listRawMock.callCount).to.be.eq(1)

    expect(parseManyMock.callCount).to.be.eq(1)

    expect(parsedOrders.length).to.be.eq(1)

    parsedOrders.forEach((order, index) => {

      const {
        account,
        amount,
        id,
        placedAt,
        side,
        status,
        symbolPair,
        total,
        type,
        rate,
      } = binanceParsedOrders[index]

      expect(order.id).to.be.eq(id)
      expect(order.account).to.be.eq(account)
      expect(order.amount).to.be.eq(amount)
      expect(order.placedAt).to.be.eq(placedAt)
      expect(order.side).to.be.eq(side)
      expect(order.status).to.be.eq(status)
      expect(order.symbolPair).to.be.eq(symbolPair)
      expect(order.total).to.be.eq(total)
      expect(order.type).to.be.eq(type)
      expect(order.rate).to.be.eq(rate)

    })

  })

  it('should get a raw Binance order just fine', async () => {

    const keySecret = {
      key: '',
      secret: '',
    }

    ImportMock.mockOther(
      binanceOrderReadModule,
      'exchange',
      {
        keySecret,
      } as IAlunaExchange,
    )

    const requestMock = ImportMock.mockFunction(
      BinanceHttp,
      'privateRequest',
      BINANCE_RAW_ORDER,
    )

    const symbolPair = 'symbol'
    const id = 'id'

    const rawOrder = await binanceOrderReadModule.getRaw({
      id,
      symbolPair,
    })


    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.args[0][0]).to.includes({
      verb: AlunaHttpVerbEnum.GET,
      url: `${PROD_BINANCE_URL}/api/v3/order`,
    })

    expect(rawOrder.type).to.be.eq(BinanceOrderTypeEnum.LIMIT)
    expect(rawOrder.status).to.be.eq(BinanceOrderStatusEnum.NEW)
    expect(rawOrder.side).to.be.eq(BinanceSideEnum.BUY)

  })

  it('should get a parsed Binance order just fine', async () => {

    const rawOrder = BINANCE_RAW_ORDER
    const rawMarket = BINANCE_RAW_MARKETS_WITH_CURRENCY
    const symbolInfo = rawMarket.find((rM) => rM.symbol === rawOrder.symbol)

    const rawOrderMock = ImportMock.mockFunction(
      binanceOrderReadModule,
      'getRaw',
      rawOrder,
    )

    const marketListRawMock = ImportMock.mockFunction(
      BinanceMarketModule,
      'listRaw',
      rawMarket,
    )

    const parseMock = ImportMock.mockFunction(
      binanceOrderReadModule,
      'parse',
      BINANCE_PARSED_ORDER,
    )

    const params = {
      id: 'id',
      symbolPair: 'symbolPair',
    }

    const parsedOrder = await binanceOrderReadModule.get(params)

    expect(rawOrderMock.callCount).to.be.eq(1)
    expect(rawOrderMock.calledWith(params)).to.be.ok

    expect(marketListRawMock.callCount).to.be.eq(1)

    expect(parseMock.callCount).to.be.eq(1)
    expect(parseMock.calledWith({ rawOrder, symbolInfo })).to.be.ok

    expect(parsedOrder.status).to.be.eq(AlunaOrderStatusEnum.OPEN)
    expect(parsedOrder.type).to.be.eq(AlunaOrderTypesEnum.LIMIT)
    expect(parsedOrder.side).to.be.eq(AlunaOrderSideEnum.BUY)

  })

  it('should parse a Binance raw order just fine', async () => {

    const rawOrder = BINANCE_RAW_ORDER
    const rawMarket = BINANCE_RAW_MARKETS_WITH_CURRENCY
    const parsedOrder = BINANCE_PARSED_ORDER

    const symbolInfo = rawMarket.find((rM) => rM.symbol === rawOrder.symbol)!

    const parseMock = ImportMock.mockFunction(
      BinanceOrderParser,
      'parse',
      parsedOrder,
    )

    const parseResponse = await binanceOrderReadModule
      .parse({ rawOrder, symbolInfo })

    expect(parseResponse.symbolPair).to.be.ok
    expect(parseResponse.baseSymbolId).to.be.ok
    expect(parseResponse.quoteSymbolId).to.be.ok
    expect(parseResponse.total).to.be.ok
    expect(parseResponse.amount).to.be.ok
    expect(parseResponse.rate).to.be.ok
    expect(parseResponse.placedAt).to.be.ok

    expect(parseResponse.exchangeId).to.be.eq(Binance.ID)
    expect(parseResponse.status).to.be.eq(AlunaOrderStatusEnum.OPEN)
    expect(parseResponse.account).to.be.eq(AlunaAccountEnum.EXCHANGE)
    expect(parseResponse.type).to.be.eq(AlunaOrderTypesEnum.LIMIT)
    expect(parseResponse.side).to.be.eq(AlunaOrderSideEnum.BUY)

    expect(parseMock.callCount).to.be.eq(1)
    expect(parseMock.args[0][0]).to.deep.eq({
      rawOrder,
      symbolInfo,
    })

  })

  it('should parse many Binance orders just fine', async () => {

    const rawOrders: IBinanceOrderSchema[] = [BINANCE_RAW_ORDER]
    const parsedOrders: IAlunaOrderSchema[] = [BINANCE_PARSED_ORDER]
    const rawMarket:
      IBinanceMarketWithCurrency[] = BINANCE_RAW_MARKETS_WITH_CURRENCY

    const parseMock = ImportMock.mockFunction(
      BinanceOrderParser,
      'parse',
    )

    const listRawMock = ImportMock.mockFunction(
      BinanceMarketModule,
      'listRaw',
      Promise.resolve(rawMarket),
    )

    parsedOrders.forEach((parsed, index) => {

      parseMock.onCall(index).returns(Promise.resolve(parsed))

    })

    const parsedManyResp = await binanceOrderReadModule.parseMany({ rawOrders })

    expect(parsedManyResp.length).to.be.eq(1)
    expect(parseMock.callCount).to.be.eq(1)

    expect(listRawMock.callCount).to.be.eq(1)

    parsedManyResp.forEach((parsed, index) => {

      expect(parsed).to.deep.eq(parsedOrders[index])
      expect(parseMock.calledWith({
        rawOrders: parsed,
      }))

    })

  })

})
