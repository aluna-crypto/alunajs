import { expect } from 'chai'

import { PARSED_MARKETS } from '../../../../../../test/fixtures/parsedMarkets'
import { PARSED_ORDERS } from '../../../../../../test/fixtures/parsedOrders'
import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { mockGet } from '../../../../../../test/mocks/exchange/modules/mockGet'
import { mockParse } from '../../../../../../test/mocks/exchange/modules/mockParse'
import { AlunaError } from '../../../../../lib/core/AlunaError'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaOrderTypesEnum } from '../../../../../lib/enums/AlunaOrderTypesEnum'
import { AlunaGenericErrorCodes } from '../../../../../lib/errors/AlunaGenericErrorCodes'
import { AlunaOrderErrorCodes } from '../../../../../lib/errors/AlunaOrderErrorCodes'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { executeAndCatch } from '../../../../../utils/executeAndCatch'
import { BitmexAuthed } from '../../../BitmexAuthed'
import { BitmexHttp } from '../../../BitmexHttp'
import { getBitmexEndpoints } from '../../../bitmexSpecs'
import { BITMEX_RAW_ORDERS } from '../../../test/fixtures/bitmexOrders'
import * as getMod from '../../public/market/get'
import * as parseMod from './parse'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should cancel a Bitmex order just fine', async () => {

    // preparing data
    const bitmexOrder = BITMEX_RAW_ORDERS[0]
    const parsedOrder = PARSED_ORDERS[0]
    const parsedMarket = PARSED_MARKETS[0]

    const { orderID } = bitmexOrder


    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: BitmexHttp.prototype })
    authedRequest.returns(Promise.resolve([bitmexOrder]))

    const { get } = mockGet({ module: getMod })
    get.returns(Promise.resolve({ market: parsedMarket }))

    const { parse } = mockParse({ module: parseMod })
    parse.returns({ order: parsedOrder })



    // executing
    const exchange = new BitmexAuthed({ credentials })

    const { order } = await exchange.order.cancel({
      id: orderID,
      symbolPair: '',
      type: AlunaOrderTypesEnum.LIMIT,
    })


    // validating
    expect(order).to.deep.eq(parsedOrder)

    expect(authedRequest.callCount).to.be.eq(1)
    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.DELETE,
      url: getBitmexEndpoints(exchange.settings).order.cancel,
      body: { orderID },
      credentials,
    })

    expect(publicRequest.callCount).to.be.eq(0)

    expect(get.callCount).to.be.eq(1)
    expect(get.firstCall.args[0]).to.deep.eq({
      http: new BitmexHttp({}),
      symbolPair: bitmexOrder.symbol,
    })

    expect(parse.callCount).to.be.eq(1)
    expect(parse.firstCall.args[0]).to.deep.eq({
      rawOrder: {
        bitmexOrder,
        market: parsedMarket,
      },
    })

  })

  it('should throw error if request returns error for invalid order id', async () => {

    // preparing data
    const bitmexOrder = BITMEX_RAW_ORDERS[0]

    const { orderID } = bitmexOrder

    const error = 'Invalid orderID'


    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: BitmexHttp.prototype })
    authedRequest.returns(Promise.resolve([{ error }]))

    const { get } = mockGet({ module: getMod })

    const { parse } = mockParse({ module: parseMod })


    // executing
    const exchange = new BitmexAuthed({ credentials })

    const {
      error: returnedError,
      result,
    } = await executeAndCatch(() => exchange.order.cancel({
      id: orderID,
      symbolPair: '',
      type: AlunaOrderTypesEnum.LIMIT,
    }))


    // validating
    expect(result).not.to.be.ok

    expect(returnedError!.code).to.be.eq(AlunaOrderErrorCodes.NOT_FOUND)
    expect(returnedError!.message).to.be.eq(error)
    expect(returnedError!.httpStatusCode).to.be.eq(200)
    expect(returnedError!.metadata).to.be.eq(error)

    expect(authedRequest.callCount).to.be.eq(1)
    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.DELETE,
      url: getBitmexEndpoints(exchange.settings).order.cancel,
      body: { orderID },
      credentials,
    })

    expect(publicRequest.callCount).to.be.eq(0)

    expect(get.callCount).to.be.eq(0)

    expect(parse.callCount).to.be.eq(0)

  })

  it('should throw error if request throws', async () => {

    // preparing data
    const bitmexOrder = BITMEX_RAW_ORDERS[0]

    const { orderID } = bitmexOrder

    const alunaError = new AlunaError({
      code: AlunaGenericErrorCodes.UNKNOWN,
      message: 'error',
      httpStatusCode: 500,
      metadata: {},
    })


    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: BitmexHttp.prototype })
    authedRequest.returns(Promise.reject(alunaError))

    const { get } = mockGet({ module: getMod })

    const { parse } = mockParse({ module: parseMod })


    // executing
    const exchange = new BitmexAuthed({ credentials })

    const {
      error: returnedError,
      result,
    } = await executeAndCatch(() => exchange.order.cancel({
      id: orderID,
      symbolPair: '',
      type: AlunaOrderTypesEnum.LIMIT,
    }))


    // validating
    expect(result).not.to.be.ok

    expect(returnedError!.code).to.be.eq(AlunaOrderErrorCodes.CANCEL_FAILED)
    expect(returnedError!.message).to.be.eq(alunaError.message)
    expect(returnedError!.httpStatusCode).to.be.eq(500)
    expect(returnedError!.metadata).to.deep.eq(alunaError.metadata)

    expect(authedRequest.callCount).to.be.eq(1)
    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.DELETE,
      url: getBitmexEndpoints(exchange.settings).order.cancel,
      body: { orderID },
      credentials,
    })

    expect(publicRequest.callCount).to.be.eq(0)

    expect(get.callCount).to.be.eq(0)

    expect(parse.callCount).to.be.eq(0)

  })

})
