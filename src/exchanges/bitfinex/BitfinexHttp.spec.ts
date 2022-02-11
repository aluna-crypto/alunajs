import axios, { AxiosError } from 'axios'
import { expect } from 'chai'
import crypto from 'crypto'
import Sinon from 'sinon'
import { ImportMock } from 'ts-mock-imports'

import {
  AlunaError,
  AlunaHttpVerbEnum,
  AlunaKeyErrorCodes,
  IAlunaKeySecretSchema,
} from '../..'
import * as BitfinexHttpMod from './BitfinexHttp'



describe('BitfinexHttp', () => {

  afterEach(Sinon.restore)

  const { BitfinexHttp, handleRequestError } = BitfinexHttpMod

  const { publicRequest, privateRequest } = BitfinexHttp

  const dummyV2Headers: BitfinexHttpMod.IBitfinexSignedV2Headers = {
    'Content-Type': 'dummy-content',
    'bfx-nonce': 'dummy-key',
    'bfx-apikey': 'dummy-payload',
    'bfx-signature': 'dummy-sig',
  }

  const dummyBody: Record<any, string> = { dummy: 'dummy-body' }

  const dummyUrl = 'http://dummy.com/path/XXXDUMMY/dummy'
  const dummyData = { data: 'dummy-data' }

  const dummyKeysecret: IAlunaKeySecretSchema = {
    key: 'key',
    secret: 'secret',
  }

  afterEach(Sinon.restore)

  it('should defaults the http verb to get on public requests', async () => {

    const requestSpy = Sinon.spy(async () => dummyData)

    const axiosCreate = ImportMock.mockFunction(
      axios,
      'create',
      {
        request: requestSpy,
      },
    )

    await publicRequest({
      // http verb not informed
      url: dummyUrl,
      body: dummyBody,
    })

    expect(axiosCreate.callCount).to.be.eq(1)

    expect(requestSpy.callCount).to.be.eq(1)

    expect(requestSpy.args[0]).to.deep.eq([{
      url: dummyUrl,
      method: AlunaHttpVerbEnum.GET,
      data: dummyBody,
    }])


  })

  it('should execute public request just fine', async () => {

    const requestSpy = Sinon.spy(() => dummyData)

    const axiosMock = ImportMock.mockFunction(
      axios,
      'create',
      {
        request: requestSpy,
      },
    )

    const responseData = await publicRequest({
      verb: AlunaHttpVerbEnum.GET,
      url: dummyUrl,
      body: dummyBody,
    })

    expect(axiosMock.callCount).to.be.eq(1)

    expect(requestSpy.callCount).to.be.eq(1)
    expect(requestSpy.args[0]).to.deep.eq([{
      url: dummyUrl,
      method: AlunaHttpVerbEnum.GET,
      data: dummyBody,
    }])

    expect(responseData).to.deep.eq(requestSpy.returnValues[0].data)

  })

  it("should call 'handleRequestError' if public request throws", async () => {

    const errMsg = 'exchange offline'
    const throwedError = new Error(errMsg)
    const code = AlunaKeyErrorCodes.INVALID
    const httpStatusCode = 401

    const requestSpy = Sinon.spy(() => Promise.reject(throwedError))

    ImportMock.mockFunction(
      axios,
      'create',
      {
        request: requestSpy,
      },
    )

    ImportMock.mockOther(
      BitfinexHttpMod,
      'handleRequestError',
      (error: Error) => new AlunaError({
        code,
        message: error.message,
        metadata: error,
        httpStatusCode,
      }),
    )

    let error

    try {

      await publicRequest({
        verb: AlunaHttpVerbEnum.GET,
        url: dummyUrl,
        body: dummyBody,
      })


    } catch (e) {

      error = e

    }

    expect(error).to.be.ok
    expect(error.message).to.be.eq(errMsg)
    expect(error.code).to.be.eq(code)
    expect(error.httpStatusCode).to.be.eq(httpStatusCode)
    expect(error.metadata).to.deep.eq(throwedError)

  })


  it('should execute private request just fine', async () => {

    const requestSpy = Sinon.spy(() => dummyData)

    const signedHeaders: BitfinexHttpMod.IGenerateAuthHeaderReturns = {
      body: dummyBody,
      headers: dummyV2Headers,
    }

    const generateAuthHeaderMock = ImportMock.mockFunction(
      BitfinexHttpMod,
      'generateAuthHeader',
      signedHeaders,
    )

    const axiosMock = ImportMock.mockFunction(
      axios,
      'create',
      {
        request: requestSpy,
      },
    )

    const responseData = await privateRequest({
      url: dummyUrl,
      body: dummyBody,
      keySecret: dummyKeysecret,
    })

    expect(axiosMock.callCount).to.be.eq(1)

    expect(generateAuthHeaderMock.callCount).to.be.eq(1)
    expect(generateAuthHeaderMock.calledWith({
      url: dummyUrl,
      body: dummyBody,
      keySecret: dummyKeysecret,
    })).to.be.ok

    expect(requestSpy.callCount).to.be.eq(1)
    expect(requestSpy.args[0]).to.deep.eq([{
      url: dummyUrl,
      method: AlunaHttpVerbEnum.POST,
      data: signedHeaders.body,
      headers: signedHeaders.headers,
    }])

    expect(responseData).to.deep.eq(requestSpy.returnValues[0].data)

  })

  it("should call 'handleRequestError' if private request throws", async () => {

    const errMsg = 'exchange offline'
    const throwedError = new Error(errMsg)
    const code = AlunaKeyErrorCodes.INVALID
    const httpStatusCode = 500

    const requestSpy = Sinon.spy(() => Promise.reject(throwedError))

    ImportMock.mockFunction(
      axios,
      'create',
      {
        request: requestSpy,
      },
    )

    const handleRequestErrorMock = ImportMock.mockFunction(
      BitfinexHttpMod,
      'handleRequestError',
      new AlunaError({
        code,
        message: errMsg,
        metadata: errMsg,
        httpStatusCode,
      }),
    )

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
    expect(error.code).to.be.eq(code)
    expect(error.httpStatusCode).to.be.eq(httpStatusCode)

    expect(handleRequestErrorMock.callCount).to.be.eq(1)
    expect(handleRequestErrorMock.calledWithExactly(
      throwedError,
    )).to.be.ok

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

})
