import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { mockHttp } from '../../../../../../../test/mocks/exchange/Http'
import { AlunaError } from '../../../../../../lib/core/AlunaError'
import { AlunaOrderErrorCodes } from '../../../../../../lib/errors/AlunaOrderErrorCodes'
import { IAlunaCredentialsSchema } from '../../../../../../lib/schemas/IAlunaCredentialsSchema'
import { executeAndCatch } from '../../../../../../utils/executeAndCatch'
import { PoloniexAuthed } from '../../../../PoloniexAuthed'
import { PoloniexHttp } from '../../../../PoloniexHttp'
import { getPoloniexEndpoints } from '../../../../poloniexSpecs'
import { POLONIEX_RAW_ORDER_INFO } from '../../../../test/fixtures/poloniexOrders'
import * as fetchOrderStatusMod from './fetchOrderStatus'



describe(__filename, () => {

  const {
    fetchOrderStatus,
  } = fetchOrderStatusMod

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

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
    expect(error?.httpStatusCode).to.be.eq(200)

  })

})
