import { expect } from 'chai'
import { random } from 'lodash'
import { ImportMock } from 'ts-mock-imports'

import { mockAxiosRequest } from '../../../test/mocks/axios/request'
import { AlunaHttpVerbEnum } from '../../lib/enums/AlunaHtttpVerbEnum'
import { IAlunaCredentialsSchema } from '../../lib/schemas/IAlunaCredentialsSchema'
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
      hashCacheKey,
      generateAuthHeader,
      assembleRequestConfig,
      handleBittrexRequestError,
    }

  }

  it('should execute public request just fine', async () => {

    const {
      cache,
      hashCacheKey,
      generateAuthHeader,
      assembleRequestConfig,
    } = mockDeps()

    const { request } = mockAxiosRequest()

    const bittrexHttp = new BittrexHttp()

    request.returns(Promise.resolve({ data: response }))

    const verb = AlunaHttpVerbEnum.POST


    const responseData = await bittrexHttp.publicRequest({
      verb,
      url,
      body,
    })

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

  it('should defaults http verb to GET on public requests', async () => {

    const { assembleRequestConfig } = mockDeps()

    const { request } = mockAxiosRequest()

    const bittrexHttp = new BittrexHttp()

    request.returns(Promise.resolve({ data: response }))


    const responseData = await bittrexHttp.publicRequest({
      url,
      body,
    })

    expect(responseData).to.be.eq(response)

    expect(bittrexHttp.requestCount.public).to.be.eq(1)
    expect(bittrexHttp.requestCount.authed).to.be.eq(0)

    expect(request.callCount).to.be.eq(1)
    expect(request.args[0][0]).to.deep.eq({
      url,
      method: AlunaHttpVerbEnum.GET,
      data: body,
    })

    expect(assembleRequestConfig.callCount).to.be.eq(1)
    expect(assembleRequestConfig.args[0][0]).to.deep.eq({
      url,
      method: AlunaHttpVerbEnum.GET,
      data: body,
      proxySettings: undefined,
    })

  })

  it(
    'should get response data from the cache when available on public requests',
    async () => {

      const {
        cache,
        hashCacheKey,
      } = mockDeps({
        cacheParams: {
          get: response,
          has: true,
          set: false,
        },
      })

      const { request } = mockAxiosRequest()

      const bittrexHttp = new BittrexHttp()

      request.returns(Promise.resolve({ data: response }))


      const responseData = await bittrexHttp.publicRequest({
        url,
        body,
      })

      expect(responseData).to.be.eq(response)


      expect(hashCacheKey.callCount).to.be.eq(1)

      expect(cache.has.callCount).to.be.eq(1)
      expect(cache.get.callCount).to.be.eq(1)
      expect(cache.set.callCount).to.be.eq(0)

      expect(bittrexHttp.requestCount.public).to.be.eq(0)
      expect(bittrexHttp.requestCount.authed).to.be.eq(0)

      expect(request.callCount).to.be.eq(0)

    },
  )

  it('should execute private request just fine', async () => {

    const {
      cache,
      hashCacheKey,
      generateAuthHeader,
      assembleRequestConfig,
    } = mockDeps()

    const { request } = mockAxiosRequest()

    const bittrexHttp = new BittrexHttp()

    request.returns(Promise.resolve({ data: response }))

    const responseData = await bittrexHttp.authedRequest({
      verb: AlunaHttpVerbEnum.POST,
      url,
      body,
      credentials,
    })

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

  it('should properly increment request count', async () => {

    mockDeps()

    const { request } = mockAxiosRequest()

    const bittrexHttp = new BittrexHttp()

    const weight = random()
    const pubRequestCount = random()
    const authRequestCount = random()
    bittrexHttp.requestCount.public = pubRequestCount
    bittrexHttp.requestCount.authed = authRequestCount

    request.returns(Promise.resolve({ data: response }))


    await bittrexHttp.publicRequest({
      url,
      body,
      weight,
    })

    expect(bittrexHttp.requestCount.public).to.be.eq(pubRequestCount + weight)
    expect(bittrexHttp.requestCount.authed).to.be.eq(authRequestCount)

    expect(request.callCount).to.be.eq(1)


    await bittrexHttp.authedRequest({
      url,
      body,
      weight,
      credentials,
    })

    expect(bittrexHttp.requestCount.public).to.be.eq(pubRequestCount + weight)
    expect(bittrexHttp.requestCount.authed).to.be.eq(authRequestCount + weight)

    expect(request.callCount).to.be.eq(2)

  })

  it('should properly handle request error', async () => {

    const { handleBittrexRequestError } = mockDeps()

    const { request } = mockAxiosRequest()

    const bittrexHttp = new BittrexHttp()

    const throwedError = new Error('unknown error')

    request.returns(Promise.reject(throwedError))

    const publicRes = await executeAndCatch(() => bittrexHttp.publicRequest({
      url,
      body,
    }))

    expect(publicRes.result).not.to.be.ok

    expect(request.callCount).to.be.eq(1)

    expect(handleBittrexRequestError.callCount).to.be.eq(1)

    const autheRes = await executeAndCatch(() => bittrexHttp.authedRequest({
      url,
      body,
      credentials,
    }))

    expect(autheRes.result).not.to.be.ok

    expect(request.callCount).to.be.eq(2)

    expect(handleBittrexRequestError.callCount).to.be.eq(2)

  })

})
