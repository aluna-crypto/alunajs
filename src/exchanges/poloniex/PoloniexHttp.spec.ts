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
import * as handlePoloniexRequestErrorMod from './errors/handlePoloniexRequestError'
import * as PoloniexHttpMod from './PoloniexHttp'



describe(__filename, () => {

  const { PoloniexHttp } = PoloniexHttpMod

  const url = 'https://poloniex.com/api/path'
  const response = 'response'
  const body = new URLSearchParams('some=data')
  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'key',
    passphrase: 'key',
  }
  const signedHeader = {
    Key: credentials.key,
    Sign: '123456',
    'Content-Type': 'application/x-www-form-urlencoded',
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
      PoloniexHttpMod,
      'generateAuthHeader',
      signedHeader,
    )

    const handlePoloniexRequestError = ImportMock.mockFunction(
      handlePoloniexRequestErrorMod,
      'handlePoloniexRequestError',
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
      handlePoloniexRequestError,
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

    const poloniexHttp = new PoloniexHttp({})

    request.returns(Promise.resolve({ data: response }))


    // executing
    const responseData = await poloniexHttp.publicRequest({
      verb,
      url,
      body,
    })


    // validating
    expect(responseData).to.be.eq(response)

    expect(poloniexHttp.requestWeight.public).to.be.eq(1)
    expect(poloniexHttp.requestWeight.authed).to.be.eq(0)

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
    const poloniexHttp = new PoloniexHttp({})


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
    const responseData = await poloniexHttp.authedRequest({
      verb: AlunaHttpVerbEnum.POST,
      url,
      body,
      credentials,
    })


    // validating
    expect(responseData).to.be.eq(response)

    expect(poloniexHttp.requestWeight.public).to.be.eq(0)
    expect(poloniexHttp.requestWeight.authed).to.be.eq(1)

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
    const poloniexHttp = new PoloniexHttp({})

    const weight = random()
    const pubRequestCount = random()
    const authRequestCount = random()

    poloniexHttp.requestWeight.public = pubRequestCount
    poloniexHttp.requestWeight.authed = authRequestCount


    // mocking
    const { request } = mockDeps()

    request.returns(Promise.resolve({ data: response }))


    // executing
    await poloniexHttp.publicRequest({
      url,
      body,
      weight,
    })


    // validating
    expect(poloniexHttp.requestWeight.public).to.be.eq(pubRequestCount + weight)
    expect(poloniexHttp.requestWeight.authed).to.be.eq(authRequestCount)

    expect(request.callCount).to.be.eq(1)

  })

  it('should properly increment request count on authed requests', async () => {

    // preparing data
    const poloniexHttp = new PoloniexHttp({})

    const weight = random()
    const pubRequestCount = random()
    const authRequestCount = random()

    poloniexHttp.requestWeight.public = pubRequestCount
    poloniexHttp.requestWeight.authed = authRequestCount


    // mocking
    const { request } = mockDeps()

    request.returns(Promise.resolve({ data: response }))


    // executing
    await poloniexHttp.authedRequest({
      url,
      body,
      weight,
      credentials,
    })


    // validating
    expect(poloniexHttp.requestWeight.public).to.be.eq(pubRequestCount)
    expect(poloniexHttp.requestWeight.authed).to.be.eq(authRequestCount + weight)

    expect(request.callCount).to.be.eq(1)

  })

  it('should properly handle request error on public requests', async () => {

    // preparing data
    const poloniexHttp = new PoloniexHttp({})

    const throwedError = new Error('unknown error')


    // mocking
    const {
      request,
      handlePoloniexRequestError,
    } = mockDeps()

    request.returns(Promise.reject(throwedError))


    // executing
    const publicRes = await executeAndCatch(() => poloniexHttp.publicRequest({
      url,
      body,
    }))


    // validating
    expect(publicRes.result).not.to.be.ok

    expect(request.callCount).to.be.eq(1)

    expect(handlePoloniexRequestError.callCount).to.be.eq(1)

  })

  it('should properly handle request error on authed requests', async () => {

    // preparing data
    const poloniexHttp = new PoloniexHttp({})

    const throwedError = new Error('unknown error')


    // mocking
    const {
      request,
      handlePoloniexRequestError,
    } = mockDeps()

    request.returns(Promise.reject(throwedError))


    // executing
    const autheRes = await executeAndCatch(() => poloniexHttp.authedRequest({
      url,
      body,
      credentials,
    }))


    // validating
    expect(autheRes.result).not.to.be.ok

    expect(request.callCount).to.be.eq(1)

    expect(handlePoloniexRequestError.callCount).to.be.eq(1)

  })

  it('should properly use proxy settings on public requests', async () => {

    // preparing data
    const poloniexHttp = new PoloniexHttp({})


    // mocking
    const {
      request,
      assembleRequestConfig,
    } = mockDeps()

    request.returns(Promise.resolve({ data: response }))


    // executing
    await poloniexHttp.publicRequest({
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
    const poloniexHttp = new PoloniexHttp({})


    // mocking
    const {
      request,
      assembleRequestConfig,
    } = mockDeps()

    request.returns(Promise.resolve({ data: response }))


    // executing
    await poloniexHttp.authedRequest({
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

  it('should generate signed auth header just fine', async () => {

    // preparing data

    // mocking
    const createHmacSpy = Sinon.spy(crypto, 'createHmac')

    const updateSpy = Sinon.spy(crypto.Hmac.prototype, 'update')

    const digestHmacSpy = Sinon.spy(crypto.Hmac.prototype, 'digest')

    // executing
    const signedHash = PoloniexHttpMod.generateAuthHeader({
      credentials,
      body,
    })

    // validating

    expect(createHmacSpy.callCount).to.be.eq(1)
    expect(
      createHmacSpy.calledWith('sha512', credentials.secret),
    ).to.be.ok

    expect(updateSpy.callCount).to.be.eq(1)
    expect(
      updateSpy.calledWith(body.toString()),
    ).to.be.ok

    expect(signedHash.Key).to.be.eq(credentials.key)
    expect(signedHash.Sign).to.be.eq(digestHmacSpy.returnValues[0])
    expect(signedHash['Content-Type']).to.be.eq('application/x-www-form-urlencoded')

  })

  it('should generate signed auth header just fine w/o body', async () => {

    // preparing data

    // mocking
    const createHmacSpy = Sinon.spy(crypto, 'createHmac')

    const updateSpy = Sinon.spy(crypto.Hmac.prototype, 'update')

    const digestHmacSpy = Sinon.spy(crypto.Hmac.prototype, 'digest')

    // executing
    const signedHash = PoloniexHttpMod.generateAuthHeader({
      credentials,
    })

    // validating

    expect(createHmacSpy.callCount).to.be.eq(1)
    expect(
      createHmacSpy.calledWith('sha512', credentials.secret),
    ).to.be.ok

    expect(updateSpy.callCount).to.be.eq(1)
    expect(
      updateSpy.calledWith(''),
    ).to.be.ok

    expect(signedHash.Key).to.be.eq(credentials.key)
    expect(signedHash.Sign).to.be.eq(digestHmacSpy.returnValues[0])
    expect(signedHash['Content-Type']).to.be.eq('application/x-www-form-urlencoded')

  })


  /**
   * Executes macro test.
   * */
  testCache({ HttpClass: PoloniexHttp })

})
