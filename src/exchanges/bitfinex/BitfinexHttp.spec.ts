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
import {
  mockAlunaCache,
  validateCache,
} from '../../utils/cache/AlunaCache.mock'
import { Bitfinex } from './Bitfinex'
import * as BitfinexHttpMod from './BitfinexHttp'



describe('BitfinexHttp', () => {

  const { BitfinexHttp, handleRequestError } = BitfinexHttpMod

  const { publicRequest, privateRequest } = BitfinexHttp

  const dummyBody: Record<any, string> = { dummy: 'dummy-body' }
  const dummyUrl = 'http://dummy.com/path/XXXDUMMY/dummy'
  const dummyResponse = { data: 'dummy-data' }
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

    const formatRequestErrorSpy = ImportMock.mockFunction(
      BitfinexHttpMod,
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

    expect(responseData).to.deep.eq(dummyResponse.data)

  })

  it("should call 'handleRequestError' if public request throws", async () => {

    const errMsg = 'exchange offline'

    const {
      throwedError,
    } = mockDeps({
      requestResponse: Promise.reject(new Error(errMsg)),
      errorMsgRes: errMsg,
    })

    let error

    const url = 'dummyUrl1'

    try {

      await publicRequest({
        verb: AlunaHttpVerbEnum.GET,
        url,
        body: dummyBody,
      })

    } catch (e) {

      error = e

    }

    expect(error).to.be.ok
    expect(error.message).to.be.eq(errMsg)
    expect(error.code).to.be.eq(throwedError.code)
    expect(error.httpStatusCode).to.be.eq(throwedError.httpStatusCode)

  })


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

    expect(responseData).to.deep.eq(dummyResponse.data)

  })

  it("should call 'handleRequestError' if private request throws", async () => {

    const errMsg = 'exchange offline'

    const {
      formatRequestErrorSpy,
      throwedError,
    } = mockDeps({
      requestResponse: Promise.reject(new Error(errMsg)),
      errorMsgRes: errMsg,
    })

    let error

    try {

      await privateRequest({
        url: dummyUrl,
        keySecret: dummyKeysecret,
      })


    } catch (e) {

      error = e

    }

    expect(error).to.be.ok
    expect(error.message).to.be.eq(errMsg)
    expect(error.code).to.be.eq(throwedError.code)
    expect(error.httpStatusCode).to.be.eq(throwedError.httpStatusCode)

    expect(formatRequestErrorSpy.callCount).to.be.eq(1)

  })

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

  it('should ensure request error is being handle', async () => {

    const dummyErrorMsg = 'exchange is offline'

    let error: AlunaError

    let axiosThrowedError: any = {
      isAxiosError: true,
      response: {
        request: {
          path: 'v1/getPositions',
        },
        data: { message: dummyErrorMsg },
      },
    }

    error = handleRequestError(axiosThrowedError as AxiosError)

    expect(error instanceof AlunaError).to.be.ok
    expect(error.message).to.be.eq(dummyErrorMsg)
    expect(error.httpStatusCode).to.be.eq(400)

    axiosThrowedError = {
      isAxiosError: true,
      response: {
        status: 401,
        data: ['error', 10010, dummyErrorMsg],
      },
    }

    error = handleRequestError(axiosThrowedError as AxiosError)

    expect(error instanceof AlunaError).to.be.ok
    expect(error.message).to.be.eq(dummyErrorMsg)
    expect(error.httpStatusCode).to.be.eq(401)

    axiosThrowedError.response.data = []

    error = handleRequestError(axiosThrowedError as AxiosError)

    expect(error instanceof AlunaError).to.be.ok
    expect(
      error.message,
    ).to.be.eq('Error while trying to execute Axios request')
    expect(error.httpStatusCode).to.be.eq(401)

    axiosThrowedError = {
      isAxiosError: true,
    }

    error = handleRequestError(axiosThrowedError as AxiosError)

    expect(error instanceof AlunaError).to.be.ok
    expect(
      error.message,
    ).to.be.eq('Error while trying to execute Axios request')
    expect(error.httpStatusCode).to.be.eq(400)

    axiosThrowedError = {
      message: dummyErrorMsg,
    }

    error = handleRequestError(axiosThrowedError as Error)

    expect(error instanceof AlunaError).to.be.ok
    expect(error.message).to.be.eq(dummyErrorMsg)
    expect(error.httpStatusCode).to.be.eq(400)

    axiosThrowedError = {}

    error = handleRequestError(axiosThrowedError as any)

    expect(error instanceof AlunaError).to.be.ok
    expect(
      error.message,
    ).to.be.eq('Error while trying to execute Axios request')
    expect(error.httpStatusCode).to.be.eq(400)

  })

  it('should use proxy agent when available', async () => {

    const proxyAgent = {} as any

    const {
      requestSpy,
    } = mockDeps({
      requestResponse: Promise.resolve(dummyResponse),
      mockedExchangeSettings: { proxyAgent },
    })

    const publicRes = await publicRequest({
      url: dummyUrl,
      body: dummyBody,
    })

    expect(publicRes).to.be.eq(dummyResponse.data)

    expect(requestSpy.args[0]).to.deep.eq([
      {
        url: dummyUrl,
        method: AlunaHttpVerbEnum.GET,
        data: dummyBody,
        httpsAgent: proxyAgent,
      },
    ])

    const privateRes = await privateRequest({
      url: dummyUrl,
      body: dummyBody,
      keySecret: dummyKeysecret,
    })

    expect(privateRes).to.be.eq(dummyResponse.data)

    expect(requestSpy.args[1]).to.deep.eq([
      {
        url: dummyUrl,
        method: AlunaHttpVerbEnum.POST,
        data: dummyBody,
        headers: dummySignedHeaders,
        httpsAgent: proxyAgent,
      },
    ])

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
