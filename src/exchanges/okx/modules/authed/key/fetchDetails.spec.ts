import { expect } from 'chai'
import { cloneDeep } from 'lodash'

import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { mockParseDetails } from '../../../../../../test/mocks/exchange/modules/key/mockParseDetails'
import { AlunaError } from '../../../../../lib/core/AlunaError'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { IAlunaKeySchema } from '../../../../../lib/schemas/IAlunaKeySchema'
import { OkxAuthed } from '../../../OkxAuthed'
import { OkxHttp } from '../../../OkxHttp'
import { getOkxEndpoints } from '../../../okxSpecs'
import { OKX_KEY_ACCOUNT_PERMISSIONS, OKX_KEY_PERMISSIONS } from '../../../test/fixtures/okxKey'
import * as parseDetailsMod from './parseDetails'
import { executeAndCatch } from '../../../../../utils/executeAndCatch'



describe(__filename, () => {

  it('should fetch Okx key details just fine', async () => {

    // preparing data
    const credentials: IAlunaCredentialsSchema = {
      key: 'key',
      secret: 'secret',
    }

    const accountId = 'accountId'

    const parsedKey: IAlunaKeySchema = {
      accountId,
      permissions: OKX_KEY_PERMISSIONS,
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
      .returns(Promise.resolve([{ sCode: '51116' }]))

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


    expect(publicRequest.callCount).to.be.eq(0)

    expect(parseDetails.firstCall.args[0]).to.deep.eq({
      rawKey: OKX_KEY_PERMISSIONS,
    })

  })

  it('should fetch Okx key details just fine', async () => {

    // preparing data
    const credentials: IAlunaCredentialsSchema = {
      key: 'key',
      secret: 'secret',
    }

    const permissions = cloneDeep(OKX_KEY_PERMISSIONS)

    permissions.read = false
    permissions.trade = false
    permissions.accountId = undefined

    const parsedKey: IAlunaKeySchema = {
      accountId: undefined,
      permissions,
      meta: {},
    }

    // mocking
    const http = new OkxHttp({})

    const alunaError = new AlunaError({
      message: 'dummy-error',
      code: '',
      metadata: {
        code: '50030',
      },
    })

    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: OkxHttp.prototype })

    authedRequest
      .onFirstCall()
      .returns(Promise.reject(alunaError))

    authedRequest
      .onSecondCall()
      .returns(Promise.resolve([{ code: '51116' }]))

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


    expect(publicRequest.callCount).to.be.eq(0)

    expect(parseDetails.firstCall.args[0]).to.deep.eq({
      rawKey: permissions,
    })

  })

  it('should throw an error fetching okx key details', async () => {

    // preparing data
    const credentials: IAlunaCredentialsSchema = {
      key: 'key',
      secret: 'secret',
    }

    // mocking

    const alunaError = new AlunaError({
      message: 'dummy-error',
      code: '',
      metadata: null,
    })

    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: OkxHttp.prototype })

    authedRequest
      .onFirstCall()
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

    expect(authedRequest.callCount).to.be.eq(1)
    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.GET,
      url: getOkxEndpoints(exchange.settings).key.fetchDetails,
      credentials,
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

})
