import { expect } from 'chai'
import { cloneDeep } from 'lodash'

import { PARSED_ORDERS } from '../../../../../../test/fixtures/parsedOrders'
import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { mockGetRaw } from '../../../../../../test/mocks/exchange/modules/mockGetRaw'
import { mockParse } from '../../../../../../test/mocks/exchange/modules/mockParse'
import { AlunaError } from '../../../../../lib/core/AlunaError'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaOrderErrorCodes } from '../../../../../lib/errors/AlunaOrderErrorCodes'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { executeAndCatch } from '../../../../../utils/executeAndCatch'
import { ValrOrderStatusEnum } from '../../../enums/ValrOrderStatusEnum'
import { VALR_RAW_GET_RESPONSE_ORDERS } from '../../../test/fixtures/valrOrders'
import { ValrAuthed } from '../../../ValrAuthed'
import { ValrHttp } from '../../../ValrHttp'
import { getValrEndpoints } from '../../../valrSpecs'
import * as getRawMod from './getRaw'
import * as parseMod from './parse'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should cancel a Valr order just fine', async () => {

    // preparing data
    const canceledOrder = cloneDeep(VALR_RAW_GET_RESPONSE_ORDERS[0])
    canceledOrder.orderStatusType = ValrOrderStatusEnum.CANCELLED

    const mockedParsedOrder = PARSED_ORDERS[0]

    const { orderId: id } = canceledOrder


    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: ValrHttp.prototype })
    authedRequest.returns(Promise.resolve())

    const { getRaw } = mockGetRaw({ module: getRawMod })
    const { parse } = mockParse({ module: parseMod })

    parse.returns({ order: mockedParsedOrder })
    getRaw.returns({ rawOrder: { valrOrder: canceledOrder } })


    // executing
    const exchange = new ValrAuthed({ credentials })

    const { order } = await exchange.order.cancel({
      id,
      symbolPair: '',
    })


    // validating
    expect(order).to.deep.eq(mockedParsedOrder)

    expect(authedRequest.callCount).to.be.eq(1)

    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.DELETE,
      credentials,
      url: getValrEndpoints(exchange.settings).order.cancel,
      body: {
        orderId: id,
        pair: '',
      },
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

  it('should throw an error if order was not canceled', async () => {

    // preparing data
    const id = 'id'
    const canceledOrder = cloneDeep(VALR_RAW_GET_RESPONSE_ORDERS[0])
    canceledOrder.orderStatusType = ValrOrderStatusEnum.ACTIVE

    const error = new AlunaError({
      code: AlunaOrderErrorCodes.CANCEL_FAILED,
      message: 'Something went wrong, order not canceled',
      httpStatusCode: 500,
      metadata: canceledOrder,
    })


    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: ValrHttp.prototype })
    authedRequest.returns(Promise.resolve({}))

    const { getRaw } = mockGetRaw({ module: getRawMod })
    getRaw.returns(Promise.resolve({ rawOrder: { valrOrder: canceledOrder } }))


    // executing
    const exchange = new ValrAuthed({ credentials })

    const {
      error: responseError,
    } = await executeAndCatch(() => exchange.order.cancel({
      id,
      symbolPair: 'symbolPair',
    }))


    // validating
    expect(responseError).to.deep.eq(error)

    expect(authedRequest.callCount).to.be.eq(1)

    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.DELETE,
      credentials,
      url: getValrEndpoints(exchange.settings).order.cancel,
      body: {
        orderId: id,
        pair: 'symbolPair',
      },
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

})
