import { expect } from 'chai'

import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { mockListRaw } from '../../../../../../test/mocks/exchange/modules/mockListRaw'
import { AlunaError } from '../../../../../lib/core/AlunaError'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaOrderTypesEnum } from '../../../../../lib/enums/AlunaOrderTypesEnum'
import { AlunaGenericErrorCodes } from '../../../../../lib/errors/AlunaGenericErrorCodes'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { executeAndCatch } from '../../../../../utils/executeAndCatch'
import { HuobiAuthed } from '../../../HuobiAuthed'
import { HuobiHttp } from '../../../HuobiHttp'
import { getHuobiEndpoints } from '../../../huobiSpecs'
import { HUOBI_RAW_ORDERS } from '../../../test/fixtures/huobiOrders'
import { HUOBI_RAW_SYMBOLS } from '../../../test/fixtures/huobiSymbols'
import * as listRawMod from '../../public/symbol/listRaw'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should get a Huobi raw order just fine', async () => {

    // preparing data
    const mockedRawOrder = HUOBI_RAW_ORDERS[0]
    const mockedRawSymbols = HUOBI_RAW_SYMBOLS

    const { id: rawId } = mockedRawOrder

    const id = rawId.toString()

    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: HuobiHttp.prototype })

    const { listRaw: listRawSymbols } = mockListRaw({
      module: listRawMod,
    })

    listRawSymbols.returns(Promise.resolve({
      rawSymbols: mockedRawSymbols,
    }))

    authedRequest.returns(Promise.resolve(mockedRawOrder))


    // executing
    const exchange = new HuobiAuthed({ credentials })

    const { rawOrder } = await exchange.order.getRaw({
      id,
      symbolPair: '',
      type: AlunaOrderTypesEnum.LIMIT,
    })


    // validating
    expect(rawOrder).to.deep.eq({
      huobiOrder: mockedRawOrder,
      rawSymbol: mockedRawSymbols[0],
    })

    expect(authedRequest.callCount).to.be.eq(1)

    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.GET,
      credentials,
      url: getHuobiEndpoints(exchange.settings).order.get(id),
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

  it('should get a Huobi raw stop limit order just fine', async () => {

    // preparing data
    const mockedRawOrder = HUOBI_RAW_ORDERS[0]
    const mockedRawSymbols = HUOBI_RAW_SYMBOLS

    const { id: rawId } = mockedRawOrder

    const id = rawId.toString()

    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: HuobiHttp.prototype })

    const { listRaw: listRawSymbols } = mockListRaw({
      module: listRawMod,
    })

    listRawSymbols.returns(Promise.resolve({
      rawSymbols: mockedRawSymbols,
    }))

    authedRequest.returns(Promise.resolve(mockedRawOrder))


    // executing
    const exchange = new HuobiAuthed({ credentials })

    const { rawOrder } = await exchange.order.getRaw({
      id,
      symbolPair: '',
      type: AlunaOrderTypesEnum.STOP_LIMIT,
      clientOrderId: '12345',
    })


    // validating
    expect(rawOrder).to.deep.eq({
      huobiOrder: mockedRawOrder,
      rawSymbol: mockedRawSymbols[0],
    })

    expect(authedRequest.callCount).to.be.eq(1)

    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.GET,
      credentials,
      url: getHuobiEndpoints(exchange.settings).order.getConditional,
      query: 'clientOrderId=12345',
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

  it('should get a Huobi raw stop market order just fine', async () => {

    // preparing data
    const mockedRawOrder = HUOBI_RAW_ORDERS[0]
    const mockedRawSymbols = HUOBI_RAW_SYMBOLS

    const { id: rawId } = mockedRawOrder

    const id = rawId.toString()

    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: HuobiHttp.prototype })

    const { listRaw: listRawSymbols } = mockListRaw({
      module: listRawMod,
    })

    listRawSymbols.returns(Promise.resolve({
      rawSymbols: mockedRawSymbols,
    }))

    authedRequest.returns(Promise.resolve(mockedRawOrder))


    // executing
    const exchange = new HuobiAuthed({ credentials })

    const { rawOrder } = await exchange.order.getRaw({
      id,
      symbolPair: '',
      type: AlunaOrderTypesEnum.STOP_MARKET,
      clientOrderId: '12345',
    })


    // validating
    expect(rawOrder).to.deep.eq({
      huobiOrder: mockedRawOrder,
      rawSymbol: mockedRawSymbols[0],
    })

    expect(authedRequest.callCount).to.be.eq(1)

    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.GET,
      credentials,
      url: getHuobiEndpoints(exchange.settings).order.getConditional,
      query: 'clientOrderId=12345',
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

  it('should throw an error when clientOrderId is not provided on stop orders', async () => {

    // preparing data
    const mockedRawOrder = HUOBI_RAW_ORDERS[0]
    const mockedRawSymbols = HUOBI_RAW_SYMBOLS

    const { id: rawId } = mockedRawOrder

    const id = rawId.toString()

    const params = {
      id,
      symbolPair: '',
      type: AlunaOrderTypesEnum.STOP_MARKET,
    }

    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: HuobiHttp.prototype })

    const { listRaw: listRawSymbols } = mockListRaw({
      module: listRawMod,
    })

    listRawSymbols.returns(Promise.resolve({
      rawSymbols: mockedRawSymbols,
    }))

    authedRequest.returns(Promise.resolve(mockedRawOrder))

    // executing
    const exchange = new HuobiAuthed({ credentials })

    const { error } = await executeAndCatch(() => exchange.order.getRaw(params))

    // validating
    expect(error).to.deep.eq(new AlunaError({
      httpStatusCode: 200,
      message: "param 'clientOrderId' is required for conditional orders",
      code: AlunaGenericErrorCodes.PARAM_ERROR,
      metadata: params,
    }))

    expect(authedRequest.callCount).to.be.eq(0)

    expect(publicRequest.callCount).to.be.eq(0)

  })

})
