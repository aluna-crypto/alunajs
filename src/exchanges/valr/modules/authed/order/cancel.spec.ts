import { expect } from 'chai'
import { filter } from 'lodash'

import { PARSED_ORDERS } from '../../../../../../test/fixtures/parsedOrders'
import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { mockParse } from '../../../../../../test/mocks/exchange/modules/mockParse'
import { mockOrderGetRaw } from '../../../../../../test/mocks/exchange/modules/order/mockOrderGetRaw'
import { AlunaError } from '../../../../../lib/core/AlunaError'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaOrderErrorCodes } from '../../../../../lib/errors/AlunaOrderErrorCodes'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { executeAndCatch } from '../../../../../utils/executeAndCatch'
import { ValrOrderStatusEnum } from '../../../enums/ValrOrderStatusEnum'
import {
  VALR_RAW_GET_ORDERS,
  VALR_RAW_ORDERS,
} from '../../../test/fixtures/valrOrders'
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
    const canceledOrder = filter(
      VALR_RAW_GET_ORDERS,
      { orderStatusType: ValrOrderStatusEnum.CANCELLED },
    )[0]
    const mockedParsedOrder = PARSED_ORDERS[0]

    const { orderId: id } = canceledOrder


    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: ValrHttp.prototype })

    const { getRaw } = mockOrderGetRaw({ module: getRawMod })
    const { parse } = mockParse({ module: parseMod })

    parse.returns({ order: mockedParsedOrder })
    getRaw.returns({ rawOrder: canceledOrder })

    authedRequest.returns(Promise.resolve(canceledOrder))


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

  it('should throw an error when canceling a Valr order', async () => {

    // preparing data
    const id = 'id'

    const canceledOrder = filter(
      VALR_RAW_ORDERS,
      { status: ValrOrderStatusEnum.CANCELLED },
    )[0]

    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: ValrHttp.prototype })

    const error = new AlunaError({
      code: AlunaOrderErrorCodes.CANCEL_FAILED,
      message: 'Something went wrong, order not canceled',
      httpStatusCode: 500,
      metadata: canceledOrder,
    })

    const { getRaw } = mockOrderGetRaw({ module: getRawMod })

    getRaw.returns(Promise.resolve({ rawOrder: canceledOrder }))
    authedRequest.returns(Promise.resolve({}))


    // executing
    const exchange = new ValrAuthed({ credentials })

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
