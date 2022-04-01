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
import { executeAndCatch } from '../../utils/executeAndCatch'
import { Bitfinex } from './Bitfinex'
import * as BitfinexHttpMod from './BitfinexHttp'
import * as handleBitfinexRequestErrorMod from './errors/handleBitfinexRequestError'



describe('BitfinexHttp', () => {

  const { BitfinexHttp } = BitfinexHttpMod

  const { publicRequest, privateRequest } = BitfinexHttp

  const dummyBody: Record<any, string> = { dummy: 'dummy-body' }
  const dummyUrl = 'http://dummy.com/path/XXXDUMMY/dummy'
  const dummyResponse = { data: 'dummy-response', requestCount: 1 }
  const dummySignedHeaders: BitfinexHttpMod.IBitfinexSignedV2Headers = {
    'Content-Type': 'dummy-content',
    'bfx-nonce': 'dummy-key',
    'bfx-apikey': 'dummy-payload',
    'bfx-signature': 'dummy-sig',
  }
  const signedAuth: BitfinexHttpMod.IGenerateAuthHeaderReturns = {
    headers: dummySignedHeaders,
    body: dummyBody,
  }
  const dummyKeysecret: IAlunaKeySecretSchema = {
    key: 'key',
    secret: 'secret',
  }

  const mockDeps = (
    params: {
      requestResponse?: any,
      getCache?: any,
      hasCache?: boolean,
      setCache?: boolean,
      signedheaderResponse?: BitfinexHttpMod.IGenerateAuthHeaderReturns,
      errorMsgRes?: string,
      mockedExchangeSettings?: IAlunaSettingsSchema,
    } = {},
  ) => {

    const {
      requestResponse = {},
      signedheaderResponse = signedAuth,
      getCache = {},
      hasCache = false,
      setCache = false,
      errorMsgRes = 'error',
      mockedExchangeSettings = {},
    } = params

    const { assembleAxiosRequestMock } = mockAssembleRequestConfig()

    const throwedError = new AlunaError({
      code: AlunaGenericErrorCodes.UNKNOWN,
      message: errorMsgRes,
      httpStatusCode: 400,
    })

    const {
      requestSpy,
      axiosCreateMock,
    } = mockAxiosRequest(requestResponse)

    const exchangeMock = ImportMock.mockOther(
      Bitfinex,
      'settings',
      mockedExchangeSettings,
    )

    const generateAuthHeaderMock = ImportMock.mockFunction(
      BitfinexHttpMod,
      'generateAuthHeader',
      signedheaderResponse,
    )

    const handleRequestErrorSpy = ImportMock.mockFunction(
      handleBitfinexRequestErrorMod,
      'handleBitfinexRequestError',
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

  it('should defaults the http verb to get on public requests', async () => {

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


  })

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
    "should call 'handleBitfinexRequestError' if public request throws",
    async () => {

      const errMsg = 'exchange offline'

      const jsError = new Error(errMsg)

      const {
        handleRequestErrorSpy,
        throwedError,
      } = mockDeps({
        requestResponse: Promise.reject(jsError),
        errorMsgRes: errMsg,
      })

      const url = 'dummyUrl1'

      const {
        error,
        result,
      } = await executeAndCatch(() => publicRequest({
        verb: AlunaHttpVerbEnum.GET,
        url,
        body: dummyBody,
      }))

      expect(result).not.to.be.ok

      expect(error!.message).to.be.eq(errMsg)
      expect(error!.code).to.be.eq(throwedError.code)
      expect(error!.httpStatusCode).to.be.eq(throwedError.httpStatusCode)
      expect(error!.metadata).to.be.eq(throwedError.metadata)

      expect(handleRequestErrorSpy.callCount).to.be.eq(1)
      expect(handleRequestErrorSpy.args[0][0]).to.deep.eq({
        error: jsError,
      })

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

    const url = 'dummyUrl2'

    const responseData = await privateRequest({
      url,
      body: dummyBody,
      keySecret: dummyKeysecret,
    })

    expect(axiosCreateMock.callCount).to.be.eq(1)

    expect(generateAuthHeaderMock.callCount).to.be.eq(1)
    expect(generateAuthHeaderMock.calledWith({
      url,
      body: dummyBody,
      keySecret: dummyKeysecret,
    })).to.be.ok

    expect(requestSpy.callCount).to.be.eq(1)
    expect(requestSpy.args[0]).to.deep.eq([{
      url,
      method: AlunaHttpVerbEnum.POST,
      data: dummyBody,
      headers: dummySignedHeaders,
    }])

    expect(responseData).to.deep.eq(dummyResponse)

  })

  it(
    "should call 'handleBitfinexRequestError' if private request throws",
    async () => {

      const errMsg = 'exchange offline'

      const jsError = new Error(errMsg)

      const {
        handleRequestErrorSpy,
        throwedError,
      } = mockDeps({
        requestResponse: Promise.reject(jsError),
        errorMsgRes: errMsg,
      })

      const url = 'dummyUrl1'

      const {
        error,
        result,
      } = await executeAndCatch(() => privateRequest({
        url,
        keySecret: dummyKeysecret,
      }))

      expect(result).not.to.be.ok

      expect(error!.message).to.be.eq(errMsg)
      expect(error!.code).to.be.eq(throwedError.code)
      expect(error!.httpStatusCode).to.be.eq(throwedError.httpStatusCode)
      expect(error!.metadata).to.be.eq(throwedError.metadata)

      expect(handleRequestErrorSpy.callCount).to.be.eq(1)
      expect(handleRequestErrorSpy.args[0][0]).to.deep.eq({
        error: jsError,
      })

    },
  )

  it('should generate signed auth header for V1 API just fine', async () => {

    const currentDate = Date.now()

    const mockedDateNow = ImportMock.mockFunction(
      Date,
      'now',
      currentDate,
    )

    const url = 'https://something.com/v1/auth/r/permissions'

    const mockedBody = { ...dummyBody }

    mockedBody.request = new URL(url).pathname
    mockedBody.nonce = (currentDate * 1000).toString()

    const payload = Buffer.from(JSON.stringify(mockedBody)).toString('base64')

    const expectedSig = crypto.createHmac('sha384', dummyKeysecret.secret)
      .update(payload)
      .digest('hex')

    const createHmacSpy = Sinon.spy(crypto, 'createHmac')
    const updateSpy = Sinon.spy(crypto.Hmac.prototype, 'update')
    const digestSpy = Sinon.spy(crypto.Hmac.prototype, 'digest')

    const { headers, body } = BitfinexHttpMod.generateAuthHeader({
      keySecret: dummyKeysecret,
      url,
      body: dummyBody,
    })

    expect(mockedDateNow.callCount).to.be.eq(1)

    expect(createHmacSpy.callCount).to.be.eq(1)
    expect(createHmacSpy.calledWith('sha384', dummyKeysecret.secret)).to.be.ok

    expect(updateSpy.callCount).to.be.eq(1)
    expect(updateSpy.calledWith(payload)).to.be.ok

    expect(digestSpy.callCount).to.be.eq(1)
    expect(digestSpy.calledWith('hex')).to.be.ok

    expect(headers['X-BFX-PAYLOAD']).to.be.eq(payload)
    expect(headers['X-BFX-APIKEY']).to.be.eq(dummyKeysecret.key)
    expect(headers['X-BFX-SIGNATURE']).to.be.eq(expectedSig)

    expect(body).to.deep.eq(mockedBody)

  })

  it('should generate signed auth header for V2 API just fine', async () => {

    const currentDate = Date.now()

    const mockedDateNow = ImportMock.mockFunction(
      Date,
      'now',
      currentDate,
    )

    const url = 'https://something.com/v2/auth/r/permissions'

    const path = new URL(url).pathname
    const nonce = (currentDate * 1000).toString()

    const payload = `/api${path}${nonce}${JSON.stringify(dummyBody)}`

    const expectedSig = crypto.createHmac('sha384', dummyKeysecret.secret)
      .update(payload)
      .digest('hex')

    const createHmacSpy = Sinon.spy(crypto, 'createHmac')
    const updateSpy = Sinon.spy(crypto.Hmac.prototype, 'update')
    const digestSpy = Sinon.spy(crypto.Hmac.prototype, 'digest')

    const { headers, body } = BitfinexHttpMod.generateAuthHeader({
      keySecret: dummyKeysecret,
      url,
      body: dummyBody,
    })

    expect(mockedDateNow.callCount).to.be.eq(1)

    expect(createHmacSpy.callCount).to.be.eq(1)
    expect(createHmacSpy.calledWith('sha384', dummyKeysecret.secret)).to.be.ok

    expect(updateSpy.callCount).to.be.eq(1)
    expect(updateSpy.calledWith(payload)).to.be.ok

    expect(digestSpy.callCount).to.be.eq(1)
    expect(digestSpy.calledWith('hex')).to.be.ok

    expect(headers['bfx-apikey']).to.be.eq(dummyKeysecret.key)
    expect(headers['bfx-nonce']).to.be.eq(nonce)
    expect(headers['bfx-signature']).to.be.eq(expectedSig)

    expect(body).to.deep.eq(dummyBody)

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
