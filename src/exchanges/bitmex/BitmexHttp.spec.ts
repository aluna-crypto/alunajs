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
import { Bitmex } from './Bitmex'
import * as BitmexHttpMod from './BitmexHttp'
import * as handleBitmexRequestErrorMod from './errors/handleBitmexRequestError'



describe('BitmexHttp', () => {

  const { generateAuthHeader } = BitmexHttpMod

  const {
    publicRequest,
    privateRequest,
  } = BitmexHttpMod.BitmexHttp

  const dummyUrl = 'http://dummy.com/path/XXXDUMMY/dummy'
  const dummyBody = { ids: ['id'] }
  const dummyResponse = { data: 'dummy-response', requestCount: 1 }

  const dummySignedHeaders: BitmexHttpMod.IBitmexRequestHeaders = {
    'api-expires': 'expires',
    'api-key': 'key',
    'api-signature': 'signature',
  }

  const mockDeps = (
    params: {
      requestResponse?: any,
      getCache?: any,
      hasCache?: boolean,
      setCache?: boolean,
      signedheaderResponse?: BitmexHttpMod.IBitmexRequestHeaders,
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
      Bitmex,
      'settings',
      mockedExchangeSettings,
    )

    const generateAuthHeaderMock = ImportMock.mockFunction(
      BitmexHttpMod,
      'generateAuthHeader',
      signedheaderResponse,
    )

    const handleRequestErrorSpy = ImportMock.mockFunction(
      handleBitmexRequestErrorMod,
      'handleBitmexRequestError',
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
      handleRequestErrorSpy,
      assembleAxiosRequestMock,
      generateAuthHeaderMock,
    }

  }

  it(
    'should defaults the http verb to get on public requests',
    async () => {

      const {
        requestSpy,
        axiosCreateMock,
      } = mockDeps({
        requestResponse: Promise.resolve(dummyResponse),
      })

      await publicRequest({
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

    },
  )

  it('should execute public request just fine', async () => {

    const {
      requestSpy,
      axiosCreateMock,
    } = mockDeps({
      requestResponse: Promise.resolve(dummyResponse),
    })

    const responseData = await publicRequest({
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

  it(
    'should defaults the http verb to POST on private requests',
    async () => {

      const {
        requestSpy,
        axiosCreateMock,
        generateAuthHeaderMock,
      } = mockDeps({
        requestResponse: Promise.resolve(dummyResponse),
      })


      await privateRequest({
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

    },
  )

  it('should execute private request just fine', async () => {

    const {
      requestSpy,
      axiosCreateMock,
      generateAuthHeaderMock,
    } = mockDeps({
      requestResponse: Promise.resolve(dummyResponse),
    })

    const responseData = await privateRequest({
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

  it(
    "should ensure 'bitmexRequestErrorHandler' is call on resquest error",
    async () => {

      let error

      const message = 'Dummy error'

      const throwedError = new Error(message)

      const {
        handleRequestErrorSpy,
      } = mockDeps({
        requestResponse: Promise.reject(throwedError),
        errorMsgRes: message,
      })

      try {

        await publicRequest({
          url: dummyUrl,
        })

      } catch (err) {

        error = err

      }

      expect(error.message).to.be.eq(message)

      const calledArg1 = handleRequestErrorSpy.args[0][0]

      expect(handleRequestErrorSpy.callCount).to.be.eq(1)
      expect(calledArg1).to.be.ok
      expect(calledArg1).to.deep.eq({
        error: throwedError,
      })

      try {

        await privateRequest({
          url: dummyUrl,
          body: dummyBody,
          keySecret: {} as IAlunaKeySecretSchema,
        })

      } catch (err) {

        error = err

      }

      expect(error.message).to.be.eq(message)

      const calledArg2 = handleRequestErrorSpy.args[1][0]

      expect(handleRequestErrorSpy.callCount).to.be.eq(2)
      expect(calledArg2).to.be.ok
      expect(calledArg2).to.deep.eq({
        error: throwedError,
      })

    },
  )

  it('should generate signed auth header just fine', async () => {

    const createHmacSpy = Sinon.spy(crypto, 'createHmac')

    const updateSpy = Sinon.spy(crypto.Hmac.prototype, 'update')

    const digestSpy = Sinon.spy(crypto.Hmac.prototype, 'digest')

    const mockedNonce = Date.now().toString()

    const dateNowToStringMock = { toString: () => mockedNonce }

    const dateNowMock = ImportMock.mockFunction(
      Date,
      'now',
      dateNowToStringMock,
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

    const signedHash = generateAuthHeader({
      keySecret,
      path,
      verb,
      body,
    })

    expect(dateNowMock.callCount).to.be.eq(1)

    expect(createHmacSpy.callCount).to.be.eq(1)
    expect(createHmacSpy.calledWith('sha256', keySecret.secret)).to.be.ok

    expect(updateSpy.callCount).to.be.eq(4)
    expect(updateSpy.calledWith(mockedNonce)).to.be.ok
    expect(updateSpy.calledWith(verb.toUpperCase())).to.be.ok
    expect(updateSpy.calledWith(path)).to.be.ok
    expect(updateSpy.calledWith(stringifyBody)).to.be.ok

    expect(stringfyMock.callCount).to.be.eq(1)
    expect(stringfyMock.calledWith(body)).to.be.ok

    expect(digestSpy.callCount).to.be.eq(1)
    expect(digestSpy.calledWith('hex')).to.be.ok

    expect(signedHash['api-expires']).to.deep.eq(mockedNonce)
    expect(signedHash['api-key']).to.deep.eq(keySecret.key)
    expect(signedHash['api-signature']).to.deep.eq(digestSpy.returnValues[0])

    const signedHash2 = generateAuthHeader({
      keySecret,
      path,
      verb,
      // without a body
    })

    expect(dateNowMock.callCount).to.be.eq(2)

    expect(createHmacSpy.callCount).to.be.eq(2)

    // when no body is passed must not call stringfy on empty string
    expect(stringfyMock.callCount).to.be.eq(1)
    expect(stringfyMock.calledWith('')).not.to.be.ok

    expect(updateSpy.callCount).to.be.eq(8)

    expect(digestSpy.callCount).to.be.eq(2)

    expect(signedHash2['api-expires']).to.deep.eq(mockedNonce)
    expect(signedHash2['api-key']).to.deep.eq(keySecret.key)
    expect(signedHash2['api-signature']).to.deep.eq(digestSpy.returnValues[1])

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

        await publicRequest(params)

      },

    })

  })

})
