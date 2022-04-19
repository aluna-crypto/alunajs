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
  mockAlunaCache, validateCache,
} from '../../utils/cache/AlunaCache.mock'
import { executeAndCatch } from '../../utils/executeAndCatch'
import * as handleHuobiRequestErrorMod from './errors/handleHuobiRequestError'
import { Huobi } from './Huobi'
import * as HuobiHttpMod from './HuobiHttp'



describe('HuobiHttp', () => {

  const { HuobiHttp } = HuobiHttpMod

  const dummyUrl = 'http://dummy.com/path/XXXDUMMY/dummy'
  const dummyBody = { dummy: 'dummy-body' }
  const dummyResponse = 'dummy-response'
  const dummyKeysecret: IAlunaKeySecretSchema = {
    key: 'key',
    secret: 'secret',
  }
  const dummySignedBody = {
    queryParamsWithSignature: new URLSearchParams('dummy=dummy'),
  }

  const mockDeps = (
    params: {
      requestResponse?: any,
      requestError?: AlunaError | Error,
      getCache?: any,
      hasCache?: boolean,
      setCache?: boolean,
      signedheaderResponse?: HuobiHttpMod.IHuobiSignedSignature,
      mockedExchangeSettings?: IAlunaSettingsSchema,
      isErrorResp?: boolean,
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
      isErrorResp = false,
    } = params

    const { assembleAxiosRequestMock } = mockAssembleRequestConfig()

    const axiosRequest = {
      responseData: isErrorResp ? requestResponse : {
        data: requestResponse,
      },
      error: isErrorResp ? undefined : requestError,
    }

    const {
      requestSpy,
      axiosCreateMock,
    } = mockAxiosRequest(axiosRequest)

    const exchangeMock = ImportMock.mockOther(
      Huobi,
      'settings',
      mockedExchangeSettings,
    )

    const generateAuthHeaderMock = ImportMock.mockFunction(
      HuobiHttpMod,
      'generateAuthSignature',
      signedheaderResponse,
    )

    const handleRequestErrorSpy = ImportMock.mockFunction(
      handleHuobiRequestErrorMod,
      'handleHuobiRequestError',
      requestError,
    )

    const dateMock = ImportMock.mockFunction(
      Date.prototype,
      'toISOString',
      '2022-04-14T14:23:34.842Z',
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
      dateMock,
    }

  }

  it('should defaults the http verb to get on public requests', async () => {

    const {
      requestSpy,
      axiosCreateMock,
    } = mockDeps({
      requestResponse: dummyResponse,
    })

    await HuobiHttp.publicRequest({
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

    const responseData = await HuobiHttp.publicRequest({
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

      await HuobiHttp.privateRequest({
        // http verb not informed
        keySecret: dummyKeysecret,
        url: 'http://dummy.com',
      })

      expect(axiosCreateMock.callCount).to.be.eq(1)

      expect(generateAuthHeaderMock.callCount).to.be.eq(1)

      expect(requestSpy.callCount).to.be.eq(1)

    },
  )

  it('should execute private request just fine', async () => {

    const {
      requestSpy,
      axiosCreateMock,
      generateAuthHeaderMock,
    } = mockDeps({
      requestResponse: dummyResponse,
      signedheaderResponse: dummySignedBody,
    })
    const responseData = await HuobiHttp.privateRequest({
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

  it(
    'should ensure handleHuobiRequestError is call on request error',
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

      let res = await executeAndCatch(() => HuobiHttp.publicRequest({
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


      res = await executeAndCatch(() => HuobiHttp.privateRequest({
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

  it(
    'should ensure handleHuobiRequestError is call on request error',
    async () => {

      const error = {
        'err-msg': 'dummy error msg',
        'err-code': 'dummy-error-code',
      }

      const alunaError = new Error(error['err-msg'])

      alunaError.name = error['err-code']

      const {
        handleRequestErrorSpy,
      } = mockDeps({
        requestResponse: error,
        isErrorResp: true,
        requestError: alunaError,
      })

      const res = await executeAndCatch(() => HuobiHttp.privateRequest({
        url: dummyUrl,
        body: dummyBody,
        keySecret: dummyKeysecret,
      }))

      expect(res.result).not.to.be.ok

      expect(res.error!.message).to.be.eq(alunaError.message)

      expect(handleRequestErrorSpy.callCount).to.be.eq(2)
      expect(handleRequestErrorSpy.calledWith({
        error: alunaError,
      })).to.be.ok

    },
  )

  it('should generate signed auth header just fine without query', async () => {

    const createHmacSpy = Sinon.spy(crypto, 'createHmac')

    const updateSpy = Sinon.spy(crypto.Hmac.prototype, 'update')

    const digestSpy = Sinon.spy(crypto.Hmac.prototype, 'digest')

    const keySecret = {
      key: 'dummy-key',
      secret: 'dummy-secret',
    } as IAlunaKeySecretSchema
    const verb = 'verb' as AlunaHttpVerbEnum
    const body = dummyBody

    ImportMock.mockFunction(
      Date.prototype,
      'toISOString',
      '2022-04-18T12:42:01.572Z',
    )


    const queryParams = new URLSearchParams()

    queryParams.append('AccessKeyId', keySecret.key)
    queryParams.append('SignatureMethod', 'HmacSHA256')
    queryParams.append('SignatureVersion', '2')
    queryParams.append('Timestamp', '2022-04-18T12:42:01')

    const baseURL = new URL(dummyUrl).host
    const path = new URL(dummyUrl).pathname

    const meta = [
      verb.toUpperCase(),
      baseURL,
      path,
      queryParams.toString(),
    ].join('\n')

    const signedHash = HuobiHttpMod.generateAuthSignature({
      keySecret,
      verb,
      body,
      query: undefined,
      url: dummyUrl,
    })

    expect(createHmacSpy.callCount).to.be.eq(1)
    expect(createHmacSpy.calledWith('sha256', keySecret.secret)).to.be.ok

    expect(updateSpy.callCount).to.be.eq(1)
    expect(updateSpy.calledWith(meta)).to.be.ok

    expect(digestSpy.callCount).to.be.eq(1)
    expect(digestSpy.calledWith('base64')).to.be.ok

    queryParams.append('Signature', digestSpy.returnValues[0])

    expect(signedHash.queryParamsWithSignature).to.deep.eq(queryParams)

  })

  it('should generate signed auth header just fine with query', async () => {

    const createHmacSpy = Sinon.spy(crypto, 'createHmac')

    const updateSpy = Sinon.spy(crypto.Hmac.prototype, 'update')

    const digestSpy = Sinon.spy(crypto.Hmac.prototype, 'digest')

    const query = 'dummy=dummy'

    const keySecret = {
      key: 'dummy-key',
      secret: 'dummy-secret',
    } as IAlunaKeySecretSchema
    const verb = 'verb' as AlunaHttpVerbEnum
    const body = dummyBody


    ImportMock.mockFunction(
      Date.prototype,
      'toISOString',
      '2022-04-18T12:42:01.572Z',
    )


    const queryParams = new URLSearchParams()

    queryParams.append('AccessKeyId', keySecret.key)
    queryParams.append('SignatureMethod', 'HmacSHA256')
    queryParams.append('SignatureVersion', '2')
    queryParams.append('Timestamp', '2022-04-18T12:42:01')

    const baseURL = new URL(dummyUrl).host
    const path = new URL(dummyUrl).pathname

    const meta = [
      verb.toUpperCase(),
      baseURL,
      path,
      `${queryParams.toString()}&${query}`,
    ].join('\n')



    const signedHash = HuobiHttpMod.generateAuthSignature({
      keySecret,
      verb,
      body,
      query,
      url: dummyUrl,
    })

    expect(createHmacSpy.callCount).to.be.eq(1)
    expect(createHmacSpy.calledWith('sha256', keySecret.secret)).to.be.ok

    expect(updateSpy.callCount).to.be.eq(1)
    expect(updateSpy.calledWith(meta)).to.be.ok

    expect(digestSpy.callCount).to.be.eq(1)
    expect(digestSpy.calledWith('base64')).to.be.ok

    const newQueryParams = new URLSearchParams(
      `${queryParams.toString()}&${query}`,
    )

    newQueryParams.append('Signature', digestSpy.returnValues[0])

    expect(signedHash.queryParamsWithSignature).to.deep.eq(queryParams)

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

        await HuobiHttp.publicRequest(params)

      },

    })

  })

})
