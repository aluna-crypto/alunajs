import { expect } from 'chai'

import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { AlunaGenericErrorCodes } from '../../../../../lib/errors/AlunaGenericErrorCodes'
import { AlunaPositionErrorCodes } from '../../../../../lib/errors/AlunaPositionErrorCodes'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { executeAndCatch } from '../../../../../utils/executeAndCatch'
import { OkxAuthed } from '../../../OkxAuthed'
import { OkxHttp } from '../../../OkxHttp'
import { getOkxEndpoints } from '../../../okxSpecs'
import { OKX_RAW_POSITIONS } from '../../../test/fixtures/okxPositions'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should get raw position just fine', async () => {

    // preparing data
    const mockedRawPosition = OKX_RAW_POSITIONS[0]

    const { posId: id } = mockedRawPosition


    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: OkxHttp.prototype })

    authedRequest.returns(Promise.resolve([mockedRawPosition]))


    // executing
    const exchange = new OkxAuthed({
      credentials,
    })

    const { rawPosition } = await exchange.position!.getRaw({
      id,
      symbolPair: 'symbolPair',
    })


    // validating
    expect(rawPosition).to.deep.eq(mockedRawPosition)

    expect(authedRequest.callCount).to.be.eq(1)
    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      credentials,
      url: getOkxEndpoints({}).position.get('symbolPair'),
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

  it('should throw error if position not found', async () => {

    // preparing data
    const mockedRawPosition = OKX_RAW_POSITIONS[0]
    const { posId: id } = mockedRawPosition


    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: OkxHttp.prototype })
    authedRequest.returns(Promise.resolve([undefined]))


    // executing
    const exchange = new OkxAuthed({ credentials })

    const {
      error,
      result,
    } = await executeAndCatch(() => exchange.position!.getRaw({
      id,
      symbolPair: 'symbolPair',
    }))


    // validating
    expect(result).not.to.be.ok

    expect(error!.code).to.be.eq(AlunaPositionErrorCodes.NOT_FOUND)
    expect(error!.message).to.be.eq('Position not found')
    expect(error!.httpStatusCode).to.be.eq(200)


    expect(authedRequest.callCount).to.be.eq(1)
    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      credentials,
      url: getOkxEndpoints(exchange.settings).position.get('symbolPair'),
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

  it('should throw error if param symbolPair not sent', async () => {

    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: OkxHttp.prototype })


    // executing
    const exchange = new OkxAuthed({ credentials })

    const {
      error,
      result,
    } = await executeAndCatch(() => exchange.position!.getRaw({}))


    // validating
    expect(result).not.to.be.ok

    expect(error!.code).to.be.eq(AlunaGenericErrorCodes.PARAM_ERROR)
    expect(error!.message).to.be.eq('Symbol is required to get okx position')
    expect(error!.httpStatusCode).to.be.eq(400)


    expect(authedRequest.callCount).to.be.eq(0)
    expect(publicRequest.callCount).to.be.eq(0)

  })

})
