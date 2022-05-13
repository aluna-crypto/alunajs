import { expect } from 'chai'
import { cloneDeep } from 'lodash'
import { ImportMock } from 'ts-mock-imports'

import { PARSED_ORDERS } from '../../../../../../test/fixtures/parsedOrders'
import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { mockGet } from '../../../../../../test/mocks/exchange/modules/mockGet'
import { AlunaError } from '../../../../../lib/core/AlunaError'
import { AlunaOrderStatusEnum } from '../../../../../lib/enums/AlunaOrderStatusEnum'
import { AlunaOrderErrorCodes } from '../../../../../lib/errors/AlunaOrderErrorCodes'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { executeAndCatch } from '../../../../../utils/executeAndCatch'
import { PoloniexAuthed } from '../../../PoloniexAuthed'
import { PoloniexHttp } from '../../../PoloniexHttp'
import { getPoloniexEndpoints } from '../../../poloniexSpecs'
import { POLONIEX_RAW_ORDERS } from '../../../test/fixtures/poloniexOrders'
import * as getMod from './get'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should cancel a Poloniex order just fine', async () => {

    // preparing data
    const mockedRawOrder = POLONIEX_RAW_ORDERS[0]
    const mockedParsedOrder = cloneDeep(PARSED_ORDERS[0])

    const { orderNumber: id } = mockedRawOrder

    const body = new URLSearchParams()

    body.append('command', 'cancelOrder')
    body.append('orderNumber', id)
    body.append('nonce', '123456')

    // mocking

    ImportMock.mockFunction(
      Date.prototype,
      'getTime',
      123456,
    )

    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: PoloniexHttp.prototype })

    const { get } = mockGet({ module: getMod })

    get.returns({ order: mockedParsedOrder })

    authedRequest.returns(Promise.resolve(true))

    // executing
    const exchange = new PoloniexAuthed({ credentials })

    const { order } = await exchange.order.cancel({
      id,
      symbolPair: '',
    })


    // validating
    mockedParsedOrder.status = AlunaOrderStatusEnum.CANCELED

    expect(order).to.deep.eq(mockedParsedOrder)

    expect(authedRequest.callCount).to.be.eq(1)

    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      credentials,
      url: getPoloniexEndpoints(exchange.settings).order.cancel,
      body,
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

  it('should throw an error when canceling a Poloniex order', async () => {

    // preparing data
    const id = 'id'

    const body = new URLSearchParams()

    body.append('command', 'cancelOrder')
    body.append('orderNumber', id)
    body.append('nonce', '123456')

    // mocking

    ImportMock.mockFunction(
      Date.prototype,
      'getTime',
      123456,
    )

    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: PoloniexHttp.prototype })

    const { get } = mockGet({ module: getMod })

    get.returns({ order: true })

    const error = new AlunaError({
      code: AlunaOrderErrorCodes.CANCEL_FAILED,
      message: 'Something went wrong, order not canceled',
      httpStatusCode: 401,
      metadata: {},
    })

    authedRequest.returns(Promise.reject(error))

    // executing
    const exchange = new PoloniexAuthed({ credentials })

    const { error: responseError } = await executeAndCatch(
      () => exchange.order.cancel({
        id,
        symbolPair: 'symbolPair',
      }),
    )


    // validating
    expect(responseError).to.deep.eq(error)

    expect(authedRequest.callCount).to.be.eq(1)

    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      credentials,
      url: getPoloniexEndpoints(exchange.settings).order.cancel,
      body,
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

})
