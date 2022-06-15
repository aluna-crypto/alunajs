import { expect } from 'chai'

import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { AlunaError } from '../../../../../lib/core/AlunaError'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaOrderTypesEnum } from '../../../../../lib/enums/AlunaOrderTypesEnum'
import { AlunaOrderErrorCodes } from '../../../../../lib/errors/AlunaOrderErrorCodes'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { executeAndCatch } from '../../../../../utils/executeAndCatch'
import { OkxOrderTypeEnum } from '../../../enums/OkxOrderTypeEnum'
import { OkxAuthed } from '../../../OkxAuthed'
import { OkxHttp } from '../../../OkxHttp'
import { getOkxEndpoints } from '../../../okxSpecs'
import { OKX_RAW_ORDERS } from '../../../test/fixtures/okxOrders'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should get a Okx raw order just fine', async () => {

    // preparing data
    const mockedRawOrder = OKX_RAW_ORDERS[0]

    const { ordId: id } = mockedRawOrder


    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: OkxHttp.prototype })

    authedRequest.returns(Promise.resolve([mockedRawOrder]))


    // executing
    const exchange = new OkxAuthed({ credentials })

    const { rawOrder } = await exchange.order.getRaw({
      id,
      symbolPair: '',
      type: AlunaOrderTypesEnum.LIMIT,
    })


    // validating
    expect(rawOrder).to.deep.eq(mockedRawOrder)

    expect(authedRequest.callCount).to.be.eq(1)

    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.GET,
      credentials,
      url: getOkxEndpoints(exchange.settings).order.get(id, ''),
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

  it('should get a Okx raw stop limit order just fine', async () => {

    // preparing data
    const mockedRawOrder = OKX_RAW_ORDERS[0]

    const { ordId: id } = mockedRawOrder


    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: OkxHttp.prototype })

    authedRequest.returns(Promise.resolve([mockedRawOrder]))


    // executing
    const exchange = new OkxAuthed({ credentials })

    const { rawOrder } = await exchange.order.getRaw({
      id,
      symbolPair: '',
      type: AlunaOrderTypesEnum.STOP_LIMIT,
    })


    // validating
    expect(rawOrder).to.deep.eq(mockedRawOrder)

    expect(authedRequest.callCount).to.be.eq(1)

    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.GET,
      credentials,
      url: getOkxEndpoints(exchange.settings).order.getStop(OkxOrderTypeEnum.CONDITIONAL),
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

  it('should get a Okx raw closed stop limit order just fine', async () => {

    // preparing data
    const mockedRawOrder = OKX_RAW_ORDERS[0]

    const { ordId: id } = mockedRawOrder


    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: OkxHttp.prototype })

    authedRequest.onFirstCall().returns(Promise.resolve([]))
    authedRequest.onSecondCall().returns(Promise.resolve([mockedRawOrder]))


    // executing
    const exchange = new OkxAuthed({ credentials })

    const { rawOrder } = await exchange.order.getRaw({
      id,
      symbolPair: '',
      type: AlunaOrderTypesEnum.STOP_LIMIT,
    })

    // validating
    expect(rawOrder).to.deep.eq(mockedRawOrder)

    expect(authedRequest.callCount).to.be.eq(2)

    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.GET,
      credentials,
      url: getOkxEndpoints(exchange.settings).order.getStop(OkxOrderTypeEnum.CONDITIONAL),
    })

    expect(authedRequest.secondCall.args[0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.GET,
      credentials,
      url: getOkxEndpoints(exchange.settings).order.getStopHistory(id, OkxOrderTypeEnum.CONDITIONAL),
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

  it('should throw an error when an okx order is not found', async () => {

    // preparing data
    const mockedRawOrder = OKX_RAW_ORDERS[0]

    const { ordId: id } = mockedRawOrder


    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: OkxHttp.prototype })

    authedRequest.returns(Promise.resolve([]))

    // executing
    const exchange = new OkxAuthed({ credentials })

    const {
      error,
      result,
    } = await executeAndCatch(() => exchange.order.getRaw({
      id,
      symbolPair: '',
      type: AlunaOrderTypesEnum.STOP_LIMIT,
    }))

    // validating
    expect(result).not.to.be.ok

    expect(error instanceof AlunaError).to.be.ok
    expect(error?.code).to.be.eq(AlunaOrderErrorCodes.NOT_FOUND)
    expect(error?.message).to.be.eq('Order not found')
    expect(error?.httpStatusCode).to.be.eq(200)

    expect(authedRequest.callCount).to.be.eq(2)

    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.GET,
      credentials,
      url: getOkxEndpoints(exchange.settings).order.getStop(OkxOrderTypeEnum.CONDITIONAL),
    })

    expect(authedRequest.secondCall.args[0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.GET,
      credentials,
      url: getOkxEndpoints(exchange.settings).order.getStopHistory(id, OkxOrderTypeEnum.CONDITIONAL),
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

})
