import { expect } from 'chai'
import { Agent } from 'https'
import { random } from 'lodash'
import Sinon from 'sinon'
import { ImportMock } from 'ts-mock-imports'
import crypto from 'crypto'

import { testCache } from '../../../test/macros/testCache'
import { mockAxiosRequest } from '../../../test/mocks/axios/request'
import { IAlunaHttpPublicParams } from '../../lib/core/IAlunaHttp'
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
import * as handleValrRequestErrorMod from './errors/handleValrRequestError'
import * as ValrHttpMod from './ValrHttp'



describe.skip(__filename, () => {

  const { ValrHttp } = ValrHttpMod

  const url = 'https://valr.com/api/path'
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
      ValrHttpMod,
      'generateAuthHeader',
      signedHeader,
    )

    const handleValrRequestError = ImportMock.mockFunction(
      handleValrRequestErrorMod,
      'handleValrRequestError',
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
      handleValrRequestError,
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

    const valrHttp = new ValrHttp()

    request.returns(Promise.resolve({ data: response }))


    // executing
    const responseData = await valrHttp.publicRequest({
      verb,
      url,
      body,
    })


    // validating
    expect(responseData).to.be.eq(response)

    expect(valrHttp.requestCount.public).to.be.eq(1)
    expect(valrHttp.requestCount.authed).to.be.eq(0)

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
    const valrHttp = new ValrHttp()


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
    const responseData = await valrHttp.authedRequest({
      verb: AlunaHttpVerbEnum.POST,
      url,
      body,
      credentials,
    })


    // validating
    expect(responseData).to.be.eq(response)

    expect(valrHttp.requestCount.public).to.be.eq(0)
    expect(valrHttp.requestCount.authed).to.be.eq(1)

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
    const valrHttp = new ValrHttp()

    const weight = random()
    const pubRequestCount = random()
    const authRequestCount = random()

    valrHttp.requestCount.public = pubRequestCount
    valrHttp.requestCount.authed = authRequestCount


    // mocking
    const { request } = mockDeps()

    request.returns(Promise.resolve({ data: response }))


    // executing
    await valrHttp.publicRequest({
      url,
      body,
      weight,
    })


    // validating
    expect(valrHttp.requestCount.public).to.be.eq(pubRequestCount + weight)
    expect(valrHttp.requestCount.authed).to.be.eq(authRequestCount)

    expect(request.callCount).to.be.eq(1)

  })

  it('should properly increment request count on authed requests', async () => {

    // preparing data
    const valrHttp = new ValrHttp()

    const weight = random()
    const pubRequestCount = random()
    const authRequestCount = random()

    valrHttp.requestCount.public = pubRequestCount
    valrHttp.requestCount.authed = authRequestCount


    // mocking
    const { request } = mockDeps()

    request.returns(Promise.resolve({ data: response }))


    // executing
    await valrHttp.authedRequest({
      url,
      body,
      weight,
      credentials,
    })


    // validating
    expect(valrHttp.requestCount.public).to.be.eq(pubRequestCount)
    expect(valrHttp.requestCount.authed).to.be.eq(authRequestCount + weight)

    expect(request.callCount).to.be.eq(1)

  })

  it('should properly handle request error on public requests', async () => {

    // preparing data
    const valrHttp = new ValrHttp()

    const throwedError = new Error('unknown error')


    // mocking
    const {
      request,
      handleValrRequestError,
    } = mockDeps()

    request.returns(Promise.reject(throwedError))


    // executing
    const publicRes = await executeAndCatch(() => valrHttp.publicRequest({
      url,
      body,
    }))


    // validating
    expect(publicRes.result).not.to.be.ok

    expect(request.callCount).to.be.eq(1)

    expect(handleValrRequestError.callCount).to.be.eq(1)

  })

  it('should properly handle request error on authed requests', async () => {

    // preparing data
    const valrHttp = new ValrHttp()

    const throwedError = new Error('unknown error')


    // mocking
    const {
      request,
      handleValrRequestError,
    } = mockDeps()

    request.returns(Promise.reject(throwedError))


    // executing
    const autheRes = await executeAndCatch(() => valrHttp.authedRequest({
      url,
      body,
      credentials,
    }))


    // validating
    expect(autheRes.result).not.to.be.ok

    expect(request.callCount).to.be.eq(1)

    expect(handleValrRequestError.callCount).to.be.eq(1)

  })

  it('should properly use proxy settings on public requests', async () => {

    // preparing data
    const valrHttp = new ValrHttp()


    // mocking
    const {
      request,
      assembleRequestConfig,
    } = mockDeps()

    request.returns(Promise.resolve({ data: response }))


    // executing
    await valrHttp.publicRequest({
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
    const valrHttp = new ValrHttp()


    // mocking
    const {
      request,
      assembleRequestConfig,
    } = mockDeps()

    request.returns(Promise.resolve({ data: response }))


    // executing
    await valrHttp.authedRequest({
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

  it('should generate signed auth header just fine w/ body', async () => {

    // preparing data
    const path = 'path'
    const verb = 'verb' as AlunaHttpVerbEnum
    const stringifyBody = 'stringify-body'

    const currentDate = Date.now()

    // mocking
    const dateMock = ImportMock.mockFunction(
      Date,
      'now',
      currentDate,
    )

    const createHmacSpy = Sinon.spy(crypto, 'createHmac')

    const updateSpy = Sinon.spy(crypto.Hmac.prototype, 'update')

    const digestSpy = Sinon.spy(crypto.Hmac.prototype, 'digest')

    const stringfyMock = ImportMock.mockFunction(
      JSON,
      'stringify',
      stringifyBody,
    )

    // executing
    const signedHash = ValrHttpMod.generateAuthHeader({
      credentials,
      path,
      verb,
      body,
      url,
    })

    // validating
    expect(dateMock.callCount).to.be.eq(1)

    expect(createHmacSpy.callCount).to.be.eq(1)
    expect(createHmacSpy.calledWith('sha512', credentials.secret)).to.be.ok

    expect(updateSpy.callCount).to.be.eq(4)
    expect(updateSpy.calledWith(currentDate.toString())).to.be.ok
    expect(updateSpy.calledWith(verb.toUpperCase())).to.be.ok
    expect(updateSpy.calledWith(path)).to.be.ok
    expect(updateSpy.calledWith(stringifyBody)).to.be.ok

    expect(stringfyMock.callCount).to.be.eq(1)
    expect(stringfyMock.calledWith(body)).to.be.ok

    expect(digestSpy.callCount).to.be.eq(1)
    expect(digestSpy.calledWith('hex')).to.be.ok

    expect(signedHash['X-VALR-API-KEY']).to.deep.eq(credentials.key)
    expect(signedHash['X-VALR-SIGNATURE'])
      .to.deep.eq(digestSpy.returnValues[0])
    expect(signedHash['X-VALR-TIMESTAMP']).to.deep.eq(currentDate)

    Sinon.restore()

  })

  it('should generate signed auth header just fine w/o body', async () => {

    // preparing data
    const path = 'path'
    const verb = 'verb' as AlunaHttpVerbEnum
    const stringifyBody = 'stringify-body'

    const currentDate = Date.now()

    // mocking
    const dateMock = ImportMock.mockFunction(
      Date,
      'now',
      currentDate,
    )

    const createHmacSpy = Sinon.spy(crypto, 'createHmac')

    const updateSpy = Sinon.spy(crypto.Hmac.prototype, 'update')

    const digestSpy = Sinon.spy(crypto.Hmac.prototype, 'digest')

    const stringfyMock = ImportMock.mockFunction(
      JSON,
      'stringify',
      stringifyBody,
    )

    // executing
    const signedHash = ValrHttpMod.generateAuthHeader({
      credentials,
      path,
      verb,
      url,
    })

    // validating
    expect(dateMock.callCount).to.be.eq(1)

    expect(updateSpy.callCount).to.be.eq(4)

    expect(stringfyMock.callCount).to.be.eq(1)
    expect(stringfyMock.calledWith('')).to.be.ok

    expect(digestSpy.callCount).to.be.eq(1)
    expect(digestSpy.calledWith('hex')).to.be.ok

    expect(signedHash['X-VALR-API-KEY']).to.deep.eq(credentials.key)
    expect(signedHash['X-VALR-SIGNATURE'])
      .to.deep.eq(digestSpy.returnValues[0])
    expect(signedHash['X-VALR-TIMESTAMP']).to.deep.eq(currentDate)

    Sinon.restore()

  })


  /**
   * Executes macro test.
   * */
  testCache({
    cacheResult: response,
    callMethod: async () => {

      const params: IAlunaHttpPublicParams = {
        url,
        body,
        verb: AlunaHttpVerbEnum.GET,
      }

      await new ValrHttp().publicRequest(params)

    },

  })

})
