import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { AlunaError } from '../../../../../lib/core/AlunaError'
import { AlunaOrderTypesEnum } from '../../../../../lib/enums/AlunaOrderTypesEnum'
import { AlunaOrderErrorCodes } from '../../../../../lib/errors/AlunaOrderErrorCodes'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { executeAndCatch } from '../../../../../utils/executeAndCatch'
import { PoloniexOrderStatusEnum } from '../../../enums/PoloniexOrderStatusEnum'
import { PoloniexAuthed } from '../../../PoloniexAuthed'
import { PoloniexHttp } from '../../../PoloniexHttp'
import {
  POLONIEX_RAW_ORDER_INFO,
  POLONIEX_RAW_ORDER_STATUS_INFO,
} from '../../../test/fixtures/poloniexOrders'
import * as fetchOrderStatusMod from './helpers/fetchOrderStatus'
import * as fetchOrderTradesMod from './helpers/fetchOrderTrades'



describe(__filename, () => {

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
      fetchOrderStatusMod,
      'fetchOrderStatus',
      mockedRawOrder,
    )

    const http = new PoloniexHttp({ })

    // executing
    const exchange = new PoloniexAuthed({ credentials })

    const { rawOrder } = await exchange.order.getRaw({
      id,
      symbolPair: '',
      type: AlunaOrderTypesEnum.LIMIT,
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
      fetchOrderStatusMod,
      'fetchOrderStatus',
      Promise.reject(),
    )

    const fetchOrderTradesMock = ImportMock.mockFunction(
      fetchOrderTradesMod,
      'fetchOrderTrades',
      [mockedRawOrder],
    )

    const http = new PoloniexHttp({ })

    // executing
    const exchange = new PoloniexAuthed({ credentials })

    const { rawOrder } = await exchange.order.getRaw({
      id,
      symbolPair: '',
      type: AlunaOrderTypesEnum.LIMIT,
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
      fetchOrderStatusMod,
      'fetchOrderStatus',
      Promise.reject(),
    )

    const fetchOrderTradesMock = ImportMock.mockFunction(
      fetchOrderTradesMod,
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
        type: AlunaOrderTypesEnum.LIMIT,
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
      fetchOrderStatusMod,
      'fetchOrderStatus',
      Promise.reject(),
    )

    const alunaError = new AlunaError({
      code: '',
      message: 'dummy',
    })

    const fetchOrderTradesMock = ImportMock.mockFunction(
      fetchOrderTradesMod,
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
        type: AlunaOrderTypesEnum.LIMIT,
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

})
