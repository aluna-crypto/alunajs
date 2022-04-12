import { expect } from 'chai'
import crypto from 'crypto'
import Sinon from 'sinon'
import { ImportMock } from 'ts-mock-imports'

import { mockAxiosRequest } from '../../../test/helpers/http/axios'
import { AlunaError } from '../../lib/core/AlunaError'
import { IAlunaHttpPublicParams } from '../../lib/core/IAlunaHttp'
import { AlunaHttpVerbEnum } from '../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaHttpErrorCodes } from '../../lib/errors/AlunaHttpErrorCodes'
import { IAlunaKeySecretSchema } from '../../lib/schemas/IAlunaKeySecretSchema'
import { IAlunaSettingsSchema } from '../../lib/schemas/IAlunaSettingsSchema'
import { mockAssembleRequestConfig } from '../../utils/axios/assembleAxiosRequestConfig.mock'
import {
  mockAlunaCache,
  validateCache,
} from '../../utils/cache/AlunaCache.mock'
import { executeAndCatch } from '../../utils/executeAndCatch'
import { Bittrex } from './Bittrex'
import * as BittrexHttpMod from './BittrexHttp'
import * as handleBittrexRequestErrorMod from './errors/handleBittrexRequestError'



describe('BittrexHttp', () => {

  const { BittrexHttp } = BittrexHttpMod

  const dummyUrl = 'http://dummy.com/path/XXXDUMMY/dummy'
  const dummyBody = { dummy: 'dummy-body' }
  const dummySignedHeaders = { 'X-DUMMY': 'dummy' }
  const dummyData = 'dummy-data'

  const mockDeps = (
    params: {
      requestResponse?: any,
      requestError?: AlunaError | Error,
      getCache?: any,
      hasCache?: boolean,
      setCache?: boolean,
      signedheaderResponse?: BittrexHttpMod.IBittrexSignedHeaders,
      mockedExchangeSettings?: IAlunaSettingsSchema,
    } = {},
  ) => {

    const {
      requestResponse = {},
      requestError,
      signedheaderResponse = dummySignedHeaders,
      getCache = {},
      hasCache = false,
      setCache = false,
      mockedExchangeSettings = {},
    } = params


    const { assembleAxiosRequestMock } = mockAssembleRequestConfig()

    const {
      requestSpy,
      axiosCreateMock,
    } = mockAxiosRequest({
      responseData: requestResponse,
      error: requestError,
    })

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

    const handleBittrexRequestErrorSpy = ImportMock.mockFunction(
      handleBittrexRequestErrorMod,
      'handleBittrexRequestError',
      requestError,
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
      exchangeMock,
      axiosCreateMock,
      handleBittrexRequestErrorSpy,
      generateAuthHeaderMock,
      assembleAxiosRequestMock,
    }

  }

  it('should defaults the http verb to get on public requests', async () => {

    const {
      requestSpy,
      axiosCreateMock,
    } = mockDeps({
      requestResponse: dummyData,
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
      requestResponse: dummyData,
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

    expect(responseData).to.deep.eq({
      data: dummyData,
      requestCount: 1,
    })

  })

  it('should defaults the http verb to post on private requests', async () => {

    const {
      requestSpy,
      axiosCreateMock,
      generateAuthHeaderMock,
    } = mockDeps({
      requestResponse: dummyData,
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
      requestResponse: dummyData,
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

    expect(responseData).to.deep.eq({
      data: dummyData,
      requestCount: 1,
    })

  })

  it(
    "should ensure 'handleBittrexRequestErrorSpy' is called on resquest error",
    async () => {

      const errMsg = 'Dummy error'

      const alunaError = new AlunaError({
        message: errMsg,
        code: AlunaHttpErrorCodes.REQUEST_ERROR,
        httpStatusCode: 500,
        metadata: { error: errMsg },
      })

      const {
        handleBittrexRequestErrorSpy,
      } = mockDeps({
        requestError: alunaError,
      })

      let res = await executeAndCatch(() => BittrexHttp.publicRequest({
        url: dummyUrl,
      }))

      expect(res.result).not.to.be.ok

      expect(res.error!.message).to.be.eq(errMsg)
      expect(res.error!.code).to.be.eq(alunaError.code)
      expect(res.error!.httpStatusCode).to.be.eq(alunaError.httpStatusCode)
      expect(res.error!.metadata).to.be.eq(alunaError.metadata)

      expect(handleBittrexRequestErrorSpy.callCount).to.be.eq(1)
      expect(handleBittrexRequestErrorSpy.args[0][0]).to.deep.eq({
        error: alunaError,
      })


      res = await executeAndCatch(() => BittrexHttp.privateRequest({
        url: dummyUrl,
        body: dummyBody,
        keySecret: {
          key: '',
          secret: '',
        },
      }))

      expect(res.result).not.to.be.ok

      expect(res.error!.message).to.be.eq(errMsg)
      expect(res.error!.code).to.be.eq(alunaError.code)
      expect(res.error!.httpStatusCode).to.be.eq(alunaError.httpStatusCode)
      expect(res.error!.metadata).to.be.eq(alunaError.metadata)

      expect(handleBittrexRequestErrorSpy.callCount).to.be.eq(2)
      expect(handleBittrexRequestErrorSpy.args[1][0]).to.deep.eq({
        error: alunaError,
      })

    },
  )

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

    mockAxiosRequest({ responseData: dummyData })

    await validateCache({
      cacheResult: dummyData,
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
