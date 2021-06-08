import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { IAlunaExchange } from '../../../lib/abstracts/IAlunaExchange'
import { AccountEnum } from '../../../lib/enums/AccountEnum'
import { HttpVerbEnum } from '../../../lib/enums/HtttpVerbEnum'
import { OrderStatusEnum } from '../../../lib/enums/OrderStatusEnum'
import { OrderTypesEnum } from '../../../lib/enums/OrderTypeEnum'
import { SideEnum } from '../../../lib/enums/SideEnum'
import { ValrOrderStatusEnum } from '../enums/ValrOrderStatusEnum'
import { ValrOrderTypesEnum } from '../enums/ValrOrderTypesEnum'
import { ValrSideEnum } from '../enums/ValrSideEnum'
import {
  IValrOrderGetSchema,
  IValrOrderListSchema,
} from '../schemas/IValrOrderSchema'
import { ValrOrderParser } from '../schemas/parsers/ValrOrderParser'
import { VALR_SEEDS } from '../test/fixtures'
import { ValrHttp } from '../ValrHttp'
import { ValrOrderReadModule } from './ValrOrderReadModule'



describe('ValrOrderReadModule', () => {

  const valrOrderReadModule = ValrOrderReadModule.prototype

  const { ordersSeeds } = VALR_SEEDS



  it('should list all Valr raw open orders just fine', async () => {

    ImportMock.mockOther(
      valrOrderReadModule,
      'exchange',
      {
        keySecret: {
          key: '',
          secret: '',
        },
      } as IAlunaExchange,
    )

    const requestMock = ImportMock.mockFunction(
      ValrHttp,
      'privateRequest',
      ordersSeeds.rawOrders,
    )

    const rawBalances = await valrOrderReadModule.listRaw()

    expect(requestMock.callCount).to.be.eq(1)

    expect(rawBalances.length).to.be.eq(4)
    expect(rawBalances[0].currencyPair).to.be.eq('ETHZAR')
    expect(rawBalances[1].currencyPair).to.be.eq('BTCZAR')
    expect(rawBalances[2].currencyPair).to.be.eq('ETHZAR')
    expect(rawBalances[3].currencyPair).to.be.eq('ETHZAR')

  })



  it('should list all Valr parsed open orders just fine', async () => {

    const listRawMock = ImportMock.mockFunction(
      valrOrderReadModule,
      'listRaw',
      ['raw-orders'],
    )

    const parseManyMock = ImportMock.mockFunction(
      valrOrderReadModule,
      'parseMany',
      ordersSeeds.parsedOrders,
    )

    const parsedOrders = await valrOrderReadModule.list()

    expect(listRawMock.callCount).to.be.eq(1)

    expect(parseManyMock.callCount).to.be.eq(1)

    expect(parsedOrders.length).to.be.eq(4)

    expect(parsedOrders[0].account).to.be.eq(AccountEnum.EXCHANGE)
    expect(parsedOrders[0].status).to.be.eq(OrderStatusEnum.OPEN)
    expect(parsedOrders[0].side).to.be.eq(SideEnum.LONG)

    expect(parsedOrders[1].account).to.be.eq(AccountEnum.EXCHANGE)
    expect(parsedOrders[1].status).to.be.eq(OrderStatusEnum.OPEN)
    expect(parsedOrders[1].side).to.be.eq(SideEnum.LONG)

    expect(parsedOrders[2].account).to.be.eq(AccountEnum.EXCHANGE)
    expect(parsedOrders[2].status).to.be.eq(OrderStatusEnum.OPEN)
    expect(parsedOrders[2].side).to.be.eq(SideEnum.SHORT)

    expect(parsedOrders[3].account).to.be.eq(AccountEnum.EXCHANGE)
    expect(parsedOrders[3].status).to.be.eq(OrderStatusEnum.OPEN)
    expect(parsedOrders[3].side).to.be.eq(SideEnum.SHORT)

  })



  it('should get a raw Valr order status just fine', async () => {

    const keySecret = {
      key: '',
      secret: '',
    }

    ImportMock.mockOther(
      valrOrderReadModule,
      'exchange',
      {
        keySecret,
      } as IAlunaExchange,
    )

    const requestMock = ImportMock.mockFunction(
      ValrHttp,
      'privateRequest',
      ordersSeeds.rawStatusOrder,
    )


    const symbolPair = 'symbol'
    const id = 'id'


    const rawOrder = await valrOrderReadModule.getRaw({
      id,
      symbolPair,
    })


    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.args[0][0]).to.includes({
      verb: HttpVerbEnum.GET,
      url: `https://api.valr.com/v1/orders/${symbolPair}/orderid/${id}`,
    })

    expect(rawOrder.orderType).to.be.eq(ValrOrderTypesEnum.TAKE_PROFIT_LIMIT)
    expect(rawOrder.orderStatusType).to.be.eq(ValrOrderStatusEnum.ACTIVE)
    expect(rawOrder.orderSide).to.be.eq(ValrSideEnum.BUY)

  })



  it('should get a parsed Valr order just fine', async () => {

    const rawOrderMock = ImportMock.mockFunction(
      valrOrderReadModule,
      'getRaw',
      'rawOrder',
    )

    const parseMock = ImportMock.mockFunction(
      valrOrderReadModule,
      'parse',
      ordersSeeds.parsedOrders[0],
    )

    const params = {
      id: 'id',
      symbolPair: 'symbolPair',
    }

    const parsedOrder = await valrOrderReadModule.get(params)

    expect(rawOrderMock.callCount).to.be.eq(1)
    expect(rawOrderMock.calledWith(params)).to.be.true

    expect(parseMock.callCount).to.be.eq(1)
    expect(parseMock.calledWith({ rawOrder: 'rawOrder' })).to.be.true

    expect(parsedOrder.status).to.be.eq(OrderStatusEnum.OPEN)
    expect(parsedOrder.type).to.be.eq(OrderTypesEnum.TAKE_PROFIT_LIMIT)
    expect(parsedOrder.side).to.be.eq(SideEnum.LONG)

  })



  it('should parse a Valr raw order just fine', () => {

    const rawOrder1: IValrOrderGetSchema = ordersSeeds.rawStatusOrder
    const rawOrder2: IValrOrderListSchema = ordersSeeds.rawOrders[1]

    const parseMock = ImportMock.mockFunction(
      ValrOrderParser,
      'parse',
    )

    parseMock
      .onFirstCall().returns(ordersSeeds.parsedOrders[0])
      .onSecondCall().returns(ordersSeeds.parsedOrders[1])


    const parsedOrder1 = valrOrderReadModule.parse({ rawOrder: rawOrder1 })


    expect(parseMock.callCount).to.be.eq(1)
    expect(parseMock.calledWith({ rawOrder: rawOrder1 })).to.be.true

    expect(parsedOrder1).to.have.property('symbolPair')
    expect(parsedOrder1).to.have.property('total')
    expect(parsedOrder1).to.have.property('amount')
    expect(parsedOrder1).to.have.property('isAmountInContracts')
    expect(parsedOrder1).to.have.property('rate')
    expect(parsedOrder1).to.have.property('placedAt')
    expect(parsedOrder1.status).to.be.eq(OrderStatusEnum.OPEN)
    expect(parsedOrder1.account).to.be.eq(AccountEnum.EXCHANGE)
    expect(parsedOrder1.type).to.be.eq(OrderTypesEnum.TAKE_PROFIT_LIMIT)
    expect(parsedOrder1.side).to.be.eq(SideEnum.LONG)


    const parsedOrder2 = valrOrderReadModule.parse({ rawOrder: rawOrder2 })


    expect(parseMock.callCount).to.be.eq(2)
    expect(parseMock.calledWith({ rawOrder: rawOrder2 })).to.be.true

    expect(parsedOrder2).to.have.property('symbolPair')
    expect(parsedOrder2).to.have.property('total')
    expect(parsedOrder2).to.have.property('amount')
    expect(parsedOrder2).to.have.property('isAmountInContracts')
    expect(parsedOrder2).to.have.property('rate')
    expect(parsedOrder2).to.have.property('placedAt')
    expect(parsedOrder2.status).to.be.eq(OrderStatusEnum.OPEN)
    expect(parsedOrder2.account).to.be.eq(AccountEnum.EXCHANGE)
    expect(parsedOrder2.type).to.be.eq(OrderTypesEnum.LIMIT)
    expect(parsedOrder2.side).to.be.eq(SideEnum.LONG)

  })



  it('should parse many Valr orders just fine', () => {

    const {
      rawOrders, parsedOrders,
    } = ordersSeeds

    const parseMock = ImportMock.mockFunction(
      ValrOrderParser,
      'parse',
    )

    parsedOrders.forEach((parsed, index) => {

      parseMock.onCall(index).returns(parsed)

    })


    const parsedManyResp = valrOrderReadModule.parseMany({ rawOrders })


    expect(rawOrders.length).to.be.eq(4)

    const rawOrdersArgs = rawOrders.map((rawOrder) => ([{ rawOrder }]))
    expect(parseMock.callCount).to.be.eq(4)
    expect(parseMock.args).to.deep.eq(rawOrdersArgs)
    expect(parseMock.returned(parsedOrders[0])).to.be.true

    expect(parsedManyResp.length).to.be.eq(4)

  })



})
