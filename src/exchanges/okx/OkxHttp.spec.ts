import { expect } from 'chai'
import crypto from 'crypto'
import Sinon from 'sinon'
import { ImportMock } from 'ts-mock-imports'

import { mockAxiosRequest } from '../../../test/helpers/http/axios'
import { AlunaError } from '../../lib/core/AlunaError'
import { IAlunaHttpPublicParams } from '../../lib/core/IAlunaHttp'
import { AlunaHttpVerbEnum } from '../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaHttpErrorCodes } from '../../lib/errors/AlunaHttpErrorCodes'
import { AlunaKeyErrorCodes } from '../../lib/errors/AlunaKeyErrorCodes'
import { IAlunaKeySecretSchema } from '../../lib/schemas/IAlunaKeySecretSchema'
import { IAlunaSettingsSchema } from '../../lib/schemas/IAlunaSettingsSchema'
import { mockAssembleRequestConfig } from '../../utils/axios/assembleAxiosRequestConfig.mock'
import {
  mockAlunaCache,
  validateCache,
} from '../../utils/cache/AlunaCache.mock'
import { executeAndCatch } from '../../utils/executeAndCatch'
import * as handleOkxRequestErrorMod from './errors/handleOkxRequestError'
import { Okx } from './Okx'
import * as OkxHttpMod from './OkxHttp'



describe('OkxHttp', () => {

  const { OkxHttp } = OkxHttpMod

  const dummyUrl = 'http://dummy.com/path/XXXDUMMY/dummy'
  const dummyBody = { dummy: 'dummy-body' }
  const dummyResponse = 'dummy-response'
  const dummyKeysecret: IAlunaKeySecretSchema = {
    key: 'key',
    secret: 'secret',
    passphrase: 'passphrase',
  }
  const dummySignedBody = {
    'OK-ACCESS-KEY': dummyKeysecret.key,
    'OK-ACCESS-PASSPHRASE': dummyKeysecret.passphrase,
    'OK-ACCESS-SIGN': 'dummy',
    'OK-ACCESS-TIMESTAMP': '2022-01-25T20:35:45.623Z',
    'Content-Type': 'application/json',
  }

  const mockDeps = (
    params: {
      requestResponse?: any,
      requestError?: AlunaError | Error,
      getCache?: any,
      hasCache?: boolean,
      setCache?: boolean,
      signedheaderResponse?: OkxHttpMod.IOkxSignedSignature,
      mockedExchangeSettings?: IAlunaSettingsSchema,
    } = {},
  ) => {

    const {
      requestResponse = {},
      signedheaderResponse = dummySignedBody,
      getCache = {},
      hasCache = false,
      setCache = false,
      requestError,
      mockedExchangeSettings = {},
    } = params

    const { assembleAxiosRequestMock } = mockAssembleRequestConfig()

    const {
      requestSpy,
      axiosCreateMock,
    } = mockAxiosRequest({
      error: requestError,
      responseData: {
        data: requestResponse,
      },
    })

    const exchangeMock = ImportMock.mockOther(
      Okx,
      'settings',
      mockedExchangeSettings,
    )

    const generateAuthHeaderMock = ImportMock.mockFunction(
      OkxHttpMod,
      'generateAuthSignature',
      signedheaderResponse,
    )

    const handleRequestErrorSpy = ImportMock.mockFunction(
      handleOkxRequestErrorMod,
      'handleOkxRequestError',
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
      requestResponse: dummyResponse,
    })

    await OkxHttp.publicRequest({
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
      requestResponse: dummyResponse,
    })

    const responseData = await OkxHttp.publicRequest({
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
      data: dummyResponse,
      requestCount: 1,
    })

  })

  it(
    'should defaults the http verb to post on private requests',
    async () => {

      const {
        requestSpy,
        axiosCreateMock,
        generateAuthHeaderMock,
      } = mockDeps({
        requestResponse: dummyResponse,
      })

      await OkxHttp.privateRequest({
      // http verb not informed
        keySecret: dummyKeysecret,
        url: 'http://dummy.com',
      })

      expect(axiosCreateMock.callCount).to.be.eq(1)

      expect(generateAuthHeaderMock.callCount).to.be.eq(1)

      expect(requestSpy.callCount).to.be.eq(1)

      expect(requestSpy.args[0]).to.deep.eq([{
        url: 'http://dummy.com',
        method: AlunaHttpVerbEnum.POST,
        headers: dummySignedBody,
      }])

    },
  )

  it('should execute private request just fine', async () => {

    const {
      requestSpy,
      axiosCreateMock,
      generateAuthHeaderMock,
    } = mockDeps({
      requestResponse: dummyResponse,
      signedheaderResponse: {
        ...dummySignedBody,
        'OK-ACCESS-PASSPHRASE': dummySignedBody['OK-ACCESS-PASSPHRASE']!,
      },
    })

    const responseData = await OkxHttp.privateRequest({
      verb: AlunaHttpVerbEnum.POST,
      url: dummyUrl,
      body: dummyBody,
      keySecret: dummyKeysecret,
    })

    expect(axiosCreateMock.callCount).to.be.eq(1)

    expect(generateAuthHeaderMock.callCount).to.be.eq(1)

    expect(requestSpy.callCount).to.be.eq(1)

    expect(responseData).to.deep.eq({
      data: dummyResponse,
      requestCount: 1,
    })

  })

  it('should execute private request just fine with query', async () => {

    const {
      requestSpy,
      axiosCreateMock,
      generateAuthHeaderMock,
      assembleAxiosRequestMock,
    } = mockDeps({
      requestResponse: dummyResponse,
      signedheaderResponse: {
        ...dummySignedBody,
        'OK-ACCESS-PASSPHRASE': dummySignedBody['OK-ACCESS-PASSPHRASE']!,
      },
    })

    const dummyQuery = 'dummy=dummy'

    const responseData = await OkxHttp.privateRequest({
      verb: AlunaHttpVerbEnum.POST,
      url: dummyUrl,
      body: dummyBody,
      keySecret: dummyKeysecret,
      query: dummyQuery,
    })

    expect(axiosCreateMock.callCount).to.be.eq(1)

    expect(generateAuthHeaderMock.callCount).to.be.eq(1)

    expect(requestSpy.callCount).to.be.eq(1)

    expect(assembleAxiosRequestMock.calledWith(
      {
        url: `${dummyUrl}?${dummyQuery}`,
        method: AlunaHttpVerbEnum.POST,
        headers: {
          'OK-ACCESS-KEY': 'key',
          'OK-ACCESS-PASSPHRASE': 'passphrase',
          'OK-ACCESS-SIGN': 'dummy',
          'OK-ACCESS-TIMESTAMP': '2022-01-25T20:35:45.623Z',
          'Content-Type': 'application/json',
        },
        proxySettings: undefined,
      },
    ))
      .to.be.ok

    expect(responseData).to.deep.eq({
      data: dummyResponse,
      requestCount: 1,
    })

  })

  it(
    'should ensure handleOkxRequestError is call on request error',
    async () => {

      const errMsg = 'Dummy error'

      const alunaError = new AlunaError({
        code: AlunaHttpErrorCodes.REQUEST_ERROR,
        message: errMsg,
        httpStatusCode: 401,
        metadata: { error: errMsg },
      })

      const {
        handleRequestErrorSpy,
      } = mockDeps({
        requestError: alunaError,
      })

      let res = await executeAndCatch(() => OkxHttp.publicRequest({
        url: dummyUrl,
      }))

      expect(res.result).not.to.be.ok

      expect(res.error!.message).to.be.eq(errMsg)
      expect(res.error!.code).to.be.eq(alunaError.code)
      expect(res.error!.httpStatusCode).to.be.eq(alunaError.httpStatusCode)
      expect(res.error!.metadata).to.be.eq(alunaError.metadata)

      expect(handleRequestErrorSpy.callCount).to.be.eq(1)
      expect(handleRequestErrorSpy.args[0][0]).to.deep.eq({
        error: alunaError,
      })


      res = await executeAndCatch(() => OkxHttp.privateRequest({
        url: dummyUrl,
        body: dummyBody,
        keySecret: dummyKeysecret,
      }))

      expect(res.result).not.to.be.ok

      expect(res.error!.message).to.be.eq(errMsg)
      expect(res.error!.code).to.be.eq(alunaError.code)
      expect(res.error!.httpStatusCode).to.be.eq(alunaError.httpStatusCode)
      expect(res.error!.metadata).to.be.eq(alunaError.metadata)

      expect(handleRequestErrorSpy.callCount).to.be.eq(2)
      expect(handleRequestErrorSpy.args[1][0]).to.deep.eq({
        error: alunaError,
      })

    },
  )

  it('should generate signed auth header just fine with body', async () => {

    const createHmacSpy = Sinon.spy(crypto, 'createHmac')

    const updateSpy = Sinon.spy(crypto.Hmac.prototype, 'update')

    const digestSpy = Sinon.spy(crypto.Hmac.prototype, 'digest')

    const timestamp = new Date('2022-01-25T20:35:45.623Z').toISOString()

    const dateMock = ImportMock.mockFunction(
      Date.prototype,
      'toISOString',
      timestamp,
    )

    const keySecret = {
      key: 'dummy-key',
      secret: 'dummy-secret',
      passphrase: 'passphrase',
    } as IAlunaKeySecretSchema
    const verb = 'verb' as AlunaHttpVerbEnum
    const path = new URL(dummyUrl).pathname

    const signedHash = OkxHttpMod.generateAuthSignature({
      keySecret,
      verb,
      path,
    })

    const meta = [
      timestamp,
      verb.toUpperCase(),
      path,
    ].join('')

    expect(dateMock.callCount).to.be.eq(1)

    expect(createHmacSpy.callCount).to.be.eq(1)
    expect(createHmacSpy.calledWith('sha256', keySecret.secret)).to.be.ok

    expect(updateSpy.callCount).to.be.eq(1)
    expect(updateSpy.calledWith(meta)).to.be.ok

    expect(digestSpy.callCount).to.be.eq(1)
    expect(digestSpy.calledWith('base64')).to.be.ok

    expect(signedHash['OK-ACCESS-SIGN']).to.deep.eq(digestSpy.returnValues[0])

  })

  it('should generate signed auth header just fine with query', async () => {

    const createHmacSpy = Sinon.spy(crypto, 'createHmac')

    const updateSpy = Sinon.spy(crypto.Hmac.prototype, 'update')

    const digestSpy = Sinon.spy(crypto.Hmac.prototype, 'digest')

    const timestamp = new Date('2022-01-25T20:35:45.623Z').toISOString()

    const dateMock = ImportMock.mockFunction(
      Date.prototype,
      'toISOString',
      timestamp,
    )

    const keySecret = {
      key: 'dummy-key',
      secret: 'dummy-secret',
      passphrase: 'passphrase',
    } as IAlunaKeySecretSchema
    const verb = 'verb' as AlunaHttpVerbEnum
    const path = new URL(dummyUrl).pathname
    const query = 'dummy=dummy'

    const signedHash = OkxHttpMod.generateAuthSignature({
      keySecret,
      verb,
      path,
      query,
    })

    const meta = [
      timestamp,
      verb.toUpperCase(),
      `${path}?${query}`,
    ].join('')

    expect(dateMock.callCount).to.be.eq(1)

    expect(createHmacSpy.callCount).to.be.eq(1)
    expect(createHmacSpy.calledWith('sha256', keySecret.secret)).to.be.ok

    expect(updateSpy.callCount).to.be.eq(1)
    expect(updateSpy.calledWith(meta)).to.be.ok

    expect(digestSpy.callCount).to.be.eq(1)
    expect(digestSpy.calledWith('base64')).to.be.ok

    expect(signedHash['OK-ACCESS-SIGN']).to.deep.eq(digestSpy.returnValues[0])

  })

  it('should ensure a passphrase is passed in keySecret', async () => {

    const keySecret = {
      key: 'dummy-key',
      secret: 'dummy-secret',
    } as IAlunaKeySecretSchema
    const verb = 'verb' as AlunaHttpVerbEnum
    const path = new URL(dummyUrl).pathname

    const errMsg = '\'passphrase\' is required for private requests'

    const alunaError = new AlunaError({
      code: AlunaKeyErrorCodes.INVALID,
      message: errMsg,
      httpStatusCode: 401,
    })


    const res = await executeAndCatch(() => OkxHttpMod.generateAuthSignature({
      path,
      verb,
      keySecret,
    }))

    expect(res.result).not.to.be.ok

    expect(res.error!.message).to.be.eq(errMsg)
    expect(res.error!.code).to.be.eq(alunaError.code)
    expect(res.error!.httpStatusCode).to.be.eq(alunaError.httpStatusCode)
    expect(res.error!.metadata).to.be.eq(alunaError.metadata)

  })

  it('should validate cache usage', async () => {

    mockAxiosRequest({ responseData: dummyResponse })

    await validateCache({
      cacheResult: dummyResponse,
      callMethod: async () => {

        const params: IAlunaHttpPublicParams = {
          url: dummyUrl,
          body: dummyBody,
          verb: AlunaHttpVerbEnum.GET,
        }

        await OkxHttp.publicRequest(params)

      },

    })

  })

})
