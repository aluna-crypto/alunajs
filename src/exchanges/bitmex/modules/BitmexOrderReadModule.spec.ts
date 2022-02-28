import { expect } from 'chai'
import {
  each,
  map,
} from 'lodash'
import { ImportMock } from 'ts-mock-imports'

import { mockExchangeModule } from '../../../../test/utils/exchange/mocks'
import { mockPrivateHttpRequest } from '../../../../test/utils/http/mocks'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaGenericErrorCodes } from '../../../lib/errors/AlunaGenericErrorCodes'
import { AlunaOrderErrorCodes } from '../../../lib/errors/AlunaOrderErrorCodes'
import { BitmexHttp } from '../BitmexHttp'
import { PROD_BITMEX_URL } from '../BitmexSpecs'
import { BitmexOrderParser } from '../schemas/parsers/BitmexOrderParser'
import { BITMEX_PARSED_MARKETS } from '../test/bitmexMarkets'
import {
  BITMEX_PARSED_ORDERS,
  BITMEX_RAW_ORDERS,
} from '../test/bitmexOrders'
import { BitmexMarketModule } from './BitmexMarketModule'
import { BitmexOrderReadModule } from './BitmexOrderReadModule'



describe('BitmexOrderReadModule', () => {

  const bitmexOrderReadModule = BitmexOrderReadModule.prototype

  it('should list Bitmex raw orders just fine', async () => {

    const { exchangeMock } = mockExchangeModule({
      module: bitmexOrderReadModule,
    })

    const { requestMock } = mockPrivateHttpRequest({
      exchangeHttp: BitmexHttp,
      requestResponse: Promise.resolve(BITMEX_RAW_ORDERS),
    })

    const rawBalances = await bitmexOrderReadModule.listRaw()

    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.args[0][0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.GET,
      url: `${PROD_BITMEX_URL}/order`,
      keySecret: exchangeMock.getValue().keySecret,
      body: { filter: { open: true } },
    })

    expect(rawBalances.length).to.be.eq(BITMEX_RAW_ORDERS.length)
    expect(rawBalances).to.deep.eq(BITMEX_RAW_ORDERS)

  })



  it('should list Bitmex parsed orders just fine', async () => {

    const rawOrders = BITMEX_RAW_ORDERS

    const listRawMock = ImportMock.mockFunction(
      bitmexOrderReadModule,
      'listRaw',
      Promise.resolve(rawOrders),
    )

    const parseManyMock = ImportMock.mockFunction(
      bitmexOrderReadModule,
      'parseMany',
      BITMEX_PARSED_ORDERS,
    )

    const parsedOrders = await bitmexOrderReadModule.list()

    expect(listRawMock.callCount).to.be.eq(1)

    expect(parseManyMock.callCount).to.be.eq(1)
    expect(parseManyMock.args[0][0]).to.deep.eq({
      rawOrders,
    })

    expect(parsedOrders.length).to.be.eq(BITMEX_PARSED_ORDERS.length)

  })

  it('should get a Bitmex raw order just fine', async () => {

    const { exchangeMock } = mockExchangeModule({
      module: bitmexOrderReadModule,
    })


    const rawOrder = BITMEX_RAW_ORDERS[0]

    const { requestMock } = mockPrivateHttpRequest({
      exchangeHttp: BitmexHttp,
      requestResponse: Promise.resolve([rawOrder]),
    })

    const symbolPair = rawOrder.symbol
    const id = rawOrder.orderID

    const orderResponse = await bitmexOrderReadModule.getRaw({
      id,
      symbolPair,
    })

    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.args[0][0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.GET,
      url: `${PROD_BITMEX_URL}/order`,
      keySecret: exchangeMock.getValue().keySecret,
      body: { filter: { orderID: id } },
    })

    expect(rawOrder).to.deep.eq(orderResponse)

  })

  it('should throw error if Bitmex raw order is not found', async () => {

    let result
    let error

    const { exchangeMock } = mockExchangeModule({
      module: bitmexOrderReadModule,
    })

    const { requestMock } = mockPrivateHttpRequest({
      exchangeHttp: BitmexHttp,
      requestResponse: Promise.resolve([]),
    })

    const symbolPair = 'XBTBTC'
    const id = 'orderId'

    try {

      result = await bitmexOrderReadModule.getRaw({
        id,
        symbolPair,
      })

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok

    expect(error.code).to.be.eq(AlunaOrderErrorCodes.NOT_FOUND)
    expect(error.message).to.be.eq(`Order not found for id: ${id}`)

    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.args[0][0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.GET,
      url: `${PROD_BITMEX_URL}/order`,
      keySecret: exchangeMock.getValue().keySecret,
      body: { filter: { orderID: id } },
    })

  })

  it('should get a Bitmex parsed order just fine', async () => {

    const rawOrder = BITMEX_RAW_ORDERS[0]
    const parsedOrder = BITMEX_PARSED_ORDERS[0]

    const rawOrderMock = ImportMock.mockFunction(
      bitmexOrderReadModule,
      'getRaw',
      rawOrder,
    )

    const parseMock = ImportMock.mockFunction(
      bitmexOrderReadModule,
      'parse',
      parsedOrder,
    )

    const params = {
      id: 'id',
      symbolPair: 'symbolPair',
    }

    const orderResponse = await bitmexOrderReadModule.get(params)

    expect(rawOrderMock.callCount).to.be.eq(1)
    expect(rawOrderMock.calledWith(params)).to.be.ok

    expect(parseMock.callCount).to.be.eq(1)
    expect(parseMock.args[0][0]).to.deep.eq({
      rawOrder,
    })

    expect(parsedOrder).to.deep.eq(orderResponse)

  })

  it('should parse a Bitmex raw order just fine', async () => {

    const parsedMarket = BITMEX_PARSED_MARKETS[0]

    const bitmexMarketModule = ImportMock.mockFunction(
      BitmexMarketModule,
      'get',
      Promise.resolve(parsedMarket),
    )

    const bitmexOrderParserMock = ImportMock.mockFunction(
      BitmexOrderParser,
      'parse',
    )

    each(BITMEX_PARSED_ORDERS, (parsedOrder, i) => {

      bitmexOrderParserMock.onCall(i).returns(parsedOrder)

    })

    const promises = map(BITMEX_RAW_ORDERS, async (rawOrder, i) => {

      const orderResponse = await bitmexOrderReadModule.parse({
        rawOrder,
      })

      expect(bitmexMarketModule.args[i][0]).to.deep.eq({
        symbolPair: rawOrder.symbol,
      })

      expect(bitmexOrderParserMock.returned(orderResponse)).to.be.ok

    })

    await Promise.all(promises)

    expect(bitmexMarketModule.callCount).to.be.eq(BITMEX_RAW_ORDERS.length)
    expect(bitmexOrderParserMock.callCount).to.be.eq(BITMEX_RAW_ORDERS.length)

  })

  it('should throw error if market is not found for order symbol', async () => {

    let error
    let result

    const rawOrder = BITMEX_RAW_ORDERS[0]

    const bitmexMarketModule = ImportMock.mockFunction(
      BitmexMarketModule,
      'get',
      Promise.resolve(undefined),
    )

    const bitmexOrderParserMock = ImportMock.mockFunction(
      BitmexOrderParser,
      'parse',
    )

    try {

      result = await bitmexOrderReadModule.parse({
        rawOrder,
      })

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok

    expect(error.code).to.be.eq(AlunaGenericErrorCodes.PARAM_ERROR)
    expect(error.message)
      .to.be.eq(`Bitmex symbol pair not found for ${rawOrder.symbol}`)

    expect(bitmexMarketModule.callCount).to.be.eq(1)
    expect(bitmexMarketModule.args[0][0]).to.deep.eq({
      symbolPair: rawOrder.symbol,
    })

    expect(bitmexOrderParserMock.callCount).to.be.eq(0)

  })

  it('should parse Bitmex many raw orders just fine', async () => {

    const rawOrders = BITMEX_RAW_ORDERS
    const parsedOrders = BITMEX_PARSED_ORDERS.slice(0, rawOrders.length)

    const parseMock = ImportMock.mockFunction(
      bitmexOrderReadModule,
      'parse',
    )

    each(parsedOrders, (parsedOrder, i) => {

      parseMock.onCall(i).returns(parsedOrder)

    })

    const parseOrderResponse = await bitmexOrderReadModule.parseMany({
      rawOrders,
    })

    expect(parseMock.callCount).to.be.eq(parsedOrders.length)
    expect(parseOrderResponse).to.deep.eq(parsedOrders)

  })

})
