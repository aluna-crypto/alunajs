import { expect } from 'chai'

import { PARSED_ORDERS } from '../../../../../../test/fixtures/parsedOrders'
import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { mockParse } from '../../../../../../test/mocks/exchange/modules/mockParse'
import { AlunaError } from '../../../../../lib/core/AlunaError'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaOrderErrorCodes } from '../../../../../lib/errors/AlunaOrderErrorCodes'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { executeAndCatch } from '../../../../../utils/executeAndCatch'
import { BinanceAuthed } from '../../../BinanceAuthed'
import { BinanceHttp } from '../../../BinanceHttp'
import { getBinanceEndpoints } from '../../../binanceSpecs'
import { BINANCE_RAW_ORDERS } from '../../../test/fixtures/binanceOrders'
import * as parseMod from './parse'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should cancel a Binance order just fine', async () => {

    // preparing data
    const mockedRawOrder = BINANCE_RAW_ORDERS[0]
    const mockedParsedOrder = PARSED_ORDERS[0]

    const { id } = mockedRawOrder


    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: BinanceHttp.prototype })

    const { parse } = mockParse({ module: parseMod })

    parse.returns({ order: mockedParsedOrder })

    authedRequest.returns(Promise.resolve(mockedRawOrder))


    // executing
    const exchange = new BinanceAuthed({ credentials })

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
      url: getBinanceEndpoints(exchange.settings).order.cancel(id),
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

  it('should throw an error when canceling a Binance order', async () => {

    // preparing data
    const id = 'id'

    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: BinanceHttp.prototype })

    const error = new AlunaError({
      code: AlunaOrderErrorCodes.CANCEL_FAILED,
      message: 'Something went wrong, order not canceled',
      httpStatusCode: 401,
      metadata: {},
    })

    authedRequest.returns(Promise.reject(error))


    // executing
    const exchange = new BinanceAuthed({ credentials })

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
      url: getBinanceEndpoints(exchange.settings).order.cancel(id),
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

})
