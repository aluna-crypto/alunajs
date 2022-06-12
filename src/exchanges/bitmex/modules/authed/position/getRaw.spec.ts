import { expect } from 'chai'

import { PARSED_MARKETS } from '../../../../../../test/fixtures/parsedMarkets'
import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { mockGet } from '../../../../../../test/mocks/exchange/modules/mockGet'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaGenericErrorCodes } from '../../../../../lib/errors/AlunaGenericErrorCodes'
import { AlunaPositionErrorCodes } from '../../../../../lib/errors/AlunaPositionErrorCodes'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { executeAndCatch } from '../../../../../utils/executeAndCatch'
import { BitmexAuthed } from '../../../BitmexAuthed'
import { BitmexHttp } from '../../../BitmexHttp'
import { getBitmexEndpoints } from '../../../bitmexSpecs'
import { BITMEX_RAW_POSITIONS } from '../../../test/fixtures/bitmexPositions'
import * as getMod from '../../public/market/get'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should get raw position just fine', async () => {

    // preparing data
    const bitmexPosition = BITMEX_RAW_POSITIONS[0]
    const market = PARSED_MARKETS[0]
    const { symbol } = bitmexPosition


    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: BitmexHttp.prototype })

    authedRequest.returns(Promise.resolve([bitmexPosition]))

    const { get } = mockGet({ module: getMod })
    get.returns({ market })


    // executing
    const exchange = new BitmexAuthed({ credentials })

    const { rawPosition } = await exchange.position!.getRaw({
      symbolPair: symbol,
    })


    // validating
    expect(rawPosition).to.deep.eq({
      bitmexPosition,
      market,
    })

    expect(authedRequest.callCount).to.be.eq(1)
    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.GET,
      credentials,
      url: getBitmexEndpoints(exchange.settings).position.get,
      body: { filter: { symbol } },
    })

    expect(get.callCount).to.be.eq(1)
    expect(get.firstCall.args[0]).to.deep.eq({
      http: new BitmexHttp({}),
      symbolPair: symbol,
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

  it('should throw error if position is not found', async () => {

    // preparing data
    const bitmexPosition = BITMEX_RAW_POSITIONS[0]
    const market = PARSED_MARKETS[0]
    const { symbol } = bitmexPosition


    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: BitmexHttp.prototype })

    authedRequest.returns(Promise.resolve([]))

    const { get } = mockGet({ module: getMod })
    get.returns({ market })


    // executing
    const exchange = new BitmexAuthed({ credentials })

    const {
      error,
      result,
    } = await executeAndCatch(() => exchange.position!.getRaw({
      symbolPair: symbol,
    }))


    // validating
    expect(result).not.to.be.ok

    expect(error!.code).to.be.eq(AlunaPositionErrorCodes.NOT_FOUND)
    expect(error!.message).to.be.eq('Position not found')
    expect(error!.httpStatusCode).to.be.eq(200)

    expect(authedRequest.callCount).to.be.eq(1)
    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.GET,
      credentials,
      url: getBitmexEndpoints(exchange.settings).position.get,
      body: { filter: { symbol } },
    })

    expect(get.callCount).to.be.eq(0)

    expect(publicRequest.callCount).to.be.eq(0)

  })

  it('should throw error if symbolPair is not present', async () => {

    // preparing data
    const market = PARSED_MARKETS[0]


    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: BitmexHttp.prototype })

    authedRequest.returns(Promise.resolve([]))

    const { get } = mockGet({ module: getMod })
    get.returns({ market })


    // executing
    const exchange = new BitmexAuthed({ credentials })

    const {
      error,
      result,
    } = await executeAndCatch(() => exchange.position!.getRaw({
      id: '',
    }))


    // validating
    expect(result).not.to.be.ok

    const msg = 'Position symbol is required to get Bitmex positions'

    expect(error!.code).to.be.eq(AlunaGenericErrorCodes.PARAM_ERROR)
    expect(error!.message).to.be.eq(msg)
    expect(error!.httpStatusCode).to.be.eq(200)

    expect(authedRequest.callCount).to.be.eq(0)

    expect(get.callCount).to.be.eq(0)

    expect(publicRequest.callCount).to.be.eq(0)

  })

})
