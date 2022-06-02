import { expect } from 'chai'

import { PARSED_ORDERS } from '../../../../../../test/fixtures/parsedOrders'
import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { mockGet } from '../../../../../../test/mocks/exchange/modules/mockGet'
import { AlunaError } from '../../../../../lib/core/AlunaError'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaOrderTypesEnum } from '../../../../../lib/enums/AlunaOrderTypesEnum'
import { AlunaOrderErrorCodes } from '../../../../../lib/errors/AlunaOrderErrorCodes'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { executeAndCatch } from '../../../../../utils/executeAndCatch'
import { FtxAuthed } from '../../../FtxAuthed'
import { FtxHttp } from '../../../FtxHttp'
import { getFtxEndpoints } from '../../../ftxSpecs'
import {
  FTX_RAW_ORDERS,
  FTX_TRIGGER_RAW_ORDERS,
} from '../../../test/fixtures/ftxOrders'
import * as getMod from './get'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should cancel a Ftx order just fine', async () => {

    // preparing data
    const mockedRawOrder = FTX_RAW_ORDERS[0]
    const mockedParsedOrder = PARSED_ORDERS[0]
    const type = AlunaOrderTypesEnum.LIMIT

    const { id } = mockedRawOrder


    // mocking
    const http = new FtxHttp({})

    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: FtxHttp.prototype })

    const { get } = mockGet({ module: getMod })

    get.returns({ order: mockedParsedOrder })

    authedRequest.returns(Promise.resolve(mockedRawOrder))


    // executing
    const exchange = new FtxAuthed({ credentials })

    const { order } = await exchange.order.cancel({
      id: id.toString(),
      symbolPair: '',
      type,
    })


    // validating
    expect(order).to.deep.eq(mockedParsedOrder)

    expect(authedRequest.callCount).to.be.eq(1)

    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.DELETE,
      credentials,
      url: getFtxEndpoints(exchange.settings).order.cancel(id.toString()),
    })

    expect(publicRequest.callCount).to.be.eq(0)

    expect(get.callCount).to.be.eq(1)
    expect(get.firstCall.args[0]).to.deep.eq({
      id: id.toString(),
      symbolPair: '',
      http,
    })

  })

  it('should cancel a Ftx trigger order just fine', async () => {

    // preparing data
    const rawOrder = FTX_TRIGGER_RAW_ORDERS[0]
    const mockedParsedOrder = PARSED_ORDERS[0]
    const type = AlunaOrderTypesEnum.STOP_MARKET

    const { id } = rawOrder


    // mocking
    const http = new FtxHttp({})

    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: FtxHttp.prototype })
    authedRequest.returns(Promise.resolve(rawOrder))

    const { get } = mockGet({ module: getMod })
    get.returns({ order: mockedParsedOrder })



    // executing
    const exchange = new FtxAuthed({ credentials })
    const { settings } = exchange

    const { order } = await exchange.order.cancel({
      id: id.toString(),
      symbolPair: '',
      type,
    })


    // validating
    expect(order).to.deep.eq(mockedParsedOrder)

    expect(authedRequest.callCount).to.be.eq(1)

    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.DELETE,
      credentials,
      url: getFtxEndpoints(settings).order.cancelTriggerOrder(id.toString()),
    })

    expect(publicRequest.callCount).to.be.eq(0)

    expect(get.callCount).to.be.eq(1)
    expect(get.firstCall.args[0]).to.deep.eq({
      id: id.toString(),
      symbolPair: '',
      http,
    })

  })

  it('should throw an error if order type param is not informed', async () => {

    // preparing data
    const id = 'id'


    // mocking
    const { get } = mockGet({ module: getMod })


    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: FtxHttp.prototype })


    // executing
    const exchange = new FtxAuthed({ credentials })

    const {
      error,
    } = await executeAndCatch(() => exchange.order.cancel({
      id,
      symbolPair: 'symbolPair',
    }))


    // validating
    expect(error!.code).to.deep.eq(AlunaOrderErrorCodes.MISSING_PARAMS)
    expect(error!.message).to.deep.eq('Order type is required to cancel Ftx order')
    expect(error!.httpStatusCode).to.deep.eq(400)

    expect(authedRequest.callCount).to.be.eq(0)

    expect(publicRequest.callCount).to.be.eq(0)

    expect(get.callCount).to.be.eq(0)

  })

  it('should throw an error when canceling a Ftx order', async () => {

    // preparing data
    const id = 'id'

    // mocking

    const { get } = mockGet({ module: getMod })

    const error = new AlunaError({
      code: AlunaOrderErrorCodes.CANCEL_FAILED,
      message: 'Something went wrong, order not canceled',
      httpStatusCode: 401,
      metadata: {},
    })

    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: FtxHttp.prototype })
    authedRequest.returns(Promise.reject(error))


    // executing
    const exchange = new FtxAuthed({ credentials })

    const {
      error: responseError,
    } = await executeAndCatch(() => exchange.order.cancel({
      id,
      symbolPair: 'symbolPair',
      type: AlunaOrderTypesEnum.LIMIT,
    }))


    // validating
    expect(responseError).to.deep.eq(error)

    expect(authedRequest.callCount).to.be.eq(1)

    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.DELETE,
      credentials,
      url: getFtxEndpoints(exchange.settings).order.cancel(id),
    })

    expect(publicRequest.callCount).to.be.eq(0)

    expect(get.callCount).to.be.eq(0)

  })

})
