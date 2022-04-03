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
import { Binance } from './Binance'
import * as BinanceHttpMod from './BinanceHttp'
import * as handleBinanceRequestErrorMod from './errors/handleBinanceRequestError'



describe('BinanceHttp', () => {

  const { BinanceHttp } = BinanceHttpMod

  const dummyUrl = 'http://dummy.com/path/XXXDUMMY/dummy'
  const dummyBody = { dummy: 'dummy-body' }
  const dummyResponse = { data: 'dummy-response', requestCount: 1 }
  const dummyKeysecret: IAlunaKeySecretSchema = {
    key: 'key',
    secret: 'secret',
  }
  const dummySignedHeaders = { 'X-MBX-APIKEY': dummyKeysecret.key }
  const dummySignedBody = {
    signature: 'dummy',
    dataQueryString: 'dummy=dummy',
    body: '&dummy=dummy',
  }

  const formattedQuery = new URLSearchParams(
    `${dummySignedBody.dataQueryString}${dummySignedBody.body}`,
  )

  formattedQuery.append('signature', dummySignedBody.signature)

  const mockDeps = (
    params: {
      requestResponse?: any,
      getCache?: any,
      hasCache?: boolean,
      setCache?: boolean,
      signedheaderResponse?: BinanceHttpMod.IBinanceSignedSignature,
      errorMsgRes?: string,
      mockedExchangeSettings?: IAlunaSettingsSchema,
    } = {},
  ) => {

    const {
      requestResponse = {},
      signedheaderResponse = dummySignedBody,
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
      Binance,
      'settings',
      mockedExchangeSettings,
    )

    const generateAuthHeaderMock = ImportMock.mockFunction(
      BinanceHttpMod,
      'generateAuthSignature',
      signedheaderResponse,
    )

    const handleRequestErrorSpy = ImportMock.mockFunction(
      handleBinanceRequestErrorMod,
      'handleBinanceRequestError',
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

    await BinanceHttp.publicRequest({
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

    const responseData = await BinanceHttp.publicRequest({
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

  it('should format a body to binance format', async () => {

    const formattedBody = BinanceHttpMod.formatBodyToBinance(dummyBody)

    expect(formattedBody).to.be.eq('&dummy=dummy-body')

  })

  it(
    'should defaults the http verb to post on private requests',
    async () => {

      const {
        requestSpy,
        axiosCreateMock,
        generateAuthHeaderMock,
      } = mockDeps({
        requestResponse: Promise.resolve(dummyResponse),
      })

      await BinanceHttp.privateRequest({
      // http verb not informed
        keySecret: dummyKeysecret,
        url: 'http://dummy.com',
      })

      expect(axiosCreateMock.callCount).to.be.eq(1)

      expect(generateAuthHeaderMock.callCount).to.be.eq(1)

      expect(requestSpy.callCount).to.be.eq(1)

      expect(requestSpy.args[0]).to.deep.eq([{
        url: `http://dummy.com?${formattedQuery.toString()}`,
        method: AlunaHttpVerbEnum.POST,
        headers: dummySignedHeaders,
      }])

    },
  )

  it('should execute private request just fine', async () => {

    const {
      requestSpy,
      axiosCreateMock,
    } = mockAxiosRequest(dummyResponse)

    const generateAuthHeaderMock = ImportMock.mockFunction(
      BinanceHttpMod,
      'generateAuthSignature',
      dummySignedBody,
    )

    const responseData = await BinanceHttp.privateRequest({
      verb: AlunaHttpVerbEnum.POST,
      url: dummyUrl,
      body: dummyBody,
      keySecret: dummyKeysecret,
    })

    expect(axiosCreateMock.callCount).to.be.eq(1)

    expect(generateAuthHeaderMock.callCount).to.be.eq(1)
    expect(generateAuthHeaderMock.calledWith({
      verb: AlunaHttpVerbEnum.POST,
      body: dummyBody,
      keySecret: dummyKeysecret,
      query: undefined,
    })).to.be.ok

    expect(requestSpy.callCount).to.be.eq(1)
    expect(requestSpy.args[0]).to.deep.eq([{
      url: `${dummyUrl}?${formattedQuery.toString()}`,
      method: AlunaHttpVerbEnum.POST,
      headers: dummySignedHeaders,
    }])

    expect(responseData).to.deep.eq(dummyResponse)

  })

  it(
    'should ensure handleBinanceRequestError is call on request error',
    async () => {

      const errMsg = 'Dummy error'

      const jsError = new Error(errMsg)

      const {
        throwedError,
        handleRequestErrorSpy,
      } = mockDeps({
        requestResponse: Promise.reject(jsError),
        errorMsgRes: errMsg,
      })

      let res = await executeAndCatch(() => BinanceHttp.publicRequest({
        url: dummyUrl,
      }))

      expect(res.result).not.to.be.ok

      expect(res.error!.message).to.be.eq(errMsg)
      expect(res.error!.code).to.be.eq(throwedError.code)
      expect(res.error!.httpStatusCode).to.be.eq(throwedError.httpStatusCode)
      expect(res.error!.metadata).to.be.eq(throwedError.metadata)

      expect(handleRequestErrorSpy.callCount).to.be.eq(1)
      expect(handleRequestErrorSpy.args[0][0]).to.deep.eq({
        error: jsError,
      })


      res = await executeAndCatch(() => BinanceHttp.privateRequest({
        url: dummyUrl,
        body: dummyBody,
        keySecret: dummyKeysecret,
      }))

      expect(res.result).not.to.be.ok

      expect(res.error!.message).to.be.eq(errMsg)
      expect(res.error!.code).to.be.eq(throwedError.code)
      expect(res.error!.httpStatusCode).to.be.eq(throwedError.httpStatusCode)
      expect(res.error!.metadata).to.be.eq(throwedError.metadata)

      expect(handleRequestErrorSpy.callCount).to.be.eq(2)
      expect(handleRequestErrorSpy.args[1][0]).to.deep.eq({
        error: jsError,
      })

    },
  )

  it('should generate signed auth header just fine with body', async () => {

    const createHmacSpy = Sinon.spy(crypto, 'createHmac')

    const updateSpy = Sinon.spy(crypto.Hmac.prototype, 'update')

    const digestSpy = Sinon.spy(crypto.Hmac.prototype, 'digest')

    const currentDate = 'current-date'

    const queryString = `recvWindow=60000&timestamp=${currentDate}`

    const timestampMock = { toString: () => currentDate }

    const dateMock = ImportMock.mockFunction(
      Date,
      'now',
      timestampMock,
    )

    const stringifyBody = 'stringify-body'

    const stringfyMock = ImportMock.mockFunction(
      BinanceHttpMod,
      'formatBodyToBinance',
      stringifyBody,
    )

    const keySecret = {
      key: 'dummy-key',
      secret: 'dummy-secret',
    } as IAlunaKeySecretSchema
    const verb = 'verb' as AlunaHttpVerbEnum
    const body = dummyBody

    const signedHash = BinanceHttpMod.generateAuthSignature({
      keySecret,
      verb,
      body,
    })

    expect(dateMock.callCount).to.be.eq(1)

    expect(createHmacSpy.callCount).to.be.eq(1)
    expect(createHmacSpy.calledWith('sha256', keySecret.secret)).to.be.ok

    expect(updateSpy.callCount).to.be.eq(3)
    expect(updateSpy.calledWith(queryString)).to.be.ok
    expect(updateSpy.calledWith(stringifyBody)).to.be.ok
    expect(updateSpy.calledWith('')).to.be.ok

    expect(stringfyMock.callCount).to.be.eq(1)
    expect(stringfyMock.calledWith(body)).to.be.ok
    expect(stringfyMock.calledWith('')).not.to.be.ok

    expect(digestSpy.callCount).to.be.eq(1)
    expect(digestSpy.calledWith('hex')).to.be.ok

    expect(signedHash.signature).to.deep.eq(digestSpy.returnValues[0])

    const signedHash2 = BinanceHttpMod.generateAuthSignature({
      keySecret,
      verb,
      // without a body
    })

    expect(dateMock.callCount).to.be.eq(2)

    expect(createHmacSpy.callCount).to.be.eq(2)

    // when no body is passed must not call stringfy on empty string
    expect(stringfyMock.callCount).to.be.eq(1)
    expect(stringfyMock.calledWith('')).not.to.be.ok

    expect(updateSpy.callCount).to.be.eq(6)

    expect(digestSpy.callCount).to.be.eq(2)

    expect(
      signedHash2.signature,
    ).to.deep.eq(digestSpy.returnValues[1])

  })

  it('should generate signed auth header just fine with query', async () => {

    const createHmacSpy = Sinon.spy(crypto, 'createHmac')

    const updateSpy = Sinon.spy(crypto.Hmac.prototype, 'update')

    const digestSpy = Sinon.spy(crypto.Hmac.prototype, 'digest')

    const currentDate = 'current-date'

    const queryString = `recvWindow=60000&timestamp=${currentDate}`

    const timestampMock = { toString: () => currentDate }

    const dateMock = ImportMock.mockFunction(
      Date,
      'now',
      timestampMock,
    )

    const stringfyMock = ImportMock.mockFunction(
      BinanceHttpMod,
      'formatBodyToBinance',
      '',
    )

    const keySecret = {
      key: 'dummy-key',
      secret: 'dummy-secret',
    } as IAlunaKeySecretSchema
    const verb = 'verb' as AlunaHttpVerbEnum
    const body = dummyBody

    const dummyQuery = 'dummy-query'

    const signedHash = BinanceHttpMod.generateAuthSignature({
      keySecret,
      verb,
      body,
      query: dummyQuery,
    })

    expect(dateMock.callCount).to.be.eq(1)

    expect(createHmacSpy.callCount).to.be.eq(1)
    expect(createHmacSpy.calledWith('sha256', keySecret.secret)).to.be.ok

    expect(updateSpy.callCount).to.be.eq(3)
    expect(updateSpy.calledWith(queryString)).to.be.ok
    expect(updateSpy.calledWith('')).to.be.ok
    expect(updateSpy.calledWith(dummyQuery)).to.be.ok

    expect(stringfyMock.calledWith('')).not.to.be.ok

    expect(digestSpy.callCount).to.be.eq(1)
    expect(digestSpy.calledWith('hex')).to.be.ok

    expect(signedHash.signature).to.deep.eq(digestSpy.returnValues[0])

    const signedHash2 = BinanceHttpMod.generateAuthSignature({
      keySecret,
      verb,
      // without a body
    })

    expect(dateMock.callCount).to.be.eq(2)

    expect(createHmacSpy.callCount).to.be.eq(2)

    // when no body is passed must not call stringfy on empty string
    expect(stringfyMock.callCount).to.be.eq(1)
    expect(stringfyMock.calledWith('')).not.to.be.ok

    expect(updateSpy.callCount).to.be.eq(6)

    expect(digestSpy.callCount).to.be.eq(2)

    expect(
      signedHash2.signature,
    ).to.deep.eq(digestSpy.returnValues[1])

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

        await BinanceHttp.publicRequest(params)

      },

    })

  })

})
