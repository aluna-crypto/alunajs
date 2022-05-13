import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { mockParseDetails } from '../../../../../../test/mocks/exchange/modules/key/mockParseDetails'
import { AlunaError } from '../../../../../lib/core/AlunaError'
import { AlunaGenericErrorCodes } from '../../../../../lib/errors/AlunaGenericErrorCodes'
import { AlunaKeyErrorCodes } from '../../../../../lib/errors/AlunaKeyErrorCodes'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { IAlunaKeySchema } from '../../../../../lib/schemas/IAlunaKeySchema'
import { executeAndCatch } from '../../../../../utils/executeAndCatch'
import { PoloniexAuthed } from '../../../PoloniexAuthed'
import { PoloniexHttp } from '../../../PoloniexHttp'
import { getPoloniexEndpoints } from '../../../poloniexSpecs'
import { POLONIEX_KEY_PERMISSIONS } from '../../../test/fixtures/poloniexKey'
import * as parseDetailsMod from './parseDetails'



describe(__filename, () => {

  it('should fetch Poloniex key details just fine', async () => {

    // preparing data
    const credentials: IAlunaCredentialsSchema = {
      key: 'key',
      secret: 'secret',
    }

    const parsedKey: IAlunaKeySchema = {
      accountId: undefined,
      permissions: POLONIEX_KEY_PERMISSIONS,
      meta: {},
    }

    const body = new URLSearchParams()

    body.append('command', 'returnOpenOrders')
    body.append('currencyPair', 'all')
    body.append('nonce', '123456')

    // mocking
    const http = new PoloniexHttp({})

    ImportMock.mockFunction(
      Date.prototype,
      'getTime',
      123456,
    )

    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: PoloniexHttp.prototype })

    authedRequest.returns(Promise.resolve(POLONIEX_KEY_PERMISSIONS))

    const { parseDetails } = mockParseDetails({
      module: parseDetailsMod,
    })

    parseDetails.returns({ key: parsedKey })

    // executing
    const exchange = new PoloniexAuthed({ settings: {}, credentials })

    const {
      key,
      requestWeight,
    } = await exchange.key.fetchDetails()


    // validating
    expect(key).to.be.eq(key)

    expect(requestWeight).to.deep.eq(http.requestWeight)

    expect(authedRequest.callCount).to.be.eq(1)
    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      url: getPoloniexEndpoints(exchange.settings).key.fetchDetails,
      credentials,
      body,
    })


    expect(publicRequest.callCount).to.be.eq(0)

    expect(parseDetails.firstCall.args[0]).to.deep.eq({
      rawKey: POLONIEX_KEY_PERMISSIONS,
    })

  })

  it('should throw an error fetching Poloniex key details', async () => {

    // preparing data
    const credentials: IAlunaCredentialsSchema = {
      key: 'key',
      secret: 'secret',
    }

    const dummyMetadata = {
      some: 'data',
    }

    const error = new AlunaError({
      code: AlunaGenericErrorCodes.UNKNOWN,
      message: 'dummy-error',
      httpStatusCode: 403,
      metadata: dummyMetadata,
    })

    const body = new URLSearchParams()

    body.append('command', 'returnOpenOrders')
    body.append('currencyPair', 'all')
    body.append('nonce', '123456')

    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: PoloniexHttp.prototype })

    ImportMock.mockFunction(
      Date.prototype,
      'getTime',
      123456,
    )

    authedRequest.returns(Promise.reject(error))

    // executing
    const exchange = new PoloniexAuthed({ settings: {}, credentials })

    const {
      error: err,
      result,
    } = await executeAndCatch(() => exchange.key.fetchDetails())

    // validating

    expect(result).not.to.be.ok

    expect(err?.message).to.be.eq('Invalid API key/secret pair.')
    expect(err?.code).to.be.eq(AlunaKeyErrorCodes.INVALID)
    expect(err?.httpStatusCode).to.be.eq(403)
    expect(err?.metadata).to.deep.eq(dummyMetadata)

    expect(authedRequest.callCount).to.be.eq(1)
    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      url: getPoloniexEndpoints(exchange.settings).key.fetchDetails,
      credentials,
      body,
    })


    expect(publicRequest.callCount).to.be.eq(0)

  })

})
