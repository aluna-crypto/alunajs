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
import * as BittrexHttpMod from './BittrexHttp'
import * as handleBittrexRequestErrorMod from './errors/handleBittrexRequestError'



describe(__filename, () => {

  const { BittrexHttp } = BittrexHttpMod

  const url = 'https://bittrex.com/api/path'
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
      BittrexHttpMod,
      'generateAuthHeader',
      signedHeader,
    )

    const handleBittrexRequestError = ImportMock.mockFunction(
      handleBittrexRequestErrorMod,
      'handleBittrexRequestError',
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
      handleBittrexRequestError,
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

    const bittrexHttp = new BittrexHttp({})

    request.returns(Promise.resolve({ data: response }))


    // executing
    const responseData = await bittrexHttp.publicRequest({
      verb,
      url,
      body,
    })


    // validating
    expect(responseData).to.be.eq(response)

    expect(bittrexHttp.requestCount.public).to.be.eq(1)
    expect(bittrexHttp.requestCount.authed).to.be.eq(0)

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
    const bittrexHttp = new BittrexHttp({})


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
    const responseData = await bittrexHttp.authedRequest({
      verb: AlunaHttpVerbEnum.POST,
      url,
      body,
      credentials,
    })


    // validating
    expect(responseData).to.be.eq(response)

    expect(bittrexHttp.requestCount.public).to.be.eq(0)
    expect(bittrexHttp.requestCount.authed).to.be.eq(1)

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
      verb: AlunaHttpVerbEnum.POST,
      path: new URL(url).pathname,
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
    const bittrexHttp = new BittrexHttp({})

    const weight = random()
    const pubRequestCount = random()
    const authRequestCount = random()

    bittrexHttp.requestCount.public = pubRequestCount
    bittrexHttp.requestCount.authed = authRequestCount


    // mocking
    const { request } = mockDeps()

    request.returns(Promise.resolve({ data: response }))


    // executing
    await bittrexHttp.publicRequest({
      url,
      body,
      weight,
    })


    // validating
    expect(bittrexHttp.requestCount.public).to.be.eq(pubRequestCount + weight)
    expect(bittrexHttp.requestCount.authed).to.be.eq(authRequestCount)

    expect(request.callCount).to.be.eq(1)

  })

  it('should properly increment request count on authed requests', async () => {

    // preparing data
    const bittrexHttp = new BittrexHttp({})

    const weight = random()
    const pubRequestCount = random()
    const authRequestCount = random()

    bittrexHttp.requestCount.public = pubRequestCount
    bittrexHttp.requestCount.authed = authRequestCount


    // mocking
    const { request } = mockDeps()

    request.returns(Promise.resolve({ data: response }))


    // executing
    await bittrexHttp.authedRequest({
      url,
      body,
      weight,
      credentials,
    })


    // validating
    expect(bittrexHttp.requestCount.public).to.be.eq(pubRequestCount)
    expect(bittrexHttp.requestCount.authed).to.be.eq(authRequestCount + weight)

    expect(request.callCount).to.be.eq(1)

  })

  it('should properly handle request error on public requests', async () => {

    // preparing data
    const bittrexHttp = new BittrexHttp({})

    const throwedError = new Error('unknown error')


    // mocking
    const {
      request,
      handleBittrexRequestError,
    } = mockDeps()

    request.returns(Promise.reject(throwedError))


    // executing
    const publicRes = await executeAndCatch(() => bittrexHttp.publicRequest({
      url,
      body,
    }))


    // validating
    expect(publicRes.result).not.to.be.ok

    expect(request.callCount).to.be.eq(1)

    expect(handleBittrexRequestError.callCount).to.be.eq(1)

  })

  it('should properly handle request error on authed requests', async () => {

    // preparing data
    const bittrexHttp = new BittrexHttp({})

    const throwedError = new Error('unknown error')


    // mocking
    const {
      request,
      handleBittrexRequestError,
    } = mockDeps()

    request.returns(Promise.reject(throwedError))


    // executing
    const autheRes = await executeAndCatch(() => bittrexHttp.authedRequest({
      url,
      body,
      credentials,
    }))


    // validating
    expect(autheRes.result).not.to.be.ok

    expect(request.callCount).to.be.eq(1)

    expect(handleBittrexRequestError.callCount).to.be.eq(1)

  })

  it('should properly use proxy settings on public requests', async () => {

    // preparing data
    const bittrexHttp = new BittrexHttp({})


    // mocking
    const {
      request,
      assembleRequestConfig,
    } = mockDeps()

    request.returns(Promise.resolve({ data: response }))


    // executing
    await bittrexHttp.publicRequest({
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
    const bittrexHttp = new BittrexHttp({})


    // mocking
    const {
      request,
      assembleRequestConfig,
    } = mockDeps()

    request.returns(Promise.resolve({ data: response }))


    // executing
    await bittrexHttp.authedRequest({
      url,
      body,
      settings,
      credentials,
    })


    // validating
    expect(request.callCount).to.be.eq(1)

    expect(assembleRequestConfig.callCount).to.be.eq(1)
    expect(assembleRequestConfig.args[0][0]).to.deep.eq({
      url,
      method: AlunaHttpVerbEnum.POST,
      data: body,
      headers: signedHeader,
      proxySettings: settings.proxySettings,
    })

  })

  it('should generate signed auth header just fine', async () => {

    // preparing data
    const createHmacSpy = spy(crypto, 'createHmac')
    const createHashSpy = spy(crypto, 'createHash')

    const updateSpy = spy(crypto.Hmac.prototype, 'update')
    const updateHashSpy = spy(crypto.Hash.prototype, 'update')

    const digestHmacSpy = spy(crypto.Hmac.prototype, 'digest')
    const digestHashSpy = spy(crypto.Hash.prototype, 'digest')

    const path = 'path'
    const verb = 'verb' as AlunaHttpVerbEnum

    const stringifyBody = 'stringify-body'

    const currentDate = 'current-date'

    const timestampMock = { toString: () => currentDate }


    // mocking
    const dateMock = ImportMock.mockFunction(
      Date.prototype,
      'getTime',
      timestampMock,
    )

    const stringfyMock = ImportMock.mockFunction(
      JSON,
      'stringify',
      stringifyBody,
    )


    // executing
    const contentHash = crypto
      .createHash('sha512')
      .update(body ? JSON.stringify(body) : '')
      .digest('hex')

    const signedHash = BittrexHttpMod.generateAuthHeader({
      credentials,
      path,
      verb,
      body,
      url,
    })


    // validating
    expect(dateMock.callCount).to.be.eq(1)

    expect(createHmacSpy.callCount).to.be.eq(1)
    expect(createHashSpy.callCount).to.be.eq(2)
    expect(createHashSpy
      .secondCall
      .calledWith('sha512')).to.be.ok
    expect(createHmacSpy
      .firstCall
      .calledWith('sha512', credentials.secret)).to.be.ok

    expect(updateSpy.callCount).to.be.eq(1)
    expect(updateHashSpy.callCount).to.be.eq(2)
    expect(updateHashSpy.secondCall.calledWith(JSON.stringify(body))).to.be.ok

    expect(stringfyMock.callCount).to.be.eq(3)
    expect(stringfyMock.calledWith(body)).to.be.ok

    expect(digestHmacSpy.callCount).to.be.eq(1)
    expect(digestHmacSpy.calledWith('hex')).to.be.ok

    expect(digestHashSpy.callCount).to.be.eq(2)
    expect(digestHashSpy.calledWith('hex')).to.be.ok


    // mocking
    const preSigned = [
      timestampMock,
      url,
      verb.toUpperCase(),
      contentHash,
    ].join('')


    // executing
    const signedHeader = crypto
      .createHmac('sha512', credentials.secret)
      .update(preSigned)
      .digest('hex')

    const signedHash2 = BittrexHttpMod.generateAuthHeader({
      credentials,
      path,
      verb,
      url,
      // without a body
    })


    // validating
    expect(signedHash['Api-Content-Hash']).to.deep.eq(contentHash)
    expect(signedHash['Api-Key']).to.deep.eq(credentials.key)
    expect(signedHash['Api-Timestamp']).to.deep.eq(timestampMock)
    expect(signedHash['Api-Signature']).to.deep.eq(signedHeader)

    expect(dateMock.callCount).to.be.eq(2)

    expect(createHmacSpy.callCount).to.be.eq(3)

    expect(stringfyMock.callCount).to.be.eq(3)
    expect(stringfyMock.calledWith('')).not.to.be.ok

    expect(updateSpy.callCount).to.be.eq(3)

    expect(digestHmacSpy.callCount).to.be.eq(3)

    const contentHash2 = crypto.createHash('sha512').update('').digest('hex')

    expect(signedHash2['Api-Content-Hash']).to.deep.eq(contentHash2)
    expect(
      signedHash2['Api-Key'],
    ).to.deep.eq(credentials.key)
    expect(signedHash2['Api-Timestamp']).to.deep.eq(timestampMock)

  })


  /**
   * Executes macro test.
   * */
  testCache({ HttpClass: BittrexHttp })

})
