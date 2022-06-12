import { expect } from 'chai'

import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaGenericErrorCodes } from '../../../../../lib/errors/AlunaGenericErrorCodes'
import { AlunaPositionErrorCodes } from '../../../../../lib/errors/AlunaPositionErrorCodes'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { executeAndCatch } from '../../../../../utils/executeAndCatch'
import { FtxAuthed } from '../../../FtxAuthed'
import { FtxHttp } from '../../../FtxHttp'
import { getFtxEndpoints } from '../../../ftxSpecs'
import { FTX_RAW_POSITIONS } from '../../../test/fixtures/ftxPositions'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should get raw position just fine', async () => {

    // preparing data
    const ftxPosition = FTX_RAW_POSITIONS[0]
    const symbol = ftxPosition.future


    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: FtxHttp.prototype })
    authedRequest.returns(Promise.resolve([ftxPosition]))


    // executing
    const exchange = new FtxAuthed({ credentials })
    const { rawPosition } = await exchange.position!.getRaw({
      symbolPair: symbol,
    })


    // validating
    expect(rawPosition).to.deep.eq(ftxPosition)

    expect(authedRequest.callCount).to.be.eq(1)
    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.GET,
      credentials,
      url: getFtxEndpoints(exchange.settings).position.list,
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

  it('should throw error if position is not found', async () => {

    // preparing data
    const ftxPosition = FTX_RAW_POSITIONS[0]
    const symbol = ftxPosition.future


    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: FtxHttp.prototype })

    authedRequest.returns(Promise.resolve([]))


    // executing
    const exchange = new FtxAuthed({ credentials })

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
      url: getFtxEndpoints(exchange.settings).position.list,
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

  it('should throw error if symbolPair is not present', async () => {

    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: FtxHttp.prototype })

    authedRequest.returns(Promise.resolve([]))



    // executing
    const exchange = new FtxAuthed({ credentials })

    const {
      error,
      result,
    } = await executeAndCatch(() => exchange.position!.getRaw({
      id: '',
    }))


    // validating
    expect(result).not.to.be.ok

    const msg = 'Position symbol is required to get Ftx positions'

    expect(error!.code).to.be.eq(AlunaGenericErrorCodes.PARAM_ERROR)
    expect(error!.message).to.be.eq(msg)
    expect(error!.httpStatusCode).to.be.eq(200)

    expect(authedRequest.callCount).to.be.eq(0)

    expect(publicRequest.callCount).to.be.eq(0)

  })

})
