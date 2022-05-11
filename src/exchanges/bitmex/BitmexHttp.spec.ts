import { expect } from 'chai'
import crypto from 'crypto'
import { Agent } from 'https'
import { random } from 'lodash'
import { spy } from 'sinon'
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
import * as BitmexHttpMod from './BitmexHttp'
import * as handleBitmexRequestErrorMod from './errors/handleBitmexRequestError'



describe(__filename, () => {

  const {
    BitmexHttp,
    generateAuthHeader,
  } = BitmexHttpMod

  const url = 'https://bitmex.com/api/path'
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
    'Api-Key': 'apikey',
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
      BitmexHttpMod,
      'generateAuthHeader',
      signedHeader,
    )

    const handleBitmexRequestError = ImportMock.mockFunction(
      handleBitmexRequestErrorMod,
      'handleBitmexRequestError',
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
      handleBitmexRequestError,
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

    const bitmexHttp = new BitmexHttp({})

    request.returns(Promise.resolve({ data: response }))


    // executing
    const responseData = await bitmexHttp.publicRequest({
      verb,
      url,
      body,
    })


    // validating
    expect(responseData).to.be.eq(response)

    expect(bitmexHttp.requestWeight.public).to.be.eq(1)
    expect(bitmexHttp.requestWeight.authed).to.be.eq(0)

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
    const bitmexHttp = new BitmexHttp({})


    // mocking
    const {
      cache,
      request,
      hashCacheKey,
      generateAuthHeader,
      assembleRequestConfig,
    } = mockDeps()

    request.returns(Promise.resolve({ data: response }))


    // executing
    const responseData = await bitmexHttp.authedRequest({
      verb: AlunaHttpVerbEnum.POST,
      url,
      body,
      credentials,
    })


    // validating
    expect(responseData).to.be.eq(response)

    expect(bitmexHttp.requestWeight.public).to.be.eq(0)
    expect(bitmexHttp.requestWeight.authed).to.be.eq(1)

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
      path: new URL(url).pathname,
      credentials,
      body,
    })

    expect(hashCacheKey.callCount).to.be.eq(0)

    expect(cache.has.callCount).to.be.eq(0)
    expect(cache.get.callCount).to.be.eq(0)
    expect(cache.set.callCount).to.be.eq(0)

  })

  it('should properly increment request count on public requests', async () => {

    // preparing data
    const bitmexHttp = new BitmexHttp({})

    const weight = random()
    const pubRequestCount = random()
    const authRequestCount = random()

    bitmexHttp.requestWeight.public = pubRequestCount
    bitmexHttp.requestWeight.authed = authRequestCount


    // mocking
    const { request } = mockDeps()

    request.returns(Promise.resolve({ data: response }))


    // executing
    await bitmexHttp.publicRequest({
      url,
      body,
      weight,
    })


    // validating
    expect(bitmexHttp.requestWeight.public).to.be.eq(pubRequestCount + weight)
    expect(bitmexHttp.requestWeight.authed).to.be.eq(authRequestCount)

    expect(request.callCount).to.be.eq(1)

  })

  it('should properly increment request count on authed requests', async () => {

    // preparing data
    const bitmexHttp = new BitmexHttp({})

    const weight = random()
    const pubRequestCount = random()
    const authRequestCount = random()

    bitmexHttp.requestWeight.public = pubRequestCount
    bitmexHttp.requestWeight.authed = authRequestCount


    // mocking
    const { request } = mockDeps()

    request.returns(Promise.resolve({ data: response }))


    // executing
    await bitmexHttp.authedRequest({
      url,
      body,
      weight,
      credentials,
    })


    // validating
    expect(bitmexHttp.requestWeight.public).to.be.eq(pubRequestCount)
    expect(bitmexHttp.requestWeight.authed).to.be.eq(authRequestCount + weight)

    expect(request.callCount).to.be.eq(1)

  })

  it('should properly handle request error on public requests', async () => {

    // preparing data
    const bitmexHttp = new BitmexHttp({})

    const throwedError = new Error('unknown error')


    // mocking
    const {
      request,
      handleBitmexRequestError,
    } = mockDeps()

    request.returns(Promise.reject(throwedError))


    // executing
    const publicRes = await executeAndCatch(() => bitmexHttp.publicRequest({
      url,
      body,
    }))


    // validating
    expect(publicRes.result).not.to.be.ok

    expect(request.callCount).to.be.eq(1)

    expect(handleBitmexRequestError.callCount).to.be.eq(1)

  })

  it('should properly handle request error on authed requests', async () => {

    // preparing data
    const bitmexHttp = new BitmexHttp({})

    const throwedError = new Error('unknown error')


    // mocking
    const {
      request,
      handleBitmexRequestError,
    } = mockDeps()

    request.returns(Promise.reject(throwedError))


    // executing
    const autheRes = await executeAndCatch(() => bitmexHttp.authedRequest({
      url,
      body,
      credentials,
    }))


    // validating
    expect(autheRes.result).not.to.be.ok

    expect(request.callCount).to.be.eq(1)

    expect(handleBitmexRequestError.callCount).to.be.eq(1)

  })

  it('should properly use proxy settings on public requests', async () => {

    // preparing data
    const bitmexHttp = new BitmexHttp({})


    // mocking
    const {
      request,
      assembleRequestConfig,
    } = mockDeps()

    request.returns(Promise.resolve({ data: response }))


    // executing
    await bitmexHttp.publicRequest({
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
    const bitmexHttp = new BitmexHttp({})


    // mocking
    const {
      request,
      assembleRequestConfig,
    } = mockDeps()

    request.returns(Promise.resolve({ data: response }))


    // executing
    await bitmexHttp.authedRequest({
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

  it('should generate signed auth header just fine (w/ body)', async () => {

    // mocking
    const createHmacSpy = spy(crypto, 'createHmac')
    const updateSpy = spy(crypto.Hmac.prototype, 'update')
    const digestSpy = spy(crypto.Hmac.prototype, 'digest')

    const mockedNonce = Date.now().toString()
    const dateNowToStringMock = { toString: () => mockedNonce }
    const dateNowMock = ImportMock.mockFunction(
      Date,
      'now',
      dateNowToStringMock,
    )

    const stringifyBody = 'stringify-body'
    const stringfyMock = ImportMock.mockFunction(
      JSON,
      'stringify',
      stringifyBody,
    )


    // executing
    const path = 'path'
    const verb = 'verb' as AlunaHttpVerbEnum

    const signedHash = generateAuthHeader({
      path,
      verb,
      body,
      credentials,
    })


    // validating
    expect(dateNowMock.callCount).to.be.eq(1)

    expect(createHmacSpy.callCount).to.be.eq(1)
    expect(createHmacSpy.calledWith('sha256', credentials.secret)).to.be.ok

    expect(updateSpy.callCount).to.be.eq(4)
    expect(updateSpy.calledWith(mockedNonce)).to.be.ok
    expect(updateSpy.calledWith(verb.toUpperCase())).to.be.ok
    expect(updateSpy.calledWith(path)).to.be.ok
    expect(updateSpy.calledWith(stringifyBody)).to.be.ok

    expect(stringfyMock.callCount).to.be.eq(1)
    expect(stringfyMock.calledWith(body)).to.be.ok

    expect(digestSpy.callCount).to.be.eq(1)
    expect(digestSpy.calledWith('hex')).to.be.ok

    expect(signedHash['api-expires']).to.deep.eq(mockedNonce)
    expect(signedHash['api-key']).to.deep.eq(credentials.key)
    expect(signedHash['api-signature']).to.deep.eq(digestSpy.returnValues[0])

  })

  it('should generate signed auth header just fine (w/o body)', async () => {

    // mocking
    const createHmacSpy = spy(crypto, 'createHmac')
    const updateSpy = spy(crypto.Hmac.prototype, 'update')
    const digestSpy = spy(crypto.Hmac.prototype, 'digest')

    const mockedNonce = Date.now().toString()
    const dateNowToStringMock = { toString: () => mockedNonce }
    const dateNowMock = ImportMock.mockFunction(
      Date,
      'now',
      dateNowToStringMock,
    )

    const stringfyMock = ImportMock.mockFunction(
      JSON,
      'stringify',
    )


    // executing
    const path = 'path'
    const verb = 'verb' as AlunaHttpVerbEnum

    const signedHash = generateAuthHeader({
      credentials,
      path,
      verb,
    })


    // validating
    expect(dateNowMock.callCount).to.be.eq(1)

    expect(createHmacSpy.callCount).to.be.eq(1)

    expect(stringfyMock.callCount).to.be.eq(0)

    expect(updateSpy.callCount).to.be.eq(4)

    expect(digestSpy.callCount).to.be.eq(1)

    expect(signedHash['api-expires']).to.deep.eq(mockedNonce)
    expect(signedHash['api-key']).to.deep.eq(credentials.key)
    expect(signedHash['api-signature']).to.deep.eq(digestSpy.returnValues[0])

  })


  /**
   * Executes macro test.
   * */
  testCache({ HttpClass: BitmexHttp })

})
