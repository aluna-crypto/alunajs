import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { AlunaError } from '../../../../../lib/core/AlunaError'
import { AlunaOrderErrorCodes } from '../../../../../lib/errors/AlunaOrderErrorCodes'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { executeAndCatch } from '../../../../../utils/executeAndCatch'
import { PoloniexOrderStatusEnum } from '../../../enums/PoloniexOrderStatusEnum'
import { PoloniexAuthed } from '../../../PoloniexAuthed'
import { PoloniexHttp } from '../../../PoloniexHttp'
import { getPoloniexEndpoints } from '../../../poloniexSpecs'
import {
  POLONIEX_RAW_ORDER_INFO,
  POLONIEX_RAW_ORDER_STATUS_INFO,
} from '../../../test/fixtures/poloniexOrders'
import * as getRawMod from './getRaw'



describe(__filename, () => {

  const {
    fetchOrderStatus,
    fetchOrderTrades,
  } = getRawMod

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should get a Poloniex raw order status just fine', async () => {

    // preparing data
    const mockedRawOrder = POLONIEX_RAW_ORDER_STATUS_INFO[0]

    const { orderNumber: id } = mockedRawOrder


    // mocking

    const fetchOrderStatusMock = ImportMock.mockFunction(
      getRawMod,
      'fetchOrderStatus',
      mockedRawOrder,
    )

    const http = new PoloniexHttp({ })

    // executing
    const exchange = new PoloniexAuthed({ credentials })

    const { rawOrder } = await exchange.order.getRaw({
      id,
      symbolPair: '',
    })


    // validating
    expect(rawOrder).to.deep.eq(mockedRawOrder)

    expect(fetchOrderStatusMock.callCount).to.be.eq(1)

    expect(fetchOrderStatusMock.firstCall.args[0]).to.deep.eq({
      id,
      credentials,
      http,
      settings: exchange.settings,
    })

  })

  it('should get a Poloniex raw order trades just fine', async () => {

    // preparing data
    const mockedRawOrder = POLONIEX_RAW_ORDER_INFO[0]

    const { orderNumber: id } = mockedRawOrder


    // mocking

    const fetchOrderStatusMock = ImportMock.mockFunction(
      getRawMod,
      'fetchOrderStatus',
      Promise.reject(),
    )

    const fetchOrderTradesMock = ImportMock.mockFunction(
      getRawMod,
      'fetchOrderTrades',
      [mockedRawOrder],
    )

    const http = new PoloniexHttp({ })

    // executing
    const exchange = new PoloniexAuthed({ credentials })

    const { rawOrder } = await exchange.order.getRaw({
      id,
      symbolPair: '',
    })


    // validating
    expect(rawOrder).to.deep.eq({
      ...mockedRawOrder,
      currencyPair: '',
      status: PoloniexOrderStatusEnum.FILLED,
      orderNumber: id,
    })

    expect(fetchOrderStatusMock.callCount).to.be.eq(1)

    expect(fetchOrderStatusMock.firstCall.args[0]).to.deep.eq({
      id,
      credentials,
      http,
      settings: exchange.settings,
    })

    expect(fetchOrderTradesMock.callCount).to.be.eq(1)

    expect(fetchOrderTradesMock.firstCall.args[0]).to.deep.eq({
      id,
      credentials,
      http,
      settings: exchange.settings,
    })

  })

  it('should throw an error for Poloniex raw order not found', async () => {

    // preparing data
    const mockedRawOrder = POLONIEX_RAW_ORDER_INFO[0]

    const { orderNumber: id } = mockedRawOrder


    // mocking

    const fetchOrderStatusMock = ImportMock.mockFunction(
      getRawMod,
      'fetchOrderStatus',
      Promise.reject(),
    )

    const fetchOrderTradesMock = ImportMock.mockFunction(
      getRawMod,
      'fetchOrderTrades',
      [],
    )

    const http = new PoloniexHttp({ })

    // executing
    const exchange = new PoloniexAuthed({ credentials })


    const { error, result } = await executeAndCatch(
      () => exchange.order.getRaw({
        id,
        symbolPair: '',
      }),
    )

    // validating

    expect(result).not.to.be.ok

    expect(error instanceof AlunaError).to.be.ok
    expect(error?.code).to.be.eq(AlunaOrderErrorCodes.NOT_FOUND)
    expect(error?.message).to.be.eq('Order not found')
    expect(error?.httpStatusCode).to.be.eq(404)

    expect(fetchOrderStatusMock.callCount).to.be.eq(1)

    expect(fetchOrderStatusMock.firstCall.args[0]).to.deep.eq({
      id,
      credentials,
      http,
      settings: exchange.settings,
    })

    expect(fetchOrderTradesMock.callCount).to.be.eq(1)

    expect(fetchOrderTradesMock.firstCall.args[0]).to.deep.eq({
      id,
      credentials,
      http,
      settings: exchange.settings,
    })

  })

  it('should throw an error for Poloniex raw order trade and status not found', async () => {

    // preparing data
    const mockedRawOrder = POLONIEX_RAW_ORDER_INFO[0]

    const { orderNumber: id } = mockedRawOrder


    // mocking

    const fetchOrderStatusMock = ImportMock.mockFunction(
      getRawMod,
      'fetchOrderStatus',
      Promise.reject(),
    )

    const alunaError = new AlunaError({
      code: '',
      message: 'dummy',
    })

    const fetchOrderTradesMock = ImportMock.mockFunction(
      getRawMod,
      'fetchOrderTrades',
      Promise.reject(
        alunaError,
      ),
    )

    const http = new PoloniexHttp({ })

    // executing
    const exchange = new PoloniexAuthed({ credentials })


    const { error, result } = await executeAndCatch(
      () => exchange.order.getRaw({
        id,
        symbolPair: '',
      }),
    )

    // validating

    expect(result).not.to.be.ok

    expect(error instanceof AlunaError).to.be.ok
    expect(error?.code).to.be.eq(AlunaOrderErrorCodes.ORDER_CANCELLED)
    expect(error?.message).to.be.eq('This order is already cancelled')
    expect(error?.httpStatusCode).to.be.eq(422)

    expect(fetchOrderStatusMock.callCount).to.be.eq(1)

    expect(fetchOrderStatusMock.firstCall.args[0]).to.deep.eq({
      id,
      credentials,
      http,
      settings: exchange.settings,
    })

    expect(fetchOrderTradesMock.callCount).to.be.eq(1)

    expect(fetchOrderTradesMock.firstCall.args[0]).to.deep.eq({
      id,
      credentials,
      http,
      settings: exchange.settings,
    })

  })

  it('should throw an error for Poloniex raw order trade not found', async () => {

    // preparing data
    const mockedRawOrder = POLONIEX_RAW_ORDER_INFO[0]

    const { orderNumber: id } = mockedRawOrder


    // mocking

    const http = new PoloniexHttp({ })

    const {
      authedRequest,
    } = mockHttp({ classPrototype: PoloniexHttp.prototype })

    authedRequest.onFirstCall().returns({
      error: 'dummy-error',
    })

    // executing
    const exchange = new PoloniexAuthed({ credentials })

    const { error, result } = await executeAndCatch(
      () => fetchOrderTrades({
        id,
        settings: exchange.settings,
        credentials,
        http,
      }),
    )


    // validating

    expect(result).not.to.be.ok

    expect(error instanceof AlunaError).to.be.ok
    expect(error?.code).to.be.eq(AlunaOrderErrorCodes.NOT_FOUND)
    expect(error?.message).to.be.eq('dummy-error')
    expect(error?.httpStatusCode).to.be.eq(404)

  })

  it('should throw an error for Poloniex raw order status not found', async () => {

    // preparing data
    const mockedRawOrder = POLONIEX_RAW_ORDER_INFO[0]

    const { orderNumber: id } = mockedRawOrder


    // mocking

    const http = new PoloniexHttp({ })

    const {
      authedRequest,
    } = mockHttp({ classPrototype: PoloniexHttp.prototype })

    authedRequest.onFirstCall().returns({
      result: {
        error: 'dummy-error',
      },
    })

    // executing
    const exchange = new PoloniexAuthed({ credentials })

    const { error, result } = await executeAndCatch(
      () => fetchOrderStatus({
        id,
        settings: exchange.settings,
        credentials,
        http,
      }),
    )


    // validating

    expect(result).not.to.be.ok

    expect(error instanceof AlunaError).to.be.ok
    expect(error?.code).to.be.eq(AlunaOrderErrorCodes.NOT_FOUND)
    expect(error?.message).to.be.eq('dummy-error')
    expect(error?.httpStatusCode).to.be.eq(404)

  })


  it('should get a Poloniex raw order status just fine', async () => {

    // preparing data
    const mockedRawOrder = POLONIEX_RAW_ORDER_INFO[0]

    const { orderNumber: id } = mockedRawOrder

    const body = new URLSearchParams()

    body.append('command', 'returnOrderStatus')
    body.append('orderNumber', id)
    body.append('nonce', '123456')

    // mocking

    ImportMock.mockFunction(
      Date.prototype,
      'getTime',
      123456,
    )

    const http = new PoloniexHttp({ })

    const {
      authedRequest,
    } = mockHttp({ classPrototype: PoloniexHttp.prototype })

    authedRequest.onFirstCall().returns({
      result: {
        [`${id}`]: mockedRawOrder,
      },
    })

    // executing
    const exchange = new PoloniexAuthed({ credentials })

    const orderStatus = await fetchOrderStatus({
      id,
      settings: exchange.settings,
      credentials,
      http,
    })

    // validating
    expect(orderStatus).to.deep.eq(mockedRawOrder)

    expect(authedRequest.callCount).to.be.eq(1)

    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      credentials,
      url: getPoloniexEndpoints(exchange.settings).order.get,
      body,
    })

  })

  it('should get a Poloniex raw order trades just fine', async () => {

    // preparing data
    const mockedRawOrder = POLONIEX_RAW_ORDER_INFO[0]

    const { orderNumber: id } = mockedRawOrder

    const body = new URLSearchParams()

    body.append('command', 'returnOrderTrades')
    body.append('orderNumber', id)
    body.append('nonce', '123456')

    // mocking

    ImportMock.mockFunction(
      Date.prototype,
      'getTime',
      123456,
    )

    const http = new PoloniexHttp({ })

    const {
      authedRequest,
    } = mockHttp({ classPrototype: PoloniexHttp.prototype })

    authedRequest.onFirstCall().returns(Promise.resolve([mockedRawOrder]))

    // executing
    const exchange = new PoloniexAuthed({ credentials })

    const orderStatus = await fetchOrderTrades({
      id,
      settings: exchange.settings,
      credentials,
      http,
    })

    // validating
    expect(orderStatus).to.deep.eq([mockedRawOrder])

    expect(authedRequest.callCount).to.be.eq(1)

    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      credentials,
      url: getPoloniexEndpoints(exchange.settings).order.get,
      body,
    })

  })

})
