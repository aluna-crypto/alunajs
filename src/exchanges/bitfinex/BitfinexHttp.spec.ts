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
import * as BitfinexHttpMod from './BitfinexHttp'
import * as handleBitfinexRequestErrorMod from './errors/handleBitfinexRequestError'



describe(__filename, () => {

  const { BitfinexHttp } = BitfinexHttpMod

  const url = 'https://bitfinex.com/api/path'
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
      BitfinexHttpMod,
      'generateAuthHeader',
      signedHeader,
    )

    const handleBitfinexRequestError = ImportMock.mockFunction(
      handleBitfinexRequestErrorMod,
      'handleBitfinexRequestError',
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
      handleBitfinexRequestError,
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

    const bitfinexHttp = new BitfinexHttp({})

    request.returns(Promise.resolve({ data: response }))


    // executing
    const responseData = await bitfinexHttp.publicRequest({
      verb,
      url,
      body,
    })


    // validating
    expect(responseData).to.be.eq(response)

    expect(bitfinexHttp.requestCount.public).to.be.eq(1)
    expect(bitfinexHttp.requestCount.authed).to.be.eq(0)

    expect(request.callCount).to.be.eq(1)
    expect(request.args[0][0]).to.deep.eq({
      url,
      method: verb,
      data: body,
    })

    expect(hashCacheKey.callCount).to.be.eq(1)

    expect(cache.has.callCount).to.be.eq(1)
    expect(cache.set.callCount).to.be.eq(1)
    expect(cache.get.callCount).to.be.eq(0)

    expect(assembleRequestConfig.callCount).to.be.eq(1)
    expect(assembleRequestConfig.args[0][0]).to.deep.eq({
      url,
      method: verb,
      data: body,
      proxySettings: undefined,
    })

    expect(generateAuthHeader.callCount).to.be.eq(0)

  })

  it('should execute authed request just fine', async () => {

    // preparing data
    const bitfinexHttp = new BitfinexHttp({})


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
    const responseData = await bitfinexHttp.authedRequest({
      verb: AlunaHttpVerbEnum.POST,
      url,
      body,
      credentials,
    })


    // validating
    expect(responseData).to.be.eq(response)

    expect(bitfinexHttp.requestCount.public).to.be.eq(0)
    expect(bitfinexHttp.requestCount.authed).to.be.eq(1)

    expect(request.callCount).to.be.eq(1)
    expect(request.args[0][0]).to.deep.eq({
      url,
      method: AlunaHttpVerbEnum.POST,
      data: body,
      headers: signedHeader,
    })

    expect(assembleRequestConfig.callCount).to.be.eq(1)

    expect(generateAuthHeader.callCount).to.be.eq(1)
    expect(generateAuthHeader.args[0][0]).to.deep.eq({
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
    const bitfinexHttp = new BitfinexHttp({})

    const weight = random()
    const pubRequestCount = random()
    const authRequestCount = random()

    bitfinexHttp.requestCount.public = pubRequestCount
    bitfinexHttp.requestCount.authed = authRequestCount


    // mocking
    const { request } = mockDeps()

    request.returns(Promise.resolve({ data: response }))


    // executing
    await bitfinexHttp.publicRequest({
      url,
      body,
      weight,
    })


    // validating
    expect(bitfinexHttp.requestCount.public).to.be.eq(pubRequestCount + weight)
    expect(bitfinexHttp.requestCount.authed).to.be.eq(authRequestCount)

    expect(request.callCount).to.be.eq(1)

  })

  it('should properly increment request count on authed requests', async () => {

    // preparing data
    const bitfinexHttp = new BitfinexHttp({})

    const weight = random()
    const pubRequestCount = random()
    const authRequestCount = random()

    bitfinexHttp.requestCount.public = pubRequestCount
    bitfinexHttp.requestCount.authed = authRequestCount


    // mocking
    const { request } = mockDeps()

    request.returns(Promise.resolve({ data: response }))


    // executing
    await bitfinexHttp.authedRequest({
      url,
      body,
      weight,
      credentials,
    })


    // validating
    expect(bitfinexHttp.requestCount.public).to.be.eq(pubRequestCount)
    expect(bitfinexHttp.requestCount.authed).to.be.eq(authRequestCount + weight)

    expect(request.callCount).to.be.eq(1)

  })

  it('should properly handle request error on public requests', async () => {

    // preparing data
    const bitfinexHttp = new BitfinexHttp({})

    const throwedError = new Error('unknown error')


    // mocking
    const {
      request,
      handleBitfinexRequestError,
    } = mockDeps()

    request.returns(Promise.reject(throwedError))


    // executing
    const publicRes = await executeAndCatch(() => bitfinexHttp.publicRequest({
      url,
      body,
    }))


    // validating
    expect(publicRes.result).not.to.be.ok

    expect(request.callCount).to.be.eq(1)

    expect(handleBitfinexRequestError.callCount).to.be.eq(1)

  })

  it('should properly handle request error on authed requests', async () => {

    // preparing data
    const bitfinexHttp = new BitfinexHttp({})

    const throwedError = new Error('unknown error')


    // mocking
    const {
      request,
      handleBitfinexRequestError,
    } = mockDeps()

    request.returns(Promise.reject(throwedError))


    // executing
    const autheRes = await executeAndCatch(() => bitfinexHttp.authedRequest({
      url,
      body,
      credentials,
    }))


    // validating
    expect(autheRes.result).not.to.be.ok

    expect(request.callCount).to.be.eq(1)

    expect(handleBitfinexRequestError.callCount).to.be.eq(1)

  })

  it('should properly use proxy settings on public requests', async () => {

    // preparing data
    const bitfinexHttp = new BitfinexHttp({})


    // mocking
    const {
      request,
      assembleRequestConfig,
    } = mockDeps()

    request.returns(Promise.resolve({ data: response }))


    // executing
    await bitfinexHttp.publicRequest({
      url,
      body,
      settings,
    })


    // validating
    expect(request.callCount).to.be.eq(1)

    expect(assembleRequestConfig.callCount).to.be.eq(1)
    expect(assembleRequestConfig.args[0][0]).to.deep.eq({
      url,
      method: AlunaHttpVerbEnum.GET,
      data: body,
      proxySettings: settings.proxySettings,
    })

  })

  it('should properly use proxy settings on authed requests', async () => {

    // preparing data
    const bitfinexHttp = new BitfinexHttp({})


    // mocking
    const {
      request,
      assembleRequestConfig,
    } = mockDeps()

    request.returns(Promise.resolve({ data: response }))


    // executing
    await bitfinexHttp.authedRequest({
      url,
      settings,
      credentials,
    })


    // validating
    expect(request.callCount).to.be.eq(1)

    expect(assembleRequestConfig.callCount).to.be.eq(1)
    expect(assembleRequestConfig.args[0][0]).to.deep.eq({
      url,
      method: AlunaHttpVerbEnum.POST,
      data: {},
      headers: signedHeader,
      proxySettings: settings.proxySettings,
    })

  })

  it('should generate signed auth header just fine(w/ body)', async () => {

    // preparing data
    const currentDate = Date.now()

    const path = new URL(url).pathname
    const nonce = (currentDate * 1000).toString()
    const payload = `/api${path}${nonce}${JSON.stringify(body)}`

    const expectedSig = crypto.createHmac('sha384', credentials.secret)
      .update(payload)
      .digest('hex')


    // mocking
    const mockedDateNow = ImportMock.mockFunction(
      Date,
      'now',
      currentDate,
    )

    const createHmacSpy = spy(crypto, 'createHmac')
    const updateSpy = spy(crypto.Hmac.prototype, 'update')
    const digestSpy = spy(crypto.Hmac.prototype, 'digest')


    // executing
    const headers = BitfinexHttpMod.generateAuthHeader({
      credentials,
      body,
      url,
    })


    // validating
    expect(mockedDateNow.callCount).to.be.eq(1)

    expect(createHmacSpy.callCount).to.be.eq(1)
    expect(createHmacSpy.calledWith('sha384', credentials.secret)).to.be.ok

    expect(updateSpy.callCount).to.be.eq(1)
    expect(updateSpy.calledWith(payload)).to.be.ok

    expect(digestSpy.callCount).to.be.eq(1)
    expect(digestSpy.calledWith('hex')).to.be.ok

    expect(headers['bfx-apikey']).to.be.eq(credentials.key)
    expect(headers['bfx-nonce']).to.be.eq(nonce)
    expect(headers['bfx-signature']).to.be.eq(expectedSig)

  })

  /**
   * Executes macro test.
   */
  testCache({ HttpClass: BitfinexHttp })

})
