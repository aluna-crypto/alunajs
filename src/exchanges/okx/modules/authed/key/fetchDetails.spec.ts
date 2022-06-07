import { expect } from 'chai'

import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { mockParseDetails } from '../../../../../../test/mocks/exchange/modules/key/mockParseDetails'
import { AlunaError } from '../../../../../lib/core/AlunaError'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaGenericErrorCodes } from '../../../../../lib/errors/AlunaGenericErrorCodes'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { IAlunaKeySchema } from '../../../../../lib/schemas/IAlunaKeySchema'
import { executeAndCatch } from '../../../../../utils/executeAndCatch'
import { OkxAuthed } from '../../../OkxAuthed'
import { OkxHttp } from '../../../OkxHttp'
import { getOkxEndpoints } from '../../../okxSpecs'
import { OKX_KEY_ACCOUNT_PERMISSIONS } from '../../../test/fixtures/okxKey'
import * as parseDetailsMod from './parseDetails'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should fetch OKX key details just fine (KEY W/ TRADE PERMISSION)', async () => {

    // preparing data
    const accountId = 'accountId'

    const parsedKey: IAlunaKeySchema = {
      accountId,
      permissions: {
        read: true,
        trade: true,
        withdraw: false,
      },
      meta: {},
    }

    // mocking
    const http = new OkxHttp({})

    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: OkxHttp.prototype })

    authedRequest
      .onFirstCall()
      .returns(Promise.resolve([OKX_KEY_ACCOUNT_PERMISSIONS]))

    authedRequest
      .onSecondCall()
      .returns(Promise.reject(new AlunaError({
        code: AlunaGenericErrorCodes.UNKNOWN,
        message: '',
        metadata: { sCode: '50014' },
      })))

    const { parseDetails } = mockParseDetails({
      module: parseDetailsMod,
    })

    parseDetails.returns({ key: parsedKey })


    // executing
    const exchange = new OkxAuthed({ settings: {}, credentials })

    const {
      key,
      requestWeight,
    } = await exchange.key.fetchDetails()


    // validating
    expect(key).to.be.eq(key)

    expect(requestWeight).to.deep.eq(http.requestWeight)

    expect(authedRequest.callCount).to.be.eq(2)
    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.GET,
      url: getOkxEndpoints(exchange.settings).key.fetchDetails,
      credentials,
    })
    expect(authedRequest.secondCall.args[0]).to.deep.eq({
      url: getOkxEndpoints(exchange.settings).order.place,
      credentials,
      body: {},
    })

    expect(publicRequest.callCount).to.be.eq(0)

    expect(parseDetails.firstCall.args[0]).to.deep.eq({
      rawKey: {
        read: true,
        trade: true,
        withdraw: false,
        accountId: OKX_KEY_ACCOUNT_PERMISSIONS.uid,
      },
    })

  })

  it('should fetch OKX key details just fine (KEY W/O TRADE PERMISSION)', async () => {

    // preparing data
    const accountId = 'accountId'

    const parsedKey: IAlunaKeySchema = {
      accountId,
      permissions: {
        read: true,
        trade: false,
        withdraw: false,
      },
      meta: {},
    }

    // mocking
    const http = new OkxHttp({})

    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: OkxHttp.prototype })

    authedRequest
      .onFirstCall()
      .returns(Promise.resolve([OKX_KEY_ACCOUNT_PERMISSIONS]))

    authedRequest
      .onSecondCall()
      .returns(Promise.reject(new AlunaError({
        code: AlunaGenericErrorCodes.UNKNOWN,
        message: '',
        metadata: { sCode: '50114' },
      })))


    const { parseDetails } = mockParseDetails({
      module: parseDetailsMod,
    })

    parseDetails.returns({ key: parsedKey })


    // executing
    const exchange = new OkxAuthed({ settings: {}, credentials })

    const {
      key,
      requestWeight,
    } = await exchange.key.fetchDetails()


    // validating
    expect(key).to.be.eq(key)

    expect(requestWeight).to.deep.eq(http.requestWeight)

    expect(authedRequest.callCount).to.be.eq(2)
    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.GET,
      url: getOkxEndpoints(exchange.settings).key.fetchDetails,
      credentials,
    })
    expect(authedRequest.secondCall.args[0]).to.deep.eq({
      url: getOkxEndpoints(exchange.settings).order.place,
      credentials,
      body: {},
    })


    expect(publicRequest.callCount).to.be.eq(0)

    expect(parseDetails.firstCall.args[0]).to.deep.eq({
      rawKey: {
        read: true,
        trade: false,
        withdraw: false,
        accountId: OKX_KEY_ACCOUNT_PERMISSIONS.uid,
      },
    })

  })

  it('should throw an error if OKX request fails somehow', async () => {

    // preparing data
    const credentials: IAlunaCredentialsSchema = {
      key: 'key',
      secret: 'secret',
    }

    // mocking
    const alunaError = new AlunaError({
      code: AlunaGenericErrorCodes.UNKNOWN,
      message: '',
      metadata: { sCode: '1' },
    })

    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: OkxHttp.prototype })

    authedRequest
      .onFirstCall()
      .returns(Promise.resolve([OKX_KEY_ACCOUNT_PERMISSIONS]))

    authedRequest
      .onSecondCall()
      .returns(Promise.reject(alunaError))


    // executing
    const exchange = new OkxAuthed({ settings: {}, credentials })

    const {
      error,
      result,
    } = await executeAndCatch(() => exchange.key.fetchDetails())


    // validating
    expect(result).not.to.be.ok

    expect(error).to.deep.eq(alunaError)

    expect(authedRequest.callCount).to.be.eq(2)
    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.GET,
      url: getOkxEndpoints(exchange.settings).key.fetchDetails,
      credentials,
    })
    expect(authedRequest.secondCall.args[0]).to.deep.eq({
      url: getOkxEndpoints(exchange.settings).order.place,
      credentials,
      body: {},
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

})
