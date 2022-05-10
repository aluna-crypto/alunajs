import { expect } from 'chai'

import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { AlunaPositionErrorCodes } from '../../../../../lib/errors/AlunaPositionErrorCodes'
import { IAlunaPositionGetParams } from '../../../../../lib/modules/authed/IAlunaPositionModule'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { executeAndCatch } from '../../../../../utils/executeAndCatch'
import { BitfinexAuthed } from '../../../BitfinexAuthed'
import { BitfinexHttp } from '../../../BitfinexHttp'
import { getBitfinexEndpoints } from '../../../bitfinexSpecs'
import { BITFINEX_RAW_POSITIONS } from '../../../test/fixtures/bitfinexPosition'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should get a Bitfinex raw position just fine', async () => {

    // preparing data
    const mockedRawPosition = BITFINEX_RAW_POSITIONS[0]


    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: BitfinexHttp.prototype })

    authedRequest.returns(Promise.resolve([mockedRawPosition]))


    // executing
    const exchange = new BitfinexAuthed({ credentials })

    const { rawPosition } = await exchange.position!.getRaw({
      id: mockedRawPosition[11].toString(),
      symbolPair: mockedRawPosition[0],
    })


    // validating
    expect(rawPosition).to.deep.eq(mockedRawPosition)

    expect(authedRequest.callCount).to.be.eq(1)

    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      credentials,
      url: getBitfinexEndpoints(exchange.settings).position.get,
      body: { id: [mockedRawPosition[11]], limit: 1 },
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

  it('should throw error if position id is not informed', async () => {

    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: BitfinexHttp.prototype })

    authedRequest.onFirstCall().returns(Promise.resolve([]))
    authedRequest.onSecondCall().returns(Promise.resolve([]))


    // executing
    const exchange = new BitfinexAuthed({ credentials })

    const params: IAlunaPositionGetParams = {
      id: '',
      symbolPair: 'symbolPair',
    }

    const {
      error,
      result,
    } = await executeAndCatch(() => exchange.position!.getRaw(params))


    // validating
    expect(result).not.to.be.ok

    const msg = 'Position id is required to getting Bitfinex position'

    expect(error!.code).to.be.eq(AlunaPositionErrorCodes.DOESNT_HAVE_ID)
    expect(error!.message).to.be.eq(msg)
    expect(error!.httpStatusCode).to.be.eq(400)

    expect(authedRequest.callCount).to.be.eq(0)

    expect(publicRequest.callCount).to.be.eq(0)

  })

  it('should throw error if position is not found', async () => {

    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: BitfinexHttp.prototype })

    authedRequest.onFirstCall().returns(Promise.resolve([]))
    authedRequest.onSecondCall().returns(Promise.resolve([]))


    // executing
    const exchange = new BitfinexAuthed({ credentials })

    const params: IAlunaPositionGetParams = {
      id: 'id',
      symbolPair: 'symbolPair',
    }

    const {
      error,
      result,
    } = await executeAndCatch(() => exchange.position!.getRaw(params))


    // validating
    expect(result).not.to.be.ok

    expect(error!.code).to.be.eq(AlunaPositionErrorCodes.NOT_FOUND)
    expect(error!.message).to.be.eq('Position not found')
    expect(error!.httpStatusCode).to.be.eq(400)

    expect(authedRequest.callCount).to.be.eq(1)

    expect(publicRequest.callCount).to.be.eq(0)

  })

})
