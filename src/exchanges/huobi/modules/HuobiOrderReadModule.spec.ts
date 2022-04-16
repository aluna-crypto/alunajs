import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { IAlunaExchange } from '../../../lib/core/IAlunaExchange'
import { AlunaAccountEnum } from '../../../lib/enums/AlunaAccountEnum'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaOrderSideEnum } from '../../../lib/enums/AlunaOrderSideEnum'
import { AlunaOrderStatusEnum } from '../../../lib/enums/AlunaOrderStatusEnum'
import { AlunaOrderTypesEnum } from '../../../lib/enums/AlunaOrderTypesEnum'
import { IAlunaOrderSchema } from '../../../lib/schemas/IAlunaOrderSchema'
import { HuobiOrderSideEnum } from '../enums/HuobiOrderSideEnum'
import { HuobiOrderStatusEnum } from '../enums/HuobiOrderStatusEnum'
import { HuobiOrderTypeEnum } from '../enums/HuobiOrderTypeEnum'
import { Huobi } from '../Huobi'
import { HuobiHttp } from '../HuobiHttp'
import { PROD_HUOBI_URL } from '../HuobiSpecs'
import { IHuobiMarketWithCurrency } from '../schemas/IHuobiMarketSchema'
import { IHuobiOrderSchema } from '../schemas/IHuobiOrderSchema'
import { HuobiOrderParser } from '../schemas/parsers/HuobiOrderParser'
import { HUOBI_RAW_MARKETS_WITH_CURRENCY } from '../test/fixtures/huobiMarket'
import {
  HUOBI_PARSED_ORDER,
  HUOBI_RAW_ORDER,
} from '../test/fixtures/huobiOrder'
import { HuobiMarketModule } from './HuobiMarketModule'
import { HuobiOrderReadModule } from './HuobiOrderReadModule'



describe('HuobiOrderReadModule', () => {

  const huobiOrderReadModule = HuobiOrderReadModule.prototype

  it('should list all Huobi raw open orders just fine', async () => {

    const huobiRawOrders = [HUOBI_RAW_ORDER]

    ImportMock.mockOther(
      huobiOrderReadModule,
      'exchange',
      {
        keySecret: {
          key: '',
          secret: '',
        },
      } as IAlunaExchange,
    )

    const requestMock = ImportMock.mockFunction(
      HuobiHttp,
      'privateRequest',
      { data: huobiRawOrders, requestCount: 1 },
    )

    const {
      rawOrders,
      requestCount,
    } = await huobiOrderReadModule.listRaw()

    expect(requestCount).to.be.eq(1)

    expect(requestMock.callCount).to.be.eq(1)

    expect(rawOrders.length).to.be.eq(1)

    rawOrders.forEach((order, index) => {

      const {
        price,
        type,
        symbol,
        'created-at': created_at,
        amount,
        id,
        source,
        state,
      } = huobiRawOrders[index]

      expect(order.price).to.be.eq(price)
      expect(order['created-at']).to.be.eq(created_at)
      expect(order.symbol).to.be.eq(symbol)
      expect(order.price).to.be.eq(price)
      expect(order.state).to.be.eq(state)
      expect(order.type).to.be.eq(type)
      expect(order.amount).to.be.eq(amount)
      expect(order.id).to.be.eq(id)
      expect(order.source).to.be.eq(source)

    })

  })

  it('should list all Huobi parsed open orders just fine', async () => {

    const huobiParsedOrders = [HUOBI_PARSED_ORDER]

    const listRawMock = ImportMock.mockFunction(
      huobiOrderReadModule,
      'listRaw',
      { rawOrders: ['raw-orders'], requestCount: 1 },
    )

    const parseManyMock = ImportMock.mockFunction(
      huobiOrderReadModule,
      'parseMany',
      {
        orders: huobiParsedOrders,
        requestCount: 1,
      },
    )

    const { orders: parsedOrders } = await huobiOrderReadModule.list()

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
      } = huobiParsedOrders[index]

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

  it('should get a raw Huobi order just fine', async () => {

    const keySecret = {
      key: '',
      secret: '',
    }

    ImportMock.mockOther(
      huobiOrderReadModule,
      'exchange',
      {
        keySecret,
      } as IAlunaExchange,
    )

    const requestMock = ImportMock.mockFunction(
      HuobiHttp,
      'privateRequest',
      { data: HUOBI_RAW_ORDER, requestCount: 1 },
    )

    const symbolPair = 'symbol'
    const id = 'id'

    const { rawOrder } = await huobiOrderReadModule.getRaw({
      id,
      symbolPair,
    })


    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.args[0][0]).to.includes({
      verb: AlunaHttpVerbEnum.GET,
      url: `${PROD_HUOBI_URL}/v1/order/orders/${id}`,
    })

    expect(rawOrder.type)
      .to.be.eq(`${HuobiOrderSideEnum.SELL}-${HuobiOrderTypeEnum.LIMIT}`)
    expect(rawOrder.state).to.be.eq(HuobiOrderStatusEnum.CREATED)

  })

  it('should get a parsed Huobi order just fine', async () => {

    const rawOrder = HUOBI_RAW_ORDER
    const rawMarket = HUOBI_RAW_MARKETS_WITH_CURRENCY
    const symbolInfo = rawMarket.find((rM) => rM.symbol === rawOrder.symbol)

    const rawOrderMock = ImportMock.mockFunction(
      huobiOrderReadModule,
      'getRaw',
      { rawOrder, requestCount: 1 },
    )

    const marketListRawMock = ImportMock.mockFunction(
      HuobiMarketModule,
      'listRaw',
      {
        rawMarkets: rawMarket,
        requestCount: 1,
      },
    )

    const parseMock = ImportMock.mockFunction(
      huobiOrderReadModule,
      'parse',
      { order: HUOBI_PARSED_ORDER, requestCount: 1 },
    )

    const params = {
      id: 'id',
      symbolPair: 'symbolPair',
    }

    const { order: parsedOrder } = await huobiOrderReadModule.get(params)

    expect(rawOrderMock.callCount).to.be.eq(1)
    expect(rawOrderMock.calledWith(params)).to.be.ok

    expect(marketListRawMock.callCount).to.be.eq(1)

    expect(parseMock.callCount).to.be.eq(1)
    expect(parseMock.calledWith({ rawOrder, symbolInfo })).to.be.ok

    expect(parsedOrder.status).to.be.eq(AlunaOrderStatusEnum.OPEN)
    expect(parsedOrder.type).to.be.eq(AlunaOrderTypesEnum.LIMIT)
    expect(parsedOrder.side).to.be.eq(AlunaOrderSideEnum.SELL)

  })

  it('should parse a Huobi raw order just fine', async () => {

    const rawOrder = HUOBI_RAW_ORDER
    const rawMarket = HUOBI_RAW_MARKETS_WITH_CURRENCY
    const parsedOrder = HUOBI_PARSED_ORDER

    const symbolInfo = rawMarket.find((rM) => rM.symbol === rawOrder.symbol)!

    const parseMock = ImportMock.mockFunction(
      HuobiOrderParser,
      'parse',
      parsedOrder,
    )

    const { order: parseResponse } = await huobiOrderReadModule
      .parse({ rawOrder, symbolInfo })

    expect(parseResponse.symbolPair).to.be.ok
    expect(parseResponse.baseSymbolId).to.be.ok
    expect(parseResponse.quoteSymbolId).to.be.ok
    expect(parseResponse.total).to.be.ok
    expect(parseResponse.amount).to.be.ok
    expect(parseResponse.rate).to.be.ok
    expect(parseResponse.placedAt).to.be.ok

    expect(parseResponse.exchangeId).to.be.eq(Huobi.ID)
    expect(parseResponse.status).to.be.eq(AlunaOrderStatusEnum.OPEN)
    expect(parseResponse.account).to.be.eq(AlunaAccountEnum.EXCHANGE)
    expect(parseResponse.type).to.be.eq(AlunaOrderTypesEnum.LIMIT)
    expect(parseResponse.side).to.be.eq(AlunaOrderSideEnum.SELL)

    expect(parseMock.callCount).to.be.eq(1)
    expect(parseMock.args[0][0]).to.deep.eq({
      rawOrder,
      symbolInfo,
    })

  })

  it('should parse many Huobi orders just fine', async () => {

    const rawOrders: IHuobiOrderSchema[] = [HUOBI_RAW_ORDER]
    const parsedOrders: IAlunaOrderSchema[] = [HUOBI_PARSED_ORDER]
    const rawMarket:
      IHuobiMarketWithCurrency[] = HUOBI_RAW_MARKETS_WITH_CURRENCY

    const parseMock = ImportMock.mockFunction(
      HuobiOrderParser,
      'parse',
    )

    const listRawMock = ImportMock.mockFunction(
      HuobiMarketModule,
      'listRaw',
      Promise.resolve({
        rawMarkets: rawMarket,
        requestCount: 1,
      }),
    )

    parsedOrders.forEach((parsed, index) => {

      parseMock.onCall(index).returns(Promise.resolve(parsed))

    })

    const { orders: parsedManyResp } = await huobiOrderReadModule.parseMany(
      { rawOrders },
    )

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

  it('should return early if parseMany is called without open orders',
    async () => {

      const rawOrders: IHuobiOrderSchema[] = []

      const parseMock = ImportMock.mockFunction(
        HuobiOrderParser,
        'parse',
      )

      const listRawMock = ImportMock.mockFunction(
        HuobiMarketModule,
        'listRaw',
      )

      const { orders: parsedManyResp } = await huobiOrderReadModule.parseMany(
        { rawOrders },
      )

      expect(parsedManyResp.length).to.be.eq(0)
      expect(parseMock.callCount).to.be.eq(0)

      expect(listRawMock.callCount).to.be.eq(0)

    })

})
