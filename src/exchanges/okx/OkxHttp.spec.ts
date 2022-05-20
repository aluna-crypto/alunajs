import { expect } from 'chai'
import { Agent } from 'https'
import { omit, random } from 'lodash'
import Sinon from 'sinon'
import { ImportMock } from 'ts-mock-imports'

import crypto from 'crypto'
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
import { AlunaError } from '../../lib/core/AlunaError'
import { AlunaKeyErrorCodes } from '../../lib/errors/AlunaKeyErrorCodes'



describe(__filename, () => {

  const { OkxHttp } = OkxHttpMod

  const url = 'https://okx.com/api/path'
  const response = 'response'
  const body = {
    data: 'some-data',
  }

  const date = new Date('2022-01-25T20:35:45.623Z')
  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'key',
    passphrase: 'key',
  }
  const signedHeader = {
    'OK-ACCESS-KEY': credentials.key,
    'OK-ACCESS-PASSPHRASE': credentials.passphrase,
    'OK-ACCESS-SIGN': 'dummy',
    'OK-ACCESS-TIMESTAMP': date,
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

    request.returns(Promise.resolve({ data: { data: response } }))


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

    request.returns(Promise.resolve({ data: { data: response } }))


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

  it('should generate signed auth header just fine w/ body', async () => {

    // preparing data
    const verb = 'verb' as AlunaHttpVerbEnum
    const timestamp = date.toISOString()

    const meta = [
      timestamp,
      verb.toUpperCase(),
      new URL(url).pathname,
      JSON.stringify(body),
    ].join('')

    // mocking
    const createHmacSpy = Sinon.spy(crypto, 'createHmac')

    const updateSpy = Sinon.spy(crypto.Hmac.prototype, 'update')

    const digestSpy = Sinon.spy(crypto.Hmac.prototype, 'digest')


    const dateMock = ImportMock.mockFunction(
      Date.prototype,
      'toISOString',
      timestamp,
    )

    // executing
    const signedHash = OkxHttpMod.generateAuthHeader({
      credentials,
      verb,
      body,
      url,
    })

    // validating
    expect(dateMock.callCount).to.be.eq(1)

    expect(createHmacSpy.callCount).to.be.eq(1)
    expect(createHmacSpy.calledWith('sha256', credentials.secret)).to.be.ok

    expect(updateSpy.callCount).to.be.eq(1)
    expect(updateSpy.calledWith(meta)).to.be.ok

    expect(digestSpy.callCount).to.be.eq(1)
    expect(digestSpy.calledWith('base64')).to.be.ok

    expect(signedHash['OK-ACCESS-KEY']).to.deep.eq(credentials.key)
    expect(signedHash['OK-ACCESS-PASSPHRASE']).to.deep.eq(credentials.passphrase)
    expect(signedHash['OK-ACCESS-TIMESTAMP']).to.deep.eq(timestamp)
    expect(signedHash['OK-ACCESS-SIGN']).to.deep.eq(digestSpy.returnValues[0])

    Sinon.restore()

  })

  it('should generate signed auth header just fine w/ query', async () => {

    // preparing data
    const verb = 'verb' as AlunaHttpVerbEnum
    const timestamp = date.toISOString()

    const urlWithQuery = new URL(`${url}?query=query`)

    const meta = [
      timestamp,
      verb.toUpperCase(),
      `${urlWithQuery.pathname}${urlWithQuery.search}`,
    ].join('')

    // mocking
    const createHmacSpy = Sinon.spy(crypto, 'createHmac')

    const updateSpy = Sinon.spy(crypto.Hmac.prototype, 'update')

    const digestSpy = Sinon.spy(crypto.Hmac.prototype, 'digest')


    const dateMock = ImportMock.mockFunction(
      Date.prototype,
      'toISOString',
      timestamp,
    )

    // executing
    const signedHash = OkxHttpMod.generateAuthHeader({
      credentials,
      verb,
      url: urlWithQuery.toString(),
    })

    // validating
    expect(dateMock.callCount).to.be.eq(1)

    expect(createHmacSpy.callCount).to.be.eq(1)
    expect(createHmacSpy.calledWith('sha256', credentials.secret)).to.be.ok

    expect(updateSpy.callCount).to.be.eq(1)
    expect(updateSpy.calledWith(meta)).to.be.ok

    expect(digestSpy.callCount).to.be.eq(1)
    expect(digestSpy.calledWith('base64')).to.be.ok

    expect(signedHash['OK-ACCESS-KEY']).to.deep.eq(credentials.key)
    expect(signedHash['OK-ACCESS-PASSPHRASE']).to.deep.eq(credentials.passphrase)
    expect(signedHash['OK-ACCESS-TIMESTAMP']).to.deep.eq(timestamp)
    expect(signedHash['OK-ACCESS-SIGN']).to.deep.eq(digestSpy.returnValues[0])

    Sinon.restore()

  })

  it('should throw an error generating signed auth header w/o passphrase', async () => {

    // preparing data
    const verb = 'verb' as AlunaHttpVerbEnum

    const expectedErrorMessage = '\'passphrase\' is required for private requests'
    const expectedErrorCode = AlunaKeyErrorCodes.INVALID
    const expectedErrorStatus = 401

    // executing
    const {
      error,
      result,
    } = await executeAndCatch(() => OkxHttpMod.generateAuthHeader({
      credentials: omit(credentials, 'passphrase'),
      verb,
      url,
    }))

    // validating

    expect(result).not.to.be.ok

    expect(error instanceof AlunaError).to.be.ok
    expect(error?.message).to.be.eq(expectedErrorMessage)
    expect(error?.code).to.be.eq(expectedErrorCode)
    expect(error?.httpStatusCode).to.be.eq(expectedErrorStatus)

  })


  /**
   * Executes macro test.
   * */
  testCache({ HttpClass: OkxHttp, useObjectAsResponse: true })

})
