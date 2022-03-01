import axios, { AxiosError } from 'axios'
import { expect } from 'chai'
import crypto from 'crypto'
import Sinon from 'sinon'
import { ImportMock } from 'ts-mock-imports'

import { AlunaError } from '../../lib/core/AlunaError'
import { AlunaHttpVerbEnum } from '../../lib/enums/AlunaHtttpVerbEnum'
import { IAlunaKeySecretSchema } from '../../lib/schemas/IAlunaKeySecretSchema'
import * as BitmexHttpMod from './BitmexHttp'



describe('BitmexHttp', () => {

  afterEach(Sinon.restore)

  const {
    generateAuthHeader,
    bitmexRequestErrorHandler,
  } = BitmexHttpMod

  const {
    publicRequest,
    privateRequest,
  } = BitmexHttpMod.BitmexHttp

  const dummyUrl = 'http://dummy.com/path/XXXDUMMY/dummy'

  const dummyBody = { ids: ['id'] }

  const dummySignedHeaders = {
    'api-expires': 'expires',
    'api-key': 'key',
    'api-signature': 'signature',
  }

  const dummyData = { data: 'dummy-data' }


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

  it('should defaults the http verb to POST on private requests',
    async () => {

      const requestSpy = Sinon.spy(async () => ({ data: 'dummy-data' }))

      const generateAuthHeaderMock = ImportMock.mockFunction(
        BitmexHttpMod,
        'generateAuthHeader',
        dummySignedHeaders,
      )

      const axiosCreate = ImportMock.mockFunction(
        axios,
        'create',
        {
          request: requestSpy,
        },
      )

      await privateRequest({
      // http verb not informed
        keySecret: {} as IAlunaKeySecretSchema,
        url: 'http://dummy.com',
      })

      expect(axiosCreate.callCount).to.be.eq(1)

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

    const requestSpy = Sinon.spy(() => dummyData)

    const generateAuthHeaderMock = ImportMock.mockFunction(
      BitmexHttpMod,
      'generateAuthHeader',
      dummySignedHeaders,
    )

    const axiosMock = ImportMock.mockFunction(
      axios,
      'create',
      {
        request: requestSpy,
      },
    )

    const responseData = await privateRequest({
      verb: AlunaHttpVerbEnum.POST,
      url: dummyUrl,
      body: dummyBody,
      keySecret: {} as IAlunaKeySecretSchema,
    })

    expect(axiosMock.callCount).to.be.eq(1)

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

    expect(responseData).to.deep.eq(requestSpy.returnValues[0].data)

  })

  it(
    "should ensure 'bitmexRequestErrorHandler' is call on resquest error",
    async () => {

      let error

      const message = 'Dummy error'

      const formatRequestErrorSpy = Sinon.spy(
        BitmexHttpMod,
        'bitmexRequestErrorHandler',
      )

      const requestSpy = Sinon.spy(() => {

        throw new Error(message)

      })

      ImportMock.mockFunction(
        axios,
        'create',
        {
          request: requestSpy,
        },
      )

      ImportMock.mockFunction(
        BitmexHttpMod,
        'generateAuthHeader',
        dummySignedHeaders,
      )

      try {

        await publicRequest({
          url: dummyUrl,
        })

      } catch (err) {

        error = err

      }

      expect(error.message).to.be.eq(message)

      const calledArg1 = formatRequestErrorSpy.args[0][0]

      expect(formatRequestErrorSpy.callCount).to.be.eq(1)
      expect(calledArg1).to.be.ok
      expect(calledArg1.message).to.be.eq(message)

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

      const calledArg2 = formatRequestErrorSpy.args[1][0]

      expect(formatRequestErrorSpy.callCount).to.be.eq(2)
      expect(calledArg2).to.be.ok
      expect(calledArg2.message).to.be.eq(message)

    },
  )

  it('should ensure request error is being handle', async () => {

    const dummyError = 'dummy-error'

    const axiosError1 = {
      isAxiosError: true,
      response: {
        status: 400,
        data: {
          error: {
            message: dummyError,
          },
        },
      },
    }

    const error1 = bitmexRequestErrorHandler(axiosError1 as AxiosError)

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

    const error2 = bitmexRequestErrorHandler(axiosError2 as AxiosError)

    expect(error2 instanceof AlunaError).to.be.ok
    expect(
      error2.message,
    ).to.be.eq('Error while trying to execute Axios request')
    expect(error2.httpStatusCode).to.be.eq(400)

    const axiosError3 = {
      isAxiosError: true,
      response: {
      },
    }

    const error3 = bitmexRequestErrorHandler(axiosError3 as AxiosError)

    expect(error3 instanceof AlunaError).to.be.ok
    expect(
      error3.message,
    ).to.be.eq('Error while trying to execute Axios request')
    expect(error3.httpStatusCode).to.be.eq(400)

    const axiosError4 = {
      isAxiosError: true,
    }

    const error4 = bitmexRequestErrorHandler(axiosError4 as AxiosError)

    expect(error4 instanceof AlunaError).to.be.ok
    expect(error4.message).to.be
      .eq('Error while trying to execute Axios request')
    expect(error4.httpStatusCode).to.be.eq(400)


    const error = {
      message: dummyError,
    }

    const error5 = bitmexRequestErrorHandler(error as Error)

    expect(error5 instanceof AlunaError).to.be.ok
    expect(error5.message).to.be.eq(dummyError)
    expect(error5.httpStatusCode).to.be.eq(400)

    const unknown = {}

    const error6 = bitmexRequestErrorHandler(unknown as any)

    expect(error6 instanceof AlunaError).to.be.ok
    expect(
      error6.message,
    ).to.be.eq('Error while trying to execute Axios request')
    expect(error6.httpStatusCode).to.be.eq(400)

  })

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

})
