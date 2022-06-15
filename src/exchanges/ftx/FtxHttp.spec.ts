import { expect } from 'chai'
import crypto from 'crypto'
import { Agent } from 'https'
import { random } from 'lodash'
import Sinon from 'sinon'
import { ImportMock } from 'ts-mock-imports'

import { testCache } from '../../../test/macros/testCache'
import { mockAxiosRequest } from '../../../test/mocks/axios/request'
import { AlunaHttpVerbEnum } from '../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaProtocolsEnum } from '../../lib/enums/AlunaProxyAgentEnum'
import { IAlunaCredentialsSchema } from '../../lib/schemas/IAlunaCredentialsSchema'
import {
  IAlunaProxySchema,
  IAlunaSettingsSchema,
} from '../../lib/schemas/IAlunaSettingsSchema'
import { mockAssembleRequestConfig } from '../../utils/axios/assembleRequestConfig.mock'
import { mockAlunaCache } from '../../utils/cache/AlunaCache.mock'
import { executeAndCatch } from '../../utils/executeAndCatch'
import * as handleFtxRequestErrorMod from './errors/handleFtxRequestError'
import * as FtxHttpMod from './FtxHttp'



describe(__filename, () => {

  const { FtxHttp } = FtxHttpMod

  const url = 'https://ftx.com/api/path'
  const response = 'response'
  const body = {
    data: 'some-data',
  }
  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'key',
    passphrase: 'key',
  }
  const signedHeader = {
    'FTX-KEY': 'string',
    'FTX-TS': 0,
    'FTX-SIGN': 'string',
  }
  const proxySettings: IAlunaProxySchema = {
    host: 'host',
    port: 8080,
    agent: new Agent(),
    protocol: AlunaProtocolsEnum.HTTPS,
  }
  const settings: IAlunaSettingsSchema = {
    proxySettings,
  }



  const mockDeps = (
    params: {
      mockGenerateAuthHeader?: boolean
      cacheParams?: {
        get?: any
        has?: boolean
        set?: boolean
      }
    } = {},
  ) => {

    const { assembleRequestConfig } = mockAssembleRequestConfig()

    const { request } = mockAxiosRequest()

    const {
      mockGenerateAuthHeader = true,
      cacheParams = {
        get: {},
        has: false,
        set: true,
      },
    } = params

    const generateAuthHeader = ImportMock.mockFunction(
      FtxHttpMod,
      'generateAuthHeader',
      signedHeader,
    )

    const handleFtxRequestError = ImportMock.mockFunction(
      handleFtxRequestErrorMod,
      'handleFtxRequestError',
    )

    if (!mockGenerateAuthHeader) {

      generateAuthHeader.restore()

    }

    const {
      cache,
      hashCacheKey,
    } = mockAlunaCache(cacheParams)

    return {
      cache,
      request,
      hashCacheKey,
      generateAuthHeader,
      assembleRequestConfig,
      handleFtxRequestError,
    }

  }

  it('should execute public request just fine', async () => {

    // preparing data
    const verb = AlunaHttpVerbEnum.POST


    // mocking
    const {
      cache,
      request,
      hashCacheKey,
      generateAuthHeader,
      assembleRequestConfig,
    } = mockDeps()

    const ftxHttp = new FtxHttp({})

    request.returns(Promise.resolve({ data: { result: response } }))


    // executing
    const responseData = await ftxHttp.publicRequest({
      verb,
      url,
      body,
    })


    // validating
    expect(responseData).to.be.eq(response)

    expect(ftxHttp.requestWeight.public).to.be.eq(1)
    expect(ftxHttp.requestWeight.authed).to.be.eq(0)

    expect(request.callCount).to.be.eq(1)
    expect(request.firstCall.args[0]).to.deep.eq({
      url,
      method: verb,
      data: body,
    })

    expect(hashCacheKey.callCount).to.be.eq(1)

    expect(cache.has.callCount).to.be.eq(1)
    expect(cache.set.callCount).to.be.eq(1)
    expect(cache.get.callCount).to.be.eq(0)

    expect(assembleRequestConfig.callCount).to.be.eq(1)
    expect(assembleRequestConfig.firstCall.args[0]).to.deep.eq({
      url,
      method: verb,
      data: body,
      proxySettings: undefined,
    })

    expect(generateAuthHeader.callCount).to.be.eq(0)

  })

  it('should execute authed request just fine', async () => {

    // preparing data
    const ftxHttp = new FtxHttp({})


    // mocking
    const {
      cache,
      request,
      hashCacheKey,
      generateAuthHeader,
      assembleRequestConfig,
    } = mockDeps()

    request.returns(Promise.resolve({ data: { result: response } }))


    // executing
    const responseData = await ftxHttp.authedRequest({
      verb: AlunaHttpVerbEnum.POST,
      url,
      body,
      credentials,
    })


    // validating
    expect(responseData).to.be.eq(response)

    expect(ftxHttp.requestWeight.public).to.be.eq(0)
    expect(ftxHttp.requestWeight.authed).to.be.eq(1)

    expect(request.callCount).to.be.eq(1)
    expect(request.firstCall.args[0]).to.deep.eq({
      url,
      method: AlunaHttpVerbEnum.POST,
      data: body,
      headers: signedHeader,
    })

    expect(assembleRequestConfig.callCount).to.be.eq(1)

    expect(generateAuthHeader.callCount).to.be.eq(1)
    expect(generateAuthHeader.firstCall.args[0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.POST,
      credentials,
      body,
      url,
    })

    expect(hashCacheKey.callCount).to.be.eq(0)

    expect(cache.has.callCount).to.be.eq(0)
    expect(cache.get.callCount).to.be.eq(0)
    expect(cache.set.callCount).to.be.eq(0)

  })

  it('should properly increment request count on public requests', async () => {

    // preparing data
    const ftxHttp = new FtxHttp({})

    const weight = random()
    const pubRequestCount = random()
    const authRequestCount = random()

    ftxHttp.requestWeight.public = pubRequestCount
    ftxHttp.requestWeight.authed = authRequestCount


    // mocking
    const { request } = mockDeps()

    request.returns(Promise.resolve({ data: { result: response } }))


    // executing
    await ftxHttp.publicRequest({
      url,
      body,
      weight,
    })


    // validating
    expect(ftxHttp.requestWeight.public).to.be.eq(pubRequestCount + weight)
    expect(ftxHttp.requestWeight.authed).to.be.eq(authRequestCount)

    expect(request.callCount).to.be.eq(1)

  })

  it('should properly increment request count on authed requests', async () => {

    // preparing data
    const ftxHttp = new FtxHttp({})

    const weight = random()
    const pubRequestCount = random()
    const authRequestCount = random()

    ftxHttp.requestWeight.public = pubRequestCount
    ftxHttp.requestWeight.authed = authRequestCount


    // mocking
    const { request } = mockDeps()

    request.returns(Promise.resolve({ data: { result: response } }))


    // executing
    await ftxHttp.authedRequest({
      url,
      body,
      weight,
      credentials,
    })


    // validating
    expect(ftxHttp.requestWeight.public).to.be.eq(pubRequestCount)
    expect(ftxHttp.requestWeight.authed).to.be.eq(authRequestCount + weight)

    expect(request.callCount).to.be.eq(1)

  })

  it('should properly handle request error on public requests', async () => {

    // preparing data
    const ftxHttp = new FtxHttp({})

    const throwedError = new Error('unknown error')


    // mocking
    const {
      request,
      handleFtxRequestError,
    } = mockDeps()

    request.returns(Promise.reject(throwedError))


    // executing
    const publicRes = await executeAndCatch(() => ftxHttp.publicRequest({
      url,
      body,
    }))


    // validating
    expect(publicRes.result).not.to.be.ok

    expect(request.callCount).to.be.eq(1)

    expect(handleFtxRequestError.callCount).to.be.eq(1)

  })

  it('should properly handle request error on authed requests', async () => {

    // preparing data
    const ftxHttp = new FtxHttp({})

    const throwedError = new Error('unknown error')


    // mocking
    const {
      request,
      handleFtxRequestError,
    } = mockDeps()

    request.returns(Promise.reject(throwedError))


    // executing
    const autheRes = await executeAndCatch(() => ftxHttp.authedRequest({
      url,
      body,
      credentials,
    }))


    // validating
    expect(autheRes.result).not.to.be.ok

    expect(request.callCount).to.be.eq(1)

    expect(handleFtxRequestError.callCount).to.be.eq(1)

  })

  it('should properly use proxy settings on public requests', async () => {

    // preparing data
    const ftxHttp = new FtxHttp({})


    // mocking
    const {
      request,
      assembleRequestConfig,
    } = mockDeps()

    request.returns(Promise.resolve({ data: { result: response } }))


    // executing
    await ftxHttp.publicRequest({
      url,
      body,
      settings,
    })


    // validating
    expect(request.callCount).to.be.eq(1)

    expect(assembleRequestConfig.callCount).to.be.eq(1)
    expect(assembleRequestConfig.firstCall.args[0]).to.deep.eq({
      url,
      method: AlunaHttpVerbEnum.GET,
      data: body,
      proxySettings: settings.proxySettings,
    })

  })

  it('should properly use proxy settings on authed requests', async () => {

    // preparing data
    const ftxHttp = new FtxHttp({})


    // mocking
    const {
      request,
      assembleRequestConfig,
    } = mockDeps()

    request.returns(Promise.resolve({ data: { result: response } }))


    // executing
    await ftxHttp.authedRequest({
      url,
      body,
      settings,
      credentials,
    })


    // validating
    expect(request.callCount).to.be.eq(1)

    expect(assembleRequestConfig.callCount).to.be.eq(1)
    expect(assembleRequestConfig.firstCall.args[0]).to.deep.eq({
      url,
      method: AlunaHttpVerbEnum.POST,
      data: body,
      headers: signedHeader,
      proxySettings: settings.proxySettings,
    })

  })

  it('should generate signed auth header just fine w/ body', async () => {

    // preparing data
    const verb = 'verb' as AlunaHttpVerbEnum
    const path = new URL(url).pathname

    const currentDate = new Date().getTime()

    const createHmacSpy = Sinon.spy(crypto, 'createHmac')

    const updateSpy = Sinon.spy(crypto.Hmac.prototype, 'update')

    const digestSpy = Sinon.spy(crypto.Hmac.prototype, 'digest')

    // mocking
    const dateMock = ImportMock.mockFunction(
      Date.prototype,
      'getTime',
      currentDate,
    )

    // executing
    const signedHash = FtxHttpMod.generateAuthHeader({
      credentials,
      verb,
      body,
      url,
    })

    // validating
    expect(dateMock.callCount).to.be.eq(1)

    expect(createHmacSpy.callCount).to.be.eq(1)
    expect(createHmacSpy.calledWith('sha256', credentials.secret)).to.be.ok

    expect(updateSpy.callCount).to.be.eq(4)
    expect(updateSpy.calledWith(currentDate.toString())).to.be.ok
    expect(updateSpy.calledWith(verb.toUpperCase())).to.be.ok
    expect(updateSpy.calledWith(path)).to.be.ok
    expect(updateSpy.calledWith(JSON.stringify(body))).to.be.ok
    expect(updateSpy.calledWith('')).not.to.be.ok

    expect(digestSpy.callCount).to.be.eq(1)
    expect(digestSpy.calledWith('hex')).to.be.ok

    expect(signedHash['FTX-KEY']).to.be.eq(credentials.key)
    expect(signedHash['FTX-SIGN']).to.deep.eq(digestSpy.returnValues[0])
    expect(signedHash['FTX-TS']).to.be.eq(currentDate)

    Sinon.restore()

  })

  it('should generate signed auth header just fine w/o body', async () => {

    // preparing data
    const verb = 'verb' as AlunaHttpVerbEnum
    const path = new URL(url).pathname

    const currentDate = new Date().getTime()

    const createHmacSpy = Sinon.spy(crypto, 'createHmac')

    const updateSpy = Sinon.spy(crypto.Hmac.prototype, 'update')

    const digestSpy = Sinon.spy(crypto.Hmac.prototype, 'digest')

    // mocking
    const dateMock = ImportMock.mockFunction(
      Date.prototype,
      'getTime',
      currentDate,
    )

    // executing
    const signedHash = FtxHttpMod.generateAuthHeader({
      credentials,
      verb,
      url,
    })

    // validating
    expect(dateMock.callCount).to.be.eq(1)

    expect(createHmacSpy.callCount).to.be.eq(1)
    expect(createHmacSpy.calledWith('sha256', credentials.secret)).to.be.ok

    expect(updateSpy.callCount).to.be.eq(4)
    expect(updateSpy.calledWith(currentDate.toString())).to.be.ok
    expect(updateSpy.calledWith(verb.toUpperCase())).to.be.ok
    expect(updateSpy.calledWith(path)).to.be.ok
    expect(updateSpy.calledWith(JSON.stringify(body))).not.to.be.ok
    expect(updateSpy.calledWith('')).to.be.ok

    expect(digestSpy.callCount).to.be.eq(1)
    expect(digestSpy.calledWith('hex')).to.be.ok

    expect(signedHash['FTX-KEY']).to.be.eq(credentials.key)
    expect(signedHash['FTX-SIGN']).to.deep.eq(digestSpy.returnValues[0])
    expect(signedHash['FTX-TS']).to.be.eq(currentDate)

    Sinon.restore()

  })


  /**
   * Executes macro test.
   * */
  testCache({
    HttpClass: FtxHttp,
    customRequestResponse: { result: response },
  })

})
