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
import * as handlePoloniexRequestErrorMod from './errors/handlePoloniexRequestError'
import { Poloniex } from './Poloniex'
import * as PoloniexHttpMod from './PoloniexHttp'



describe('PoloniexHttp', () => {

  const { PoloniexHttp } = PoloniexHttpMod

  const dummyUrl = 'http://dummy.com/path/XXXDUMMY/dummy'
  const dummyBody = new URLSearchParams('dummy=dummy-body')
  const dummyResponse = 'dummy-data'
  const dummySignedHeaders = {
    'Content-Type': 'application/x-www-form-urlencoded',
  }

  const mockDeps = (
    params: {
      requestResponse?: any,
      requestError?: AlunaError | Error,
      getCache?: any,
      hasCache?: boolean,
      setCache?: boolean,
      signedheaderResponse?: PoloniexHttpMod.IPoloniexSignedHeaders,
      mockedExchangeSettings?: IAlunaSettingsSchema,
    } = {},
  ) => {

    const {
      requestResponse,
      signedheaderResponse = dummySignedHeaders,
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
      responseData: requestResponse,
      error: requestResponse ? undefined : requestError,
    })

    const exchangeMock = ImportMock.mockOther(
      Poloniex,
      'settings',
      mockedExchangeSettings,
    )

    const generateAuthHeaderMock = ImportMock.mockFunction(
      PoloniexHttpMod,
      'generateAuthSignature',
      signedheaderResponse,
    )

    const handlePoloniexRequestErrorMock = ImportMock.mockFunction(
      handlePoloniexRequestErrorMod,
      'handlePoloniexRequestError',
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
      generateAuthHeaderMock,
      assembleAxiosRequestMock,
      handlePoloniexRequestErrorMock,
    }

  }


  it('should defaults the http verb to get on public requests', async () => {

    const {
      requestSpy,
      axiosCreateMock,
    } = mockDeps({
      requestResponse: dummyResponse,
    })

    await PoloniexHttp.publicRequest({
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

    const responseData = await PoloniexHttp.publicRequest({
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

  it('should defaults the http verb to post on private requests',
    async () => {

      const {
        requestSpy,
        axiosCreateMock,
        generateAuthHeaderMock,
      } = mockDeps({
        requestResponse: dummyResponse,
      })

      await PoloniexHttp.privateRequest({
      // http verb not informed
        keySecret: {} as IAlunaKeySecretSchema,
        url: 'http://dummy.com',
        body: dummyBody,
      })

      expect(axiosCreateMock.callCount).to.be.eq(1)

      expect(generateAuthHeaderMock.callCount).to.be.eq(1)

      expect(requestSpy.callCount).to.be.eq(1)


      expect(requestSpy.args[0]).to.deep.eq([{
        url: 'http://dummy.com',
        method: AlunaHttpVerbEnum.POST,
        headers: dummySignedHeaders,
        data: dummyBody,
      }])

    })



  it('should execute private request just fine', async () => {

    const {
      requestSpy,
      axiosCreateMock,
      generateAuthHeaderMock,
    } = mockDeps({
      requestResponse: dummyResponse,
    })

    const responseData = await PoloniexHttp.privateRequest({
      verb: AlunaHttpVerbEnum.POST,
      url: dummyUrl,
      body: dummyBody,
      keySecret: {} as IAlunaKeySecretSchema,
    })

    expect(axiosCreateMock.callCount).to.be.eq(1)

    expect(generateAuthHeaderMock.callCount).to.be.eq(1)
    expect(generateAuthHeaderMock.calledWith({
      body: dummyBody,
      keySecret: {},
    })).to.be.ok

    expect(requestSpy.callCount).to.be.eq(1)
    expect(requestSpy.args[0]).to.deep.eq([{
      url: `${dummyUrl}`,
      method: AlunaHttpVerbEnum.POST,
      data: dummyBody,
      headers: dummySignedHeaders,
    }])

    expect(responseData).to.deep.eq({
      data: dummyResponse,
      requestCount: 1,
    })

  })

  it(
    "should ensure 'handlePoloniexRequestError' is call on request error",
    async () => {

      const errMsg = 'Dummy error'

      const alunaError = new AlunaError({
        message: errMsg,
        code: AlunaHttpErrorCodes.REQUEST_ERROR,
        httpStatusCode: 500,
        metadata: { error: errMsg },
      })

      const {
        handlePoloniexRequestErrorMock,
      } = mockDeps({
        requestError: alunaError,
      })

      let res = await executeAndCatch(() => PoloniexHttp.publicRequest({
        url: dummyUrl,
      }))

      expect(res.result).not.to.be.ok

      expect(res.error!.message).to.be.eq(errMsg)
      expect(res.error!.code).to.be.eq(alunaError.code)
      expect(res.error!.httpStatusCode).to.be.eq(alunaError.httpStatusCode)
      expect(res.error!.metadata).to.be.eq(alunaError.metadata)

      expect(handlePoloniexRequestErrorMock.callCount).to.be.eq(1)
      expect(handlePoloniexRequestErrorMock.args[0][0]).to.deep.eq({
        error: alunaError,
      })


      res = await executeAndCatch(() => PoloniexHttp.privateRequest({
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

      expect(handlePoloniexRequestErrorMock.callCount).to.be.eq(2)
      expect(handlePoloniexRequestErrorMock.args[1][0]).to.deep.eq({
        error: alunaError,
      })

    },
  )

  it('should ensure error inside response is being handle', async () => {

    const errorMsg = 'Dummy error'

    const alunaError = new AlunaError({
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      message: errorMsg,
      httpStatusCode: 401,
      metadata: { message: errorMsg },
    })

    const requestResponse = {
      success: 0,
      result: {
        error: errorMsg,
      },
    }

    const {
      handlePoloniexRequestErrorMock,
    } = mockDeps({
      requestError: alunaError,
      requestResponse,
    })

    const res = await executeAndCatch(() => PoloniexHttp.privateRequest({
      url: dummyUrl,
      body: dummyBody,
      keySecret: {} as IAlunaKeySecretSchema,
    }))

    expect(res.result).not.to.be.ok

    expect(res.error!.code).to.be.eq(alunaError.code)
    expect(res.error!.message).to.be.eq(alunaError.message)
    expect(res.error!.httpStatusCode).to.be.eq(alunaError.httpStatusCode)
    expect(res.error!.metadata).to.be.eq(alunaError.metadata)

    const calledArg = handlePoloniexRequestErrorMock.args[0][0]

    expect(handlePoloniexRequestErrorMock.callCount).to.be.eq(1)
    expect(calledArg).to.be.ok
    expect(calledArg).to.deep.eq({
      error: {
        isAxiosError: true,
        response: {
          data: requestResponse,
        },
      },
    })

  })

  it('should generate signed auth header just fine with body', async () => {

    const createHmacSpy = Sinon.spy(crypto, 'createHmac')

    const updateSpy = Sinon.spy(crypto.Hmac.prototype, 'update')

    const digestSpy = Sinon.spy(crypto.Hmac.prototype, 'digest')

    const keySecret = {
      key: 'dummy-key',
      secret: 'dummy-secret',
    } as IAlunaKeySecretSchema
    const body = dummyBody

    const signedHash = PoloniexHttpMod.generateAuthSignature({
      keySecret,
      body,
    })

    expect(createHmacSpy.callCount).to.be.eq(1)
    expect(createHmacSpy.calledWith('sha512', keySecret.secret)).to.be.ok

    expect(updateSpy.callCount).to.be.eq(1)
    expect(updateSpy.calledWith(body.toString())).to.be.ok

    expect(digestSpy.callCount).to.be.eq(1)
    expect(digestSpy.calledWith('hex')).to.be.ok

    expect(signedHash.Sign).to.deep.eq(digestSpy.returnValues[0])

    const signedHash2 = PoloniexHttpMod.generateAuthSignature({
      keySecret,
      // without a body
    })

    expect(createHmacSpy.callCount).to.be.eq(2)


    expect(updateSpy.callCount).to.be.eq(2)
    expect(updateSpy.calledWith('')).to.be.ok

    expect(digestSpy.callCount).to.be.eq(2)

    expect(signedHash2.Sign).to.deep.eq(digestSpy.returnValues[1])

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

        await PoloniexHttp.publicRequest(params)

      },

    })

  })

})
