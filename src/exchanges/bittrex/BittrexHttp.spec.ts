import { AxiosError } from 'axios'
import { expect } from 'chai'
import crypto from 'crypto'
import Sinon from 'sinon'
import { ImportMock } from 'ts-mock-imports'

import { mockAxiosRequest } from '../../../test/helpers/http'
import { AlunaError } from '../../lib/core/AlunaError'
import { IAlunaHttpPublicParams } from '../../lib/core/IAlunaHttp'
import { AlunaHttpVerbEnum } from '../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaGenericErrorCodes } from '../../lib/errors/AlunaGenericErrorCodes'
import { IAlunaKeySecretSchema } from '../../lib/schemas/IAlunaKeySecretSchema'
import { IAlunaSettingsSchema } from '../../lib/schemas/IAlunaSettingsSchema'
import { mockAssembleRequestConfig } from '../../utils/axios/assembleAxiosRequestConfig.mock'
import {
  mockAlunaCache,
  validateCache,
} from '../../utils/cache/AlunaCache.mock'
import { Bittrex } from './Bittrex'
import * as BittrexHttpMod from './BittrexHttp'



describe('BittrexHttp', () => {

  const { BittrexHttp } = BittrexHttpMod

  const dummyUrl = 'http://dummy.com/path/XXXDUMMY/dummy'
  const dummyBody = { dummy: 'dummy-body' }
  const dummySignedHeaders = { 'X-DUMMY': 'dummy' }
  const dummyResponse = { data: 'dummy-data', requestCount: 1 }

  const mockDeps = (
    params: {
      requestResponse?: any,
      getCache?: any,
      hasCache?: boolean,
      setCache?: boolean,
      signedheaderResponse?: BittrexHttpMod.IBittrexSignedHeaders,
      errorMsgRes?: string,
      mockedExchangeSettings?: IAlunaSettingsSchema,
    } = {},
  ) => {

    const {
      requestResponse = {},
      signedheaderResponse = dummySignedHeaders,
      getCache = {},
      hasCache = false,
      setCache = false,
      errorMsgRes = 'error',
      mockedExchangeSettings = {},
    } = params

    const throwedError = new AlunaError({
      code: AlunaGenericErrorCodes.UNKNOWN,
      message: errorMsgRes,
      httpStatusCode: 400,
    })

    const { assembleAxiosRequestMock } = mockAssembleRequestConfig()

    const {
      requestSpy,
      axiosCreateMock,
    } = mockAxiosRequest(requestResponse)

    const exchangeMock = ImportMock.mockOther(
      Bittrex,
      'settings',
      mockedExchangeSettings,
    )

    const generateAuthHeaderMock = ImportMock.mockFunction(
      BittrexHttpMod,
      'generateAuthHeader',
      signedheaderResponse,
    )

    const formatRequestErrorSpy = ImportMock.mockFunction(
      BittrexHttpMod,
      'handleRequestError',
      throwedError,
    )


    const {
      cache,
      hashCacheKey,
    } = mockAlunaCache({
      get: getCache,
      has: hasCache,
      set: setCache,
    })

    return {
      cache,
      requestSpy,
      hashCacheKey,
      throwedError,
      exchangeMock,
      axiosCreateMock,
      formatRequestErrorSpy,
      generateAuthHeaderMock,
      assembleAxiosRequestMock,
    }

  }

  it('should defaults the http verb to get on public requests', async () => {

    const {
      requestSpy,
      axiosCreateMock,
    } = mockDeps({
      requestResponse: Promise.resolve(dummyResponse),
    })

    await BittrexHttp.publicRequest({
      // http verb not informed
      url: dummyUrl,
      body: dummyBody,
    })

    expect(axiosCreateMock.callCount).to.be.eq(1)

    expect(requestSpy.callCount).to.be.eq(1)

    expect(requestSpy.args[0]).to.deep.eq([{
      url: dummyUrl,
      method: AlunaHttpVerbEnum.GET,
      data: dummyBody,
    }])

  })

  it('should execute public request just fine', async () => {

    const {
      requestSpy,
      axiosCreateMock,
    } = mockDeps({
      requestResponse: Promise.resolve(dummyResponse),
    })

    const responseData = await BittrexHttp.publicRequest({
      verb: AlunaHttpVerbEnum.GET,
      url: dummyUrl,
      body: dummyBody,
    })

    expect(axiosCreateMock.callCount).to.be.eq(1)

    expect(requestSpy.callCount).to.be.eq(1)
    expect(requestSpy.args[0]).to.deep.eq([{
      url: dummyUrl,
      method: AlunaHttpVerbEnum.GET,
      data: dummyBody,
    }])

    expect(responseData).to.deep.eq(dummyResponse)

  })

  it('should defaults the http verb to post on private requests', async () => {

    const {
      requestSpy,
      axiosCreateMock,
      generateAuthHeaderMock,
    } = mockDeps({
      requestResponse: Promise.resolve(dummyResponse),
    })

    await BittrexHttp.privateRequest({
      // http verb not informed
      keySecret: {} as IAlunaKeySecretSchema,
      url: 'http://dummy.com',
    })

    expect(axiosCreateMock.callCount).to.be.eq(1)

    expect(generateAuthHeaderMock.callCount).to.be.eq(1)

    expect(requestSpy.callCount).to.be.eq(1)

    expect(requestSpy.args[0]).to.deep.eq([{
      url: 'http://dummy.com',
      method: AlunaHttpVerbEnum.POST,
      data: undefined,
      headers: dummySignedHeaders,
    }])

  })

  it('should execute private request just fine', async () => {

    const {
      requestSpy,
      axiosCreateMock,
      generateAuthHeaderMock,
    } = mockDeps({
      requestResponse: Promise.resolve(dummyResponse),
    })

    const responseData = await BittrexHttp.privateRequest({
      verb: AlunaHttpVerbEnum.POST,
      url: dummyUrl,
      body: dummyBody,
      keySecret: {} as IAlunaKeySecretSchema,
    })

    expect(axiosCreateMock.callCount).to.be.eq(1)

    expect(generateAuthHeaderMock.callCount).to.be.eq(1)
    expect(generateAuthHeaderMock.calledWith({
      verb: AlunaHttpVerbEnum.POST,
      path: new URL(dummyUrl).pathname,
      body: dummyBody,
      keySecret: {},
      url: dummyUrl,
    })).to.be.ok

    expect(requestSpy.callCount).to.be.eq(1)
    expect(requestSpy.args[0]).to.deep.eq([{
      url: dummyUrl,
      method: AlunaHttpVerbEnum.POST,
      data: dummyBody,
      headers: dummySignedHeaders,
    }])

    expect(responseData).to.deep.eq(dummyResponse)

  })

  it('should ensure formatRequestError is call on resquest error', async () => {

    const message = 'Dummy error'

    const {
      formatRequestErrorSpy,
    } = mockDeps({
      requestResponse: Promise.reject(new Error(message)),
      errorMsgRes: message,
    })

    let result
    let error

    try {

      result = await BittrexHttp.publicRequest({
        url: dummyUrl,
      })

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok
    expect(error.message).to.be.eq(message)

    const calledArg = formatRequestErrorSpy.args[0][0]

    expect(formatRequestErrorSpy.callCount).to.be.eq(1)
    expect(calledArg).to.be.ok
    expect(calledArg.message).to.be.eq(message)

    try {

      result = await BittrexHttp.privateRequest({
        url: dummyUrl,
        body: dummyBody,
        keySecret: {} as IAlunaKeySecretSchema,
      })

    } catch (err) {

      error = err


    }

    expect(result).not.to.be.ok
    expect(error.message).to.be.eq(message)

    const calledArg2 = formatRequestErrorSpy.args[1][0]

    expect(formatRequestErrorSpy.callCount).to.be.eq(2)
    expect(calledArg2).to.be.ok
    expect(calledArg2.message).to.be.eq(message)

  })

  it('should ensure request error is being handle', async () => {

    const dummyError = 'dummy-error'

    const axiosError1 = {
      isAxiosError: true,
      response: {
        status: 400,
        data: {
          message: dummyError,
        },
      },
    }

    const error1 = BittrexHttpMod.handleRequestError(axiosError1 as AxiosError)

    expect(error1 instanceof AlunaError).to.be.ok
    expect(error1.message).to.be.eq(dummyError)
    expect(error1.httpStatusCode).to.be.eq(400)

    const axiosError2 = {
      isAxiosError: true,
      response: {
        data: {
        },
      },
    }

    const error2 = BittrexHttpMod.handleRequestError(axiosError2 as AxiosError)

    expect(error2 instanceof AlunaError).to.be.ok
    expect(
      error2.message,
    ).to.be.eq('Error while trying to execute Axios request')
    expect(error2.httpStatusCode).to.be.eq(400)

    const axiosError3 = {
      isAxiosError: true,
    }

    const error3 = BittrexHttpMod.handleRequestError(axiosError3 as AxiosError)

    expect(error3 instanceof AlunaError).to.be.ok
    expect(
      error3.message,
    ).to.be.eq('Error while trying to execute Axios request')
    expect(error3.httpStatusCode).to.be.eq(400)

    const error = {
      message: dummyError,
    }

    const error4 = BittrexHttpMod.handleRequestError(error as Error)

    expect(error4 instanceof AlunaError).to.be.ok
    expect(error4.message).to.be.eq(dummyError)
    expect(error4.httpStatusCode).to.be.eq(400)

    const unknown = {}

    const error5 = BittrexHttpMod.handleRequestError(unknown as any)

    expect(error5 instanceof AlunaError).to.be.ok
    expect(
      error5.message,
    ).to.be.eq('Error while trying to execute Axios request')
    expect(error5.httpStatusCode).to.be.eq(400)

  })

  it('should generate signed auth header just fine', async () => {

    const createHmacSpy = Sinon.spy(crypto, 'createHmac')
    const createHashSpy = Sinon.spy(crypto, 'createHash')

    const updateSpy = Sinon.spy(crypto.Hmac.prototype, 'update')
    const updateHashSpy = Sinon.spy(crypto.Hash.prototype, 'update')

    const digestHmacSpy = Sinon.spy(crypto.Hmac.prototype, 'digest')
    const digestHashSpy = Sinon.spy(crypto.Hash.prototype, 'digest')

    const currentDate = 'current-date'

    const timestampMock = { toString: () => currentDate }

    const dateMock = ImportMock.mockFunction(
      Date.prototype,
      'getTime',
      timestampMock,
    )

    const stringifyBody = 'stringify-body'

    const stringfyMock = ImportMock.mockFunction(
      JSON,
      'stringify',
      stringifyBody,
    )

    const keySecret = {
      key: 'dummy-key',
      secret: 'dummy-secret',
    } as IAlunaKeySecretSchema

    const path = 'path'
    const verb = 'verb' as AlunaHttpVerbEnum
    const body = dummyBody
    const url = dummyUrl

    const contentHash = crypto
      .createHash('sha512')
      .update(body ? JSON.stringify(body) : '')
      .digest('hex')

    const preSigned = [
      timestampMock,
      url,
      verb.toUpperCase(),
      contentHash,
    ].join('')

    const signedHash = BittrexHttpMod.generateAuthHeader({
      keySecret,
      path,
      verb,
      body,
      url,
    })

    expect(dateMock.callCount).to.be.eq(1)

    expect(createHmacSpy.callCount).to.be.eq(1)
    expect(createHashSpy.callCount).to.be.eq(2)
    expect(createHashSpy
      .secondCall
      .calledWith('sha512')).to.be.ok
    expect(createHmacSpy
      .firstCall
      .calledWith('sha512', keySecret.secret)).to.be.ok

    expect(updateSpy.callCount).to.be.eq(1)
    expect(updateHashSpy.callCount).to.be.eq(2)
    expect(updateHashSpy.secondCall.calledWith(JSON.stringify(body))).to.be.ok

    expect(stringfyMock.callCount).to.be.eq(3)
    expect(stringfyMock.calledWith(body)).to.be.ok

    expect(digestHmacSpy.callCount).to.be.eq(1)
    expect(digestHmacSpy.calledWith('hex')).to.be.ok

    expect(digestHashSpy.callCount).to.be.eq(2)
    expect(digestHashSpy.calledWith('hex')).to.be.ok

    const signedHeader = crypto
      .createHmac('sha512', keySecret.secret)
      .update(preSigned)
      .digest('hex')

    expect(signedHash['Api-Content-Hash']).to.deep.eq(contentHash)
    expect(signedHash['Api-Key']).to.deep.eq(keySecret.key)
    expect(signedHash['Api-Timestamp']).to.deep.eq(timestampMock)
    expect(signedHash['Api-Signature']).to.deep.eq(signedHeader)

    const signedHash2 = BittrexHttpMod.generateAuthHeader({
      keySecret,
      path,
      verb,
      url,
      // without a body
    })

    expect(dateMock.callCount).to.be.eq(2)

    expect(createHmacSpy.callCount).to.be.eq(3)

    // when no body is passed must not call stringfy on empty string
    expect(stringfyMock.callCount).to.be.eq(3)
    expect(stringfyMock.calledWith('')).not.to.be.ok

    expect(updateSpy.callCount).to.be.eq(3)

    expect(digestHmacSpy.callCount).to.be.eq(3)

    const contentHash2 = crypto.createHash('sha512').update('').digest('hex')

    expect(signedHash2['Api-Content-Hash']).to.deep.eq(contentHash2)
    expect(
      signedHash2['Api-Key'],
    ).to.deep.eq(keySecret.key)
    expect(signedHash2['Api-Timestamp']).to.deep.eq(timestampMock)

  })

  it('should validate cache usage', async () => {

    mockAxiosRequest(dummyResponse)

    await validateCache({
      cacheResult: dummyResponse,
      callMethod: async () => {

        const params: IAlunaHttpPublicParams = {
          url: dummyUrl,
          body: dummyBody,
          verb: AlunaHttpVerbEnum.GET,
        }

        await BittrexHttp.publicRequest(params)

      },

    })

  })

})
