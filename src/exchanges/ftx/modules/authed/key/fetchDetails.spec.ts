import { expect } from 'chai'
import { cloneDeep } from 'lodash'

import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { mockParseDetails } from '../../../../../../test/mocks/exchange/modules/key/mockParseDetails'
import { AlunaError } from '../../../../../lib/core/AlunaError'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaKeyErrorCodes } from '../../../../../lib/errors/AlunaKeyErrorCodes'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { IAlunaKeySchema } from '../../../../../lib/schemas/IAlunaKeySchema'
import { executeAndCatch } from '../../../../../utils/executeAndCatch'
import { FtxAuthed } from '../../../FtxAuthed'
import { FtxHttp } from '../../../FtxHttp'
import { getFtxEndpoints } from '../../../ftxSpecs'
import { FTX_KEY_PERMISSIONS } from '../../../test/fixtures/ftxKey'
import * as parseDetailsMod from './parseDetails'



describe(__filename, () => {

  it('should fetch Ftx key details just fine', async () => {

    // preparing data
    const credentials: IAlunaCredentialsSchema = {
      key: 'key',
      secret: 'secret',
    }

    const accountId = 'accountId'

    const parsedKey: IAlunaKeySchema = {
      accountId,
      permissions: {
        read: true,
        trade: true,
        withdraw: true,
      },
      meta: {},
    }

    // mocking
    const http = new FtxHttp({})

    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: FtxHttp.prototype })

    authedRequest.returns(Promise.resolve(FTX_KEY_PERMISSIONS))

    const { parseDetails } = mockParseDetails({
      module: parseDetailsMod,
    })

    parseDetails.returns({ key: parsedKey })


    // executing
    const exchange = new FtxAuthed({ settings: {}, credentials })

    const {
      key,
      requestWeight,
    } = await exchange.key.fetchDetails()


    // validating
    expect(key).to.be.eq(key)

    expect(requestWeight).to.deep.eq(http.requestWeight)

    expect(authedRequest.callCount).to.be.eq(1)
    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.GET,
      url: getFtxEndpoints(exchange.settings).key.fetchDetails,
      credentials,
    })


    expect(publicRequest.callCount).to.be.eq(0)

    expect(parseDetails.callCount).to.be.eq(1)
    expect(parseDetails.firstCall.args[0]).to.deep.eq({
      rawKey: FTX_KEY_PERMISSIONS,
    })

  })

  it('should throw an error fetching Ftx key details', async () => {

    // preparing data
    const credentials: IAlunaCredentialsSchema = {
      key: 'key',
      secret: 'secret',
    }

    const rawKey = cloneDeep(FTX_KEY_PERMISSIONS)

    rawKey.account = null as any

    const alunaError = new AlunaError({
      code: AlunaKeyErrorCodes.INVALID,
      message: 'Invalid key provided',
      httpStatusCode: 403,
      metadata: rawKey,
    })

    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: FtxHttp.prototype })

    authedRequest.returns(Promise.resolve(rawKey))

    const { parseDetails } = mockParseDetails({
      module: parseDetailsMod,
    })

    // executing
    const exchange = new FtxAuthed({ settings: {}, credentials })

    const {
      error,
      result,
    } = await executeAndCatch(() => exchange.key.fetchDetails())

    // validating

    expect(result).not.to.be.ok

    expect(error instanceof AlunaError).to.be.ok

    expect(error?.message).to.be.eq(alunaError.message)
    expect(error?.code).to.be.eq(alunaError.code)
    expect(error?.httpStatusCode).to.be.eq(alunaError.httpStatusCode)
    expect(error?.metadata).to.be.eq(rawKey)

    expect(authedRequest.callCount).to.be.eq(1)
    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.GET,
      url: getFtxEndpoints(exchange.settings).key.fetchDetails,
      credentials,
    })


    expect(publicRequest.callCount).to.be.eq(0)

    expect(parseDetails.callCount).to.be.eq(0)

  })

})
