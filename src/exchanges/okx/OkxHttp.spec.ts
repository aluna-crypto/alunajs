import { expect } from 'chai'
import { Agent } from 'https'
import { random } from 'lodash'
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
import * as handleOkxRequestErrorMod from './errors/handleOkxRequestError'
import * as OkxHttpMod from './OkxHttp'



describe.skip(__filename, () => {

  const { OkxHttp } = OkxHttpMod

  const url = 'https://okx.com/api/path'
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
      OkxHttpMod,
      'generateAuthHeader',
      signedHeader,
    )

    const handleOkxRequestError = ImportMock.mockFunction(
      handleOkxRequestErrorMod,
      'handleOkxRequestError',
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
      handleOkxRequestError,
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

    const okxHttp = new OkxHttp({})

    request.returns(Promise.resolve({ data: response }))


    // executing
    const responseData = await okxHttp.publicRequest({
      verb,
      url,
      body,
    })


    // validating
    expect(responseData).to.be.eq(response)

    expect(okxHttp.requestWeight.public).to.be.eq(1)
    expect(okxHttp.requestWeight.authed).to.be.eq(0)

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
    const okxHttp = new OkxHttp({})


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
    const responseData = await okxHttp.authedRequest({
      verb: AlunaHttpVerbEnum.POST,
      url,
      body,
      credentials,
    })


    // validating
    expect(responseData).to.be.eq(response)

    expect(okxHttp.requestWeight.public).to.be.eq(0)
    expect(okxHttp.requestWeight.authed).to.be.eq(1)

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
      url,
    })

    expect(hashCacheKey.callCount).to.be.eq(0)

    expect(cache.has.callCount).to.be.eq(0)
    expect(cache.get.callCount).to.be.eq(0)
    expect(cache.set.callCount).to.be.eq(0)

  })

  it('should properly increment request count on public requests', async () => {

    // preparing data
    const okxHttp = new OkxHttp({})

    const weight = random()
    const pubRequestCount = random()
    const authRequestCount = random()

    okxHttp.requestWeight.public = pubRequestCount
    okxHttp.requestWeight.authed = authRequestCount


    // mocking
    const { request } = mockDeps()

    request.returns(Promise.resolve({ data: response }))


    // executing
    await okxHttp.publicRequest({
      url,
      body,
      weight,
    })


    // validating
    expect(okxHttp.requestWeight.public).to.be.eq(pubRequestCount + weight)
    expect(okxHttp.requestWeight.authed).to.be.eq(authRequestCount)

    expect(request.callCount).to.be.eq(1)

  })

  it('should properly increment request count on authed requests', async () => {

    // preparing data
    const okxHttp = new OkxHttp({})

    const weight = random()
    const pubRequestCount = random()
    const authRequestCount = random()

    okxHttp.requestWeight.public = pubRequestCount
    okxHttp.requestWeight.authed = authRequestCount


    // mocking
    const { request } = mockDeps()

    request.returns(Promise.resolve({ data: response }))


    // executing
    await okxHttp.authedRequest({
      url,
      body,
      weight,
      credentials,
    })


    // validating
    expect(okxHttp.requestWeight.public).to.be.eq(pubRequestCount)
    expect(okxHttp.requestWeight.authed).to.be.eq(authRequestCount + weight)

    expect(request.callCount).to.be.eq(1)

  })

  it('should properly handle request error on public requests', async () => {

    // preparing data
    const okxHttp = new OkxHttp({})

    const throwedError = new Error('unknown error')


    // mocking
    const {
      request,
      handleOkxRequestError,
    } = mockDeps()

    request.returns(Promise.reject(throwedError))


    // executing
    const publicRes = await executeAndCatch(() => okxHttp.publicRequest({
      url,
      body,
    }))


    // validating
    expect(publicRes.result).not.to.be.ok

    expect(request.callCount).to.be.eq(1)

    expect(handleOkxRequestError.callCount).to.be.eq(1)

  })

  it('should properly handle request error on authed requests', async () => {

    // preparing data
    const okxHttp = new OkxHttp({})

    const throwedError = new Error('unknown error')


    // mocking
    const {
      request,
      handleOkxRequestError,
    } = mockDeps()

    request.returns(Promise.reject(throwedError))


    // executing
    const autheRes = await executeAndCatch(() => okxHttp.authedRequest({
      url,
      body,
      credentials,
    }))


    // validating
    expect(autheRes.result).not.to.be.ok

    expect(request.callCount).to.be.eq(1)

    expect(handleOkxRequestError.callCount).to.be.eq(1)

  })

  it('should properly use proxy settings on public requests', async () => {

    // preparing data
    const okxHttp = new OkxHttp({})


    // mocking
    const {
      request,
      assembleRequestConfig,
    } = mockDeps()

    request.returns(Promise.resolve({ data: response }))


    // executing
    await okxHttp.publicRequest({
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
    const okxHttp = new OkxHttp({})


    // mocking
    const {
      request,
      assembleRequestConfig,
    } = mockDeps()

    request.returns(Promise.resolve({ data: response }))


    // executing
    await okxHttp.authedRequest({
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
    const path = 'path'
    const verb = 'verb' as AlunaHttpVerbEnum

    const currentDate = Date.now()

    // mocking
    const dateMock = ImportMock.mockFunction(
      Date,
      'now',
      currentDate,
    )

    // executing
    const signedHash = OkxHttpMod.generateAuthHeader({
      credentials,
      path,
      verb,
      body,
      url,
    })

    // validating
    expect(dateMock.callCount).to.be.eq(1)
    expect(signedHash['Api-Timestamp']).to.be.eq(currentDate)

  })


  /**
   * Executes macro test.
   * */
  testCache({ HttpClass: OkxHttp })

})
