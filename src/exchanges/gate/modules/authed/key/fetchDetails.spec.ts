import { expect } from 'chai'

import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { mockParseDetails } from '../../../../../../test/mocks/exchange/modules/key/mockParseDetails'
import { AlunaError } from '../../../../../lib/core/AlunaError'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaKeyErrorCodes } from '../../../../../lib/errors/AlunaKeyErrorCodes'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { IAlunaKeySchema } from '../../../../../lib/schemas/IAlunaKeySchema'
import { executeAndCatch } from '../../../../../utils/executeAndCatch'
import { GateAuthed } from '../../../GateAuthed'
import { GateHttp } from '../../../GateHttp'
import { getGateEndpoints } from '../../../gateSpecs'
import { GATE_KEY_PERMISSIONS } from '../../../test/fixtures/gateKey'
import * as parseDetailsMod from './parseDetails'



describe(__filename, () => {

  it('should fetch Gate key details just fine', async () => {

    // preparing data
    const http = new GateHttp({})

    const credentials: IAlunaCredentialsSchema = {
      key: 'key',
      secret: 'secret',
    }

    const walletResponse = {
      user_id: 123456,
    }

    const rawKey = {
      ...GATE_KEY_PERMISSIONS,
      accountId: walletResponse.user_id.toString(),
      withdraw: false,
    }

    const orderResponse = new AlunaError({
      code: AlunaKeyErrorCodes.INVALID,
      message: 'dummy',
      metadata: {
        label: 'INVALID_CURRENCY_PAIR',
      },
    })

    const parsedKey: IAlunaKeySchema = {
      accountId: rawKey.accountId,
      permissions: GATE_KEY_PERMISSIONS,
      meta: {},
    }

    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: GateHttp.prototype })

    authedRequest.onFirstCall().returns(Promise.resolve(walletResponse))

    authedRequest.onSecondCall().returns(Promise.reject(orderResponse))


    const { parseDetails } = mockParseDetails({
      module: parseDetailsMod,
    })

    parseDetails.returns({ key: parsedKey })


    // executing
    const exchange = new GateAuthed({ settings: {}, credentials })

    const {
      key,
      requestCount,
    } = await exchange.key.fetchDetails()


    // validating
    expect(key.accountId).to.be.eq(walletResponse.user_id.toString())
    expect(key.permissions.read).to.be.ok
    expect(key.permissions.trade).to.be.ok
    expect(key.permissions.withdraw).to.be.ok

    expect(requestCount).to.deep.eq(http.requestCount)

    expect(authedRequest.callCount).to.be.eq(2)
    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.GET,
      url: getGateEndpoints(exchange.settings).key.fetchDetails,
      credentials,
    })


    expect(publicRequest.callCount).to.be.eq(0)

    expect(parseDetails.firstCall.args[0]).to.deep.eq({
      rawKey,
    })

  })

  it('should fetch Gate key details just fine w/ invalid keys', async () => {

    // preparing data
    const http = new GateHttp({})

    const credentials: IAlunaCredentialsSchema = {
      key: 'key',
      secret: 'secret',
    }

    const rawKey = {
      read: false,
      trade: false,
      withdraw: false,
      accountId: undefined,
    }

    const walletResponse = new AlunaError({
      code: AlunaKeyErrorCodes.INVALID,
      message: 'dummy',
      metadata: {
        label: 'FORBIDDEN',
      },
    })

    const orderResponse = new AlunaError({
      code: AlunaKeyErrorCodes.INVALID,
      message: 'dummy',
      metadata: {
        label: 'FORBIDDEN',
      },
    })

    const parsedKey: IAlunaKeySchema = {
      accountId: undefined,
      permissions: rawKey,
      meta: {},
    }

    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: GateHttp.prototype })

    authedRequest.onFirstCall().returns(Promise.reject(walletResponse))

    authedRequest.onSecondCall().returns(Promise.reject(orderResponse))


    const { parseDetails } = mockParseDetails({
      module: parseDetailsMod,
    })

    parseDetails.returns({ key: parsedKey })


    // executing
    const exchange = new GateAuthed({ settings: {}, credentials })

    const {
      key,
      requestCount,
    } = await exchange.key.fetchDetails()


    // validating
    expect(key.accountId).to.be.eq(undefined)
    expect(key.permissions.read).not.to.be.ok
    expect(key.permissions.trade).not.to.be.ok
    expect(key.permissions.withdraw).not.to.be.ok

    expect(requestCount).to.deep.eq(http.requestCount)

    expect(authedRequest.callCount).to.be.eq(2)
    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.GET,
      url: getGateEndpoints(exchange.settings).key.fetchDetails,
      credentials,
    })


    expect(publicRequest.callCount).to.be.eq(0)

    expect(parseDetails.firstCall.args[0]).to.deep.eq({
      rawKey,
    })

  })

  it('should fetch Gate key details just fine w/ read only', async () => {

    // preparing data
    const http = new GateHttp({})

    const credentials: IAlunaCredentialsSchema = {
      key: 'key',
      secret: 'secret',
    }

    const rawKey = {
      read: false,
      trade: false,
      withdraw: false,
      accountId: undefined,
    }

    const walletResponse = new AlunaError({
      code: AlunaKeyErrorCodes.INVALID,
      message: 'dummy',
      metadata: {
        label: 'FORBIDDEN',
      },
    })

    const orderResponse = new AlunaError({
      code: AlunaKeyErrorCodes.INVALID,
      message: 'dummy',
      metadata: {
        label: 'READ_ONLY',
      },
    })

    const parsedKey: IAlunaKeySchema = {
      accountId: undefined,
      permissions: rawKey,
      meta: {},
    }

    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: GateHttp.prototype })

    authedRequest.onFirstCall().returns(Promise.reject(walletResponse))

    authedRequest.onSecondCall().returns(Promise.reject(orderResponse))


    const { parseDetails } = mockParseDetails({
      module: parseDetailsMod,
    })

    parseDetails.returns({ key: parsedKey })


    // executing
    const exchange = new GateAuthed({ settings: {}, credentials })

    const {
      key,
      requestCount,
    } = await exchange.key.fetchDetails()


    // validating
    expect(key.accountId).to.be.eq(undefined)
    expect(key.permissions.read).not.to.be.ok
    expect(key.permissions.trade).not.to.be.ok
    expect(key.permissions.withdraw).not.to.be.ok

    expect(requestCount).to.deep.eq(http.requestCount)

    expect(authedRequest.callCount).to.be.eq(2)
    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.GET,
      url: getGateEndpoints(exchange.settings).key.fetchDetails,
      credentials,
    })


    expect(publicRequest.callCount).to.be.eq(0)

    expect(parseDetails.firstCall.args[0]).to.deep.eq({
      rawKey,
    })

  })

  it('should throw an error fetching Gate key details', async () => {

    // preparing data
    const credentials: IAlunaCredentialsSchema = {
      key: 'key',
      secret: 'secret',
    }

    const walletResponse = new AlunaError({
      code: AlunaKeyErrorCodes.INVALID,
      message: 'dummy',
      metadata: {
        label: 'UNKNOWN',
      },
    })

    // mocking
    const {
      authedRequest,
    } = mockHttp({ classPrototype: GateHttp.prototype })

    authedRequest.onFirstCall().returns(Promise.reject(walletResponse))

    // executing
    const exchange = new GateAuthed({ settings: {}, credentials })

    const { error } = await executeAndCatch(() => exchange.key.fetchDetails())

    // validating

    expect(error).to.deep.eq(walletResponse)

  })

  it('should throw an error fetching Gate key details', async () => {

    // preparing data
    const credentials: IAlunaCredentialsSchema = {
      key: 'key',
      secret: 'secret',
    }

    const walletResponse = {
      user_id: 123456,
    }

    const orderResponse = new AlunaError({
      code: AlunaKeyErrorCodes.INVALID,
      message: 'dummy',
      metadata: {
        label: 'UNKNOWN',
      },
    })

    // mocking
    const {
      authedRequest,
    } = mockHttp({ classPrototype: GateHttp.prototype })

    authedRequest.onFirstCall().returns(Promise.resolve(walletResponse))
    authedRequest.onSecondCall().returns(Promise.reject(orderResponse))

    // executing
    const exchange = new GateAuthed({ settings: {}, credentials })

    const { error } = await executeAndCatch(() => exchange.key.fetchDetails())

    // validating

    expect(error).to.deep.eq(orderResponse)

  })

})
