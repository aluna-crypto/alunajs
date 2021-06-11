import axios, { AxiosError } from 'axios'
import { expect } from 'chai'
import crypto from 'crypto'
import Sinon from 'sinon'
import { ImportMock } from 'ts-mock-imports'

import { AlunaError } from '../../lib/core/AlunaError'
import { AlunaHttpVerbEnum } from '../../lib/enums/AlunaHtttpVerbEnum'
import { IAlunaKeySecretSchema } from '../../lib/schemas/IAlunaKeySecretSchema'
import * as ValrHttp from './ValrHttp'



describe('ValrHttp', () => {

  const { ValrHttp: valrHttp } = ValrHttp

  const dummyUrl = 'http://dummy.com/path/XXXDUMMY/dummy'

  const dummyBody = { dummy: 'dummy-body' }

  const dummySignedHeaders = { 'X-DUMMY': 'dummy' }

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

    await valrHttp.publicRequest({
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

    const responseData = await valrHttp.publicRequest({
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



  it('should defaults the http verb to post on private requests', async () => {

    const requestSpy = Sinon.spy(async () => ({ data: 'dummy-data' }))

    const generateAuthHeaderMock = ImportMock.mockFunction(
      ValrHttp,
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

    await valrHttp.privateRequest({
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
      ValrHttp,
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

    const responseData = await valrHttp.privateRequest({
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
    })).to.be.true

    expect(requestSpy.callCount).to.be.eq(1)
    expect(requestSpy.args[0]).to.deep.eq([{
      url: dummyUrl,
      method: AlunaHttpVerbEnum.POST,
      data: dummyBody,
      headers: dummySignedHeaders,
    }])

    expect(responseData).to.deep.eq(requestSpy.returnValues[0].data)

  })



  it('should ensure formatRequestError is call on resquest error', async () => {

    const errorMsg = 'Dummy error'

    const formatRequestErrorSpy = Sinon.spy(
      ValrHttp,
      'handleRequestError',
    )

    const requestSpy = Sinon.spy(() => {

      throw new Error(errorMsg)

    })

    ImportMock.mockFunction(
      axios,
      'create',
      {
        request: requestSpy,
      },
    )

    ImportMock.mockFunction(
      ValrHttp,
      'generateAuthHeader',
      dummySignedHeaders,
    )

    try {

      await valrHttp.publicRequest({
        url: dummyUrl,
      })

    } catch (err) {

      expect(err.message).to.be.eq(errorMsg)

      const calledArg = formatRequestErrorSpy.args[0][0]

      expect(formatRequestErrorSpy.callCount).to.be.eq(1)
      expect(calledArg).to.be.ok
      expect(calledArg.message).to.be.eq(errorMsg)

    }


    try {

      await valrHttp.privateRequest({
        url: dummyUrl,
        body: dummyBody,
        keySecret: {} as IAlunaKeySecretSchema,
      })

    } catch (err) {

      expect(err.message).to.be.eq(errorMsg)

      const calledArg = formatRequestErrorSpy.args[1][0]

      expect(formatRequestErrorSpy.callCount).to.be.eq(2)
      expect(calledArg).to.be.ok
      expect(calledArg.message).to.be.eq(errorMsg)

    }

  })



  it('should ensure request error is being handle', async () => {

    const dummyError = 'dummy-error'

    const axiosError1 = {
      isAxiosError: true,
      response: {
        status: 400,
        data: {
          message: dummyError,
        },
      },
    }

    const error1 = ValrHttp.handleRequestError(axiosError1 as AxiosError)

    expect(error1 instanceof AlunaError).to.be.true
    expect(error1.message).to.be.eq(dummyError)
    expect(error1.statusCode).to.be.eq(400)


    const axiosError2 = {
      isAxiosError: true,
      response: {
        data: {
        },
      },
    }

    const error2 = ValrHttp.handleRequestError(axiosError2 as AxiosError)

    expect(error2 instanceof AlunaError).to.be.true
    expect(
      error2.message,
    ).to.be.eq('Error while trying to execute Axios request')
    expect(error2.statusCode).to.be.eq(400)


    const axiosError3 = {
      isAxiosError: true,
    }

    const error3 = ValrHttp.handleRequestError(axiosError3 as AxiosError)

    expect(error3 instanceof AlunaError).to.be.true
    expect(
      error3.message,
    ).to.be.eq('Error while trying to execute Axios request')
    expect(error3.statusCode).to.be.eq(400)


    const error = {
      message: dummyError,
    }

    const error4 = ValrHttp.handleRequestError(error as Error)

    expect(error4 instanceof AlunaError).to.be.true
    expect(error4.message).to.be.eq(dummyError)
    expect(error4.statusCode).to.be.eq(400)


    const unknown = {}

    const error5 = ValrHttp.handleRequestError(unknown as any)

    expect(error5 instanceof AlunaError).to.be.true
    expect(
      error5.message,
    ).to.be.eq('Error while trying to execute Axios request')
    expect(error5.statusCode).to.be.eq(400)

  })


  it('should generate signed auth header just fine', async () => {

    const createHmacSpy = Sinon.spy(crypto, 'createHmac')

    const updateSpy = Sinon.spy(crypto.Hmac.prototype, 'update')

    const digestSpy = Sinon.spy(crypto.Hmac.prototype, 'digest')

    const currentDate = 'current-date'

    const timestampMock = { toString: () => currentDate }

    const dateMock = ImportMock.mockFunction(
      Date,
      'now',
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

    const signedHash = ValrHttp.generateAuthHeader({
      keySecret,
      path,
      verb,
      body,
    })

    expect(dateMock.callCount).to.be.eq(1)

    expect(createHmacSpy.callCount).to.be.eq(1)
    expect(createHmacSpy.calledWith('sha512', keySecret.secret)).to.be.true

    expect(updateSpy.callCount).to.be.eq(4)
    expect(updateSpy.calledWith(currentDate)).to.be.true
    expect(updateSpy.calledWith(verb.toUpperCase())).to.be.true
    expect(updateSpy.calledWith(path)).to.be.true
    expect(updateSpy.calledWith(stringifyBody)).to.be.true

    expect(stringfyMock.callCount).to.be.eq(1)
    expect(stringfyMock.calledWith(body)).to.be.true

    expect(digestSpy.callCount).to.be.eq(1)
    expect(digestSpy.calledWith('hex')).to.be.true

    expect(signedHash['X-VALR-API-KEY']).to.deep.eq(keySecret.key)
    expect(signedHash['X-VALR-SIGNATURE']).to.deep.eq(digestSpy.returnValues[0])
    expect(signedHash['X-VALR-TIMESTAMP']).to.deep.eq(timestampMock)


    const signedHash2 = ValrHttp.generateAuthHeader({
      keySecret,
      path,
      verb,
      // without a body
    })

    expect(dateMock.callCount).to.be.eq(2)

    expect(createHmacSpy.callCount).to.be.eq(2)

    // when no body is passed must not call stringfy on empty string
    expect(stringfyMock.callCount).to.be.eq(1)
    expect(stringfyMock.calledWith('')).to.not.be.true

    expect(updateSpy.callCount).to.be.eq(8)

    expect(digestSpy.callCount).to.be.eq(2)

    expect(signedHash2['X-VALR-API-KEY']).to.deep.eq(keySecret.key)
    expect(
      signedHash2['X-VALR-SIGNATURE'],
    ).to.deep.eq(digestSpy.returnValues[1])
    expect(signedHash2['X-VALR-TIMESTAMP']).to.deep.eq(timestampMock)

  })



})
