import { expect } from 'chai'

import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { AlunaError } from '../../../../../lib/core/AlunaError'
import { AlunaBalanceErrorCodes } from '../../../../../lib/errors/AlunaBalanceErrorCodes'
import { AlunaHttpErrorCodes } from '../../../../../lib/errors/AlunaHttpErrorCodes'
import { IAlunaPositionSetLeverageParams } from '../../../../../lib/modules/authed/IAlunaPositionModule'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { executeAndCatch } from '../../../../../utils/executeAndCatch'
import { BitmexAuthed } from '../../../BitmexAuthed'
import { BitmexHttp } from '../../../BitmexHttp'
import { getBitmexEndpoints } from '../../../bitmexSpecs'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should set leverage just fine', async () => {

    // preparing data
    const leverage = 10
    const symbolPair = 'XBTUSD'


    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: BitmexHttp.prototype })

    authedRequest.returns(Promise.resolve({ leverage }))


    // executing
    const exchange = new BitmexAuthed({ credentials })

    const params: IAlunaPositionSetLeverageParams = {
      symbolPair,
      leverage,
    }

    const {
      leverage: settedLeverage,
    } = await exchange.position!.setLeverage!(params)


    // validating
    expect(settedLeverage).to.deep.eq(leverage)

    expect(authedRequest.callCount).to.be.eq(1)
    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      credentials,
      url: getBitmexEndpoints({}).position.setLeverage,
      body: { symbol: symbolPair, leverage },
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

  it('should throw error if margin balance is equal to 0', async () => {

    // preparing data
    const leverage = 10
    const symbolPair = 'XBTUSD'

    const alunaError = new AlunaError({
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      message: 'Account has zero margin balance for XBT',
      httpStatusCode: 500,
    })


    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: BitmexHttp.prototype })

    authedRequest.returns(Promise.reject(alunaError))


    // executing
    const exchange = new BitmexAuthed({ credentials })

    const params: IAlunaPositionSetLeverageParams = {
      symbolPair,
      leverage,
    }

    const {
      error,
      result,
    } = await executeAndCatch(() => exchange.position!.setLeverage!(params))


    // validating
    expect(result).not.to.be.ok

    const msg = `Cannot set leverage for ${symbolPair} because of insufficient`
      .concat(' balance')

    expect(error!.code).to.be.eq(AlunaBalanceErrorCodes.INSUFFICIENT_BALANCE)
    expect(error!.message).to.be.eq(msg)
    expect(error!.httpStatusCode).to.be.eq(400)

    expect(authedRequest.callCount).to.be.eq(1)
    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      credentials,
      url: getBitmexEndpoints({}).position.setLeverage,
      body: { symbol: symbolPair, leverage },
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

  it('should throw error if request fail somehow', async () => {

    // preparing data
    const leverage = 10
    const symbolPair = 'XBTUSD'

    const alunaError = new AlunaError({
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      message: 'Server is down',
      httpStatusCode: 500,
    })


    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: BitmexHttp.prototype })

    authedRequest.returns(Promise.reject(alunaError))


    // executing
    const exchange = new BitmexAuthed({ credentials })

    const params: IAlunaPositionSetLeverageParams = {
      symbolPair,
      leverage,
    }

    const {
      error,
      result,
    } = await executeAndCatch(() => exchange.position!.setLeverage!(params))


    // validating
    expect(result).not.to.be.ok

    expect(error!.code).to.be.eq(alunaError.code)
    expect(error!.message).to.be.eq(alunaError.message)
    expect(error!.httpStatusCode).to.be.eq(alunaError.httpStatusCode)

    expect(authedRequest.callCount).to.be.eq(1)
    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      credentials,
      url: getBitmexEndpoints({}).position.setLeverage,
      body: { symbol: symbolPair, leverage },
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

})
