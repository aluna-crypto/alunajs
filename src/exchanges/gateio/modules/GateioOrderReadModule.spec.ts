import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { IAlunaOrderSchema } from '../../..'
import { IAlunaExchange } from '../../../lib/core/IAlunaExchange'
import { AlunaAccountEnum } from '../../../lib/enums/AlunaAccountEnum'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaOrderStatusEnum } from '../../../lib/enums/AlunaOrderStatusEnum'
import { AlunaOrderTypesEnum } from '../../../lib/enums/AlunaOrderTypesEnum'
import { AlunaSideEnum } from '../../../lib/enums/AlunaSideEnum'
import { GateioOrderStatusEnum } from '../enums/GateioOrderStatusEnum'
import { GateioOrderTypeEnum } from '../enums/GateioOrderTypeEnum'
import { GateioSideEnum } from '../enums/GateioSideEnum'
import { Gateio } from '../Gateio'
import { GateioHttp } from '../GateioHttp'
import { PROD_GATEIO_URL } from '../GateioSpecs'
import { IGateioOrderSchema } from '../schemas/IGateioOrderSchema'
import { GateioOrderParser } from '../schemas/parsers/GateioOrderParser'
import {
  GATEIO_PARSED_ORDER,
  GATEIO_RAW_ORDER,
} from '../test/fixtures/gateioOrder'
import { GateioOrderReadModule } from './GateioOrderReadModule'



describe('GateioOrderReadModule', () => {

  const gateioOrderReadModule = GateioOrderReadModule.prototype

  it('should list all Gateio raw open orders just fine', async () => {

    const gateioRawOrders = [GATEIO_RAW_ORDER]

    ImportMock.mockOther(
      gateioOrderReadModule,
      'exchange',
      {
        keySecret: {
          key: '',
          secret: '',
        },
      } as IAlunaExchange,
    )

    const requestMock = ImportMock.mockFunction(
      GateioHttp,
      'privateRequest',
      [
        {
          orders: gateioRawOrders,
        },
      ],
    )

    const rawOrders = await gateioOrderReadModule.listRaw()

    expect(requestMock.callCount).to.be.eq(1)

    expect(rawOrders.length).to.be.eq(1)

    rawOrders.forEach((order, index) => {

      const {
        price,
        side,
        status,
        type,
        account,
        amount,
        create_time,
        create_time_ms,
        currency_pair,
        fee,
        fee_currency,
        fill_price,
        filled_total,
        gt_discount,
        gt_fee,
        iceberg,
        id,
        left,
        point_fee,
        rebated_fee,
        rebated_fee_currency,
        text,
        time_in_force,
        update_time,
        update_time_ms,
      } = gateioRawOrders[index]

      expect(order.price).to.be.eq(price)
      expect(order.account).to.be.eq(account)
      expect(order.create_time).to.be.eq(create_time)
      expect(order.create_time_ms).to.be.eq(create_time_ms)
      expect(order.fee).to.be.eq(fee)
      expect(order.fee_currency).to.be.eq(fee_currency)
      expect(order.amount).to.be.eq(amount)
      expect(order.currency_pair).to.be.eq(currency_pair)
      expect(order.fill_price).to.be.eq(fill_price)
      expect(order.filled_total).to.be.eq(filled_total)
      expect(order.update_time_ms).to.be.eq(update_time_ms)
      expect(order.update_time).to.be.eq(update_time)
      expect(order.time_in_force).to.be.eq(time_in_force)
      expect(order.text).to.be.eq(text)
      expect(order.rebated_fee).to.be.eq(rebated_fee)
      expect(order.rebated_fee_currency).to.be.eq(rebated_fee_currency)
      expect(order.point_fee).to.be.eq(point_fee)
      expect(order.left).to.be.eq(left)
      expect(order.id).to.be.eq(id)
      expect(order.iceberg).to.be.eq(iceberg)
      expect(order.gt_fee).to.be.eq(gt_fee)
      expect(order.gt_discount).to.be.eq(gt_discount)
      expect(order.side).to.be.eq(side)
      expect(order.status).to.be.eq(status)
      expect(order.type).to.be.eq(type)

    })

  })



  it('should list all Gateio parsed open orders just fine', async () => {

    const gateioParsedOrders = [GATEIO_PARSED_ORDER]

    const listRawMock = ImportMock.mockFunction(
      gateioOrderReadModule,
      'listRaw',
      ['raw-orders'],
    )

    const parseManyMock = ImportMock.mockFunction(
      gateioOrderReadModule,
      'parseMany',
      gateioParsedOrders,
    )

    const parsedOrders = await gateioOrderReadModule.list()

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
      } = gateioParsedOrders[index]

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



  it('should get a raw Gateio order just fine', async () => {

    const keySecret = {
      key: '',
      secret: '',
    }

    ImportMock.mockOther(
      gateioOrderReadModule,
      'exchange',
      {
        keySecret,
      } as IAlunaExchange,
    )

    const requestMock = ImportMock.mockFunction(
      GateioHttp,
      'privateRequest',
      GATEIO_RAW_ORDER,
    )

    const symbolPair = 'symbol'
    const id = 'id'

    const rawOrder = await gateioOrderReadModule.getRaw({
      id,
      symbolPair,
    })

    const query = new URLSearchParams()

    query.append('currency_pair', symbolPair)

    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.args[0][0]).to.includes({
      verb: AlunaHttpVerbEnum.GET,
      url: `${PROD_GATEIO_URL}/spot/orders/${id}?${query.toString()}`,
    })

    expect(rawOrder.type).to.be.eq(GateioOrderTypeEnum.LIMIT)
    expect(rawOrder.status).to.be.eq(GateioOrderStatusEnum.OPEN)
    expect(rawOrder.side).to.be.eq(GateioSideEnum.SELL)

  })



  it('should get a parsed Gateio order just fine', async () => {

    const rawOrderMock = ImportMock.mockFunction(
      gateioOrderReadModule,
      'getRaw',
      'rawOrder',
    )

    const parseMock = ImportMock.mockFunction(
      gateioOrderReadModule,
      'parse',
      GATEIO_PARSED_ORDER,
    )

    const params = {
      id: 'id',
      symbolPair: 'symbolPair',
    }

    const parsedOrder = await gateioOrderReadModule.get(params)

    expect(rawOrderMock.callCount).to.be.eq(1)
    expect(rawOrderMock.calledWith(params)).to.be.ok

    expect(parseMock.callCount).to.be.eq(1)
    expect(parseMock.calledWith({ rawOrder: 'rawOrder' })).to.be.ok

    expect(parsedOrder.status).to.be.eq(AlunaOrderStatusEnum.OPEN)
    expect(parsedOrder.type).to.be.eq(AlunaOrderTypesEnum.LIMIT)
    expect(parsedOrder.side).to.be.eq(AlunaSideEnum.SHORT)

  })



  it('should parse a Gateio raw order just fine', async () => {

    const rawOrder: IGateioOrderSchema = GATEIO_RAW_ORDER

    const parseMock = ImportMock.mockFunction(
      GateioOrderParser,
      'parse',
    )

    parseMock
      .onFirstCall().returns(GATEIO_PARSED_ORDER)

    const parsedOrder1 = await gateioOrderReadModule.parse({ rawOrder })

    expect(parseMock.callCount).to.be.eq(1)
    expect(parseMock.calledWith({ rawOrder })).to.be.ok

    expect(parsedOrder1.symbolPair).to.be.ok
    expect(parsedOrder1.baseSymbolId).to.be.ok
    expect(parsedOrder1.quoteSymbolId).to.be.ok
    expect(parsedOrder1.total).to.be.ok
    expect(parsedOrder1.amount).to.be.ok
    expect(parsedOrder1.rate).to.be.ok
    expect(parsedOrder1.placedAt).to.be.ok


    expect(parsedOrder1.exchangeId).to.be.eq(Gateio.ID)
    expect(parsedOrder1.status).to.be.eq(AlunaOrderStatusEnum.OPEN)
    expect(parsedOrder1.account).to.be.eq(AlunaAccountEnum.EXCHANGE)
    expect(parsedOrder1.type).to.be.eq(AlunaOrderTypesEnum.LIMIT)
    expect(parsedOrder1.side).to.be.eq(AlunaSideEnum.SHORT)

  })



  it('should parse many Gateio orders just fine', async () => {

    const rawOrders: IGateioOrderSchema[] = [GATEIO_RAW_ORDER]
    const parsedOrders: IAlunaOrderSchema[] = [GATEIO_PARSED_ORDER]

    const parseMock = ImportMock.mockFunction(
      GateioOrderParser,
      'parse',
    )

    parsedOrders.forEach((parsed, index) => {

      parseMock.onCall(index).returns(Promise.resolve(parsed))

    })

    const parsedManyResp = await gateioOrderReadModule.parseMany({ rawOrders })

    expect(parsedManyResp.length).to.be.eq(1)
    expect(parseMock.callCount).to.be.eq(1)

    parsedManyResp.forEach((parsed, index) => {

      expect(parsed).to.deep.eq(parsedOrders[index])
      expect(parseMock.calledWith({
        rawOrders: parsed,
      }))

    })

  })

})
