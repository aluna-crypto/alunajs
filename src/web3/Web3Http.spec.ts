import { expect } from 'chai'
import { Agent } from 'http'

import { testCache } from '../../test/macros/testCache'
import { mockAxiosRequest } from '../../test/mocks/axios/request'
import {
  IAlunaHttpAuthedParams,
  IAlunaHttpPublicParams,
} from '../lib/core/IAlunaHttp'
import { AlunaHttpVerbEnum } from '../lib/enums/AlunaHtttpVerbEnum'
import { AlunaProtocolsEnum } from '../lib/enums/AlunaProxyAgentEnum'
import { AlunaExchangeErrorCodes } from '../lib/errors/AlunaExchangeErrorCodes'
import { AlunaHttpErrorCodes } from '../lib/errors/AlunaHttpErrorCodes'
import { IAlunaCredentialsSchema } from '../lib/schemas/IAlunaCredentialsSchema'
import {
  IAlunaProxySchema,
  IAlunaSettingsSchema,
} from '../lib/schemas/IAlunaSettingsSchema'
import { mockAssembleRequestConfig } from '../utils/axios/assembleRequestConfig.mock'
import { mockAlunaCache } from '../utils/cache/AlunaCache.mock'
import { executeAndCatch } from '../utils/executeAndCatch'
import { Web3Http } from './Web3Http'



describe(__filename, () => {

  /**
   * Data
   */
  const url = 'https://bittrex.com/api/path'

  const response = 'response'

  const body = {
    data: 'some-data',
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



  /**
   * Mocking
   */
  const mockDeps = (
    params: {
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
      cacheParams = {
        get: {},
        has: false,
        set: true,
      },
    } = params

    const {
      cache,
      hashCacheKey,
    } = mockAlunaCache(cacheParams)

    return {
      cache,
      request,
      hashCacheKey,
      assembleRequestConfig,
    }

  }



  it('should execute public request just fine', async () => {

    // mocking
    const {
      cache,
      request,
      hashCacheKey,
      assembleRequestConfig,
    } = mockDeps()

    request.returns(Promise.resolve({ data: response }))


    // executing
    const web3Http = new Web3Http()

    const responseData = await web3Http.publicRequest({
      url,
      body,
    })


    // validating
    expect(responseData).to.be.eq(response)

    expect(web3Http.requestCount.public).to.be.eq(1)
    expect(web3Http.requestCount.authed).to.be.eq(0)

    expect(request.callCount).to.be.eq(1)
    expect(request.args[0][0]).to.deep.eq({
      url,
      method: AlunaHttpVerbEnum.GET,
      data: body,
    })

    expect(hashCacheKey.callCount).to.be.eq(1)

    expect(cache.has.callCount).to.be.eq(1)
    expect(cache.set.callCount).to.be.eq(1)
    expect(cache.get.callCount).to.be.eq(0)

    expect(assembleRequestConfig.callCount).to.be.eq(1)
    expect(assembleRequestConfig.args[0][0]).to.deep.eq({
      url,
      method: AlunaHttpVerbEnum.GET,
      data: body,
      proxySettings: undefined,
    })

  })



  it('should execute authed stubbed request just fine', async () => {

    // preparing data
    const url = '/some/private/address?'

    // TODO: refactor credentials for web3?
    const credentials: IAlunaCredentialsSchema = {
      key: 'some-key',
      secret: 'some-secret',
      passphrase: 'some-passphrase',
    }

    const params: IAlunaHttpAuthedParams = {
      url,
      credentials,
    }


    // executing
    const web3Http = await new Web3Http()

    const {
      error,
      result,
    } = await executeAndCatch(() => web3Http.authedRequest(params))


    // validating
    expect(error).to.be.ok
    expect(result).not.to.be.ok

    expect(error?.code).to.eq(AlunaExchangeErrorCodes.METHOD_NOT_IMPLEMENTED)
    expect(error?.message).to.eq('Authed requests are not implemented yet.')
    expect(error?.metadata).to.deep.eq({ params })
  })



  it('should properly handle request error on public requests', async () => {

    // preparing data
    const throwedError = new Error('unknown error')


    // mocking
    const { request } = mockDeps()

    request.returns(Promise.reject(throwedError))


    // executing
    const web3http = new Web3Http()

    const {
      error,
      result,
    } = await executeAndCatch(() => web3http.publicRequest({
      url,
      body,
    }))


    // validating
    expect(result).not.to.be.ok
    expect(error).to.be.ok

    expect(error?.code).to.eq(AlunaHttpErrorCodes.REQUEST_ERROR)
    expect(error?.message).to.eq('Error requesting Web3 data.')
    expect(error?.metadata).to.eq(throwedError)

    expect(request.callCount).to.be.eq(1)

  })



  it('should properly use proxy settings on public requests', async () => {

    // preparing data


    // mocking
    const {
      request,
      assembleRequestConfig,
    } = mockDeps()

    request.returns(Promise.resolve({ data: response }))


    // executing
    const web3Http = new Web3Http()

    await web3Http.publicRequest({
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

      await new Web3Http().publicRequest(params)

    },

  })



})
