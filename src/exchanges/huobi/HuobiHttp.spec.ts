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
import * as handleHuobiRequestErrorMod from './errors/handleHuobiRequestError'
import * as HuobiHttpMod from './HuobiHttp'



describe(__filename, () => {

  const { HuobiHttp } = HuobiHttpMod

  const url = 'https://huobi.com/api/path'
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
    'Content-Type': 'application/json',
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
  const query = 'dummy=dummy'
  const urlWithQuery = `${url}?${query}`


  const mockDeps = (
    params: {
      mockGenerateAuthHeader?: boolean
      cacheParams?: {
        get?: any
        has?: boolean
        set?: boolean
      }
      signedHeaderResponse?: HuobiHttpMod.IHuobiSignedHeaders
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
      signedHeaderResponse = {
        queryParamsWithSignature: new URLSearchParams(query),
      },
    } = params

    const generateAuthHeader = ImportMock.mockFunction(
      HuobiHttpMod,
      'generateAuthHeader',
      signedHeaderResponse,
    )

    const handleHuobiRequestError = ImportMock.mockFunction(
      handleHuobiRequestErrorMod,
      'handleHuobiRequestError',
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
      handleHuobiRequestError,
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

    const huobiHttp = new HuobiHttp({})

    request.returns(Promise.resolve({ data: { data: response } }))


    // executing
    const responseData = await huobiHttp.publicRequest({
      verb,
      url,
      body,
    })


    // validating
    expect(responseData).to.be.eq(response)

    expect(huobiHttp.requestWeight.public).to.be.eq(1)
    expect(huobiHttp.requestWeight.authed).to.be.eq(0)

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
    const huobiHttp = new HuobiHttp({})


    // mocking
    const {
      cache,
      request,
      hashCacheKey,
      generateAuthHeader,
      assembleRequestConfig,
    } = mockDeps()

    request.returns(Promise.resolve({ data: { data: response } }))


    // executing
    const responseData = await huobiHttp.authedRequest({
      verb: AlunaHttpVerbEnum.POST,
      url,
      body,
      credentials,
      query,
    })


    // validating
    expect(responseData).to.be.eq(response)

    expect(huobiHttp.requestWeight.public).to.be.eq(0)
    expect(huobiHttp.requestWeight.authed).to.be.eq(1)

    expect(request.callCount).to.be.eq(1)
    expect(request.firstCall.args[0]).to.deep.eq({
      url: urlWithQuery,
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
      query,
    })

    expect(hashCacheKey.callCount).to.be.eq(0)

    expect(cache.has.callCount).to.be.eq(0)
    expect(cache.get.callCount).to.be.eq(0)
    expect(cache.set.callCount).to.be.eq(0)

  })

  it('should properly increment request count on public requests', async () => {

    // preparing data
    const huobiHttp = new HuobiHttp({})

    const weight = random()
    const pubRequestCount = random()
    const authRequestCount = random()

    huobiHttp.requestWeight.public = pubRequestCount
    huobiHttp.requestWeight.authed = authRequestCount


    // mocking
    const { request } = mockDeps()

    request.returns(Promise.resolve({ data: { data: response } }))


    // executing
    await huobiHttp.publicRequest({
      url,
      body,
      weight,
    })


    // validating
    expect(huobiHttp.requestWeight.public).to.be.eq(pubRequestCount + weight)
    expect(huobiHttp.requestWeight.authed).to.be.eq(authRequestCount)

    expect(request.callCount).to.be.eq(1)

  })

  it('should properly increment request count on authed requests', async () => {

    // preparing data
    const huobiHttp = new HuobiHttp({})

    const weight = random()
    const pubRequestCount = random()
    const authRequestCount = random()

    huobiHttp.requestWeight.public = pubRequestCount
    huobiHttp.requestWeight.authed = authRequestCount


    // mocking
    const { request } = mockDeps()

    request.returns(Promise.resolve({ data: { data: response } }))


    // executing
    await huobiHttp.authedRequest({
      url,
      body,
      weight,
      credentials,
    })


    // validating
    expect(huobiHttp.requestWeight.public).to.be.eq(pubRequestCount)
    expect(huobiHttp.requestWeight.authed).to.be.eq(authRequestCount + weight)

    expect(request.callCount).to.be.eq(1)

  })

  it('should properly handle request error on public requests', async () => {

    // preparing data
    const huobiHttp = new HuobiHttp({})

    const throwedError = new Error('unknown error')


    // mocking
    const {
      request,
      handleHuobiRequestError,
    } = mockDeps()

    request.returns(Promise.reject(throwedError))


    // executing
    const publicRes = await executeAndCatch(() => huobiHttp.publicRequest({
      url,
      body,
    }))


    // validating
    expect(publicRes.result).not.to.be.ok

    expect(request.callCount).to.be.eq(1)

    expect(handleHuobiRequestError.callCount).to.be.eq(1)

  })

  it('should properly handle request error on authed requests', async () => {

    // preparing data
    const huobiHttp = new HuobiHttp({})

    const throwedError = new Error('unknown error')


    // mocking
    const {
      request,
      handleHuobiRequestError,
    } = mockDeps()

    request.returns(Promise.reject(throwedError))


    // executing
    const autheRes = await executeAndCatch(() => huobiHttp.authedRequest({
      url,
      body,
      credentials,
    }))


    // validating
    expect(autheRes.result).not.to.be.ok

    expect(request.callCount).to.be.eq(1)

    expect(handleHuobiRequestError.callCount).to.be.eq(1)

  })

  it('should properly handle request returning status error property', async () => {

    // preparing data
    const huobiHttp = new HuobiHttp({})

    const throwedError = {
      status: 'error',
    }


    // mocking
    const {
      request,
      handleHuobiRequestError,
    } = mockDeps()

    request.returns(Promise.resolve({ data: throwedError }))


    // executing
    const autheRes = await executeAndCatch(() => huobiHttp.authedRequest({
      url,
      body,
      credentials,
    }))


    // validating
    expect(autheRes.result).not.to.be.ok

    expect(request.callCount).to.be.eq(1)

    expect(handleHuobiRequestError.callCount).to.be.eq(1)

    expect(handleHuobiRequestError.calledWith({
      error: throwedError,
    })).to.be.ok

  })

  it('should properly handle request returning message not success', async () => {

    // preparing data
    const huobiHttp = new HuobiHttp({})

    const throwedError = {
      message: 'error',
    }


    // mocking
    const {
      request,
      handleHuobiRequestError,
    } = mockDeps()

    request.returns(Promise.resolve({ data: throwedError }))


    // executing
    const autheRes = await executeAndCatch(() => huobiHttp.authedRequest({
      url,
      body,
      credentials,
    }))


    // validating
    expect(autheRes.result).not.to.be.ok

    expect(request.callCount).to.be.eq(1)

    expect(handleHuobiRequestError.callCount).to.be.eq(1)

    expect(handleHuobiRequestError.calledWith({
      error: throwedError,
    })).to.be.ok

  })

  it('should properly use proxy settings on public requests', async () => {

    // preparing data
    const huobiHttp = new HuobiHttp({})


    // mocking
    const {
      request,
      assembleRequestConfig,
    } = mockDeps()

    request.returns(Promise.resolve({ data: response }))


    // executing
    await huobiHttp.publicRequest({
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
    const huobiHttp = new HuobiHttp({})


    // mocking
    const {
      request,
      assembleRequestConfig,
    } = mockDeps()

    request.returns(Promise.resolve({ data: response }))


    // executing
    await huobiHttp.authedRequest({
      url,
      body,
      settings,
      credentials,
    })


    // validating
    expect(request.callCount).to.be.eq(1)

    expect(assembleRequestConfig.callCount).to.be.eq(1)
    expect(assembleRequestConfig.firstCall.args[0]).to.deep.eq({
      url: urlWithQuery,
      method: AlunaHttpVerbEnum.POST,
      data: body,
      headers: signedHeader,
      proxySettings: settings.proxySettings,
    })

  })

  it('should generate signed auth header just fine w query', async () => {

    // preparing data
    const verb = 'verb' as AlunaHttpVerbEnum

    const currentDate = new Date()

    const path = new URL(url).pathname
    const baseURL = new URL(url).host

    const searchParams = new URLSearchParams()

    searchParams.append('AccessKeyId', credentials.key)
    searchParams.append('SignatureMethod', 'HmacSHA256')
    searchParams.append('SignatureVersion', '2')
    searchParams.append('Timestamp', currentDate.toISOString().slice(0, -5))

    const searchParamsWithQuery = new URLSearchParams(`${searchParams.toString()}&${query}`)

    const meta = [
      verb.toUpperCase(),
      baseURL,
      path,
      searchParamsWithQuery.toString(),
    ].join('\n')

    // mocking

    const createHmacSpy = Sinon.spy(crypto, 'createHmac')

    const updateSpy = Sinon.spy(crypto.Hmac.prototype, 'update')

    const digestSpy = Sinon.spy(crypto.Hmac.prototype, 'digest')

    const dateMock = ImportMock.mockFunction(
      global,
      'Date',
      currentDate,
    )

    // executing
    const signedHash = HuobiHttpMod.generateAuthHeader({
      credentials,
      verb,
      url,
      query,
    })

    searchParamsWithQuery.append('Signature', digestSpy.returnValues[0])
    // validating

    expect(createHmacSpy.callCount).to.be.eq(1)
    expect(createHmacSpy.calledWith('sha256', credentials.secret)).to.be.ok

    expect(updateSpy.callCount).to.be.eq(1)
    expect(updateSpy.calledWith(meta)).to.be.ok

    expect(digestSpy.callCount).to.be.eq(1)
    expect(digestSpy.calledWith('base64')).to.be.ok

    expect(dateMock.callCount).to.be.eq(1)
    expect(signedHash.queryParamsWithSignature.toString()).to.be.eq(searchParamsWithQuery.toString())

    Sinon.restore()

  })

  it('should generate signed auth header just fine w/o query', async () => {

    // preparing data
    const verb = 'verb' as AlunaHttpVerbEnum

    const currentDate = new Date()

    const path = new URL(url).pathname
    const baseURL = new URL(url).host

    const queryParams = new URLSearchParams()

    queryParams.append('AccessKeyId', credentials.key)
    queryParams.append('SignatureMethod', 'HmacSHA256')
    queryParams.append('SignatureVersion', '2')
    queryParams.append('Timestamp', currentDate.toISOString().slice(0, -5))


    const meta = [
      verb.toUpperCase(),
      baseURL,
      path,
      queryParams.toString(),
    ].join('\n')

    // mocking

    const createHmacSpy = Sinon.spy(crypto, 'createHmac')

    const updateSpy = Sinon.spy(crypto.Hmac.prototype, 'update')

    const digestSpy = Sinon.spy(crypto.Hmac.prototype, 'digest')

    const dateMock = ImportMock.mockFunction(
      global,
      'Date',
      currentDate,
    )

    // executing
    const signedHash = HuobiHttpMod.generateAuthHeader({
      credentials,
      verb,
      url,
    })

    queryParams.append('Signature', digestSpy.returnValues[0])
    // validating

    expect(createHmacSpy.callCount).to.be.eq(1)
    expect(createHmacSpy.calledWith('sha256', credentials.secret)).to.be.ok

    expect(updateSpy.callCount).to.be.eq(1)
    expect(updateSpy.calledWith(meta)).to.be.ok

    expect(digestSpy.callCount).to.be.eq(1)
    expect(digestSpy.calledWith('base64')).to.be.ok

    expect(dateMock.callCount).to.be.eq(1)
    expect(signedHash.queryParamsWithSignature.toString()).to.be.eq(queryParams.toString())

    Sinon.restore()

  })


  /**
   * Executes macro test.
   * */
  testCache({
    HttpClass: HuobiHttp,
    useObjectAsResponse: true,
  })

})
