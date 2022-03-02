import axios, { AxiosError } from 'axios'
import { expect } from 'chai'
import crypto from 'crypto'
import Sinon from 'sinon'
import { ImportMock } from 'ts-mock-imports'

import { AlunaError } from '../../lib/core/AlunaError'
import { AlunaHttpVerbEnum } from '../../lib/enums/AlunaHtttpVerbEnum'
import { IAlunaKeySecretSchema } from '../../lib/schemas/IAlunaKeySecretSchema'
import * as FtxHttp from './FtxHttp'



describe('FtxHttp', () => {

  const { FtxHttp: ftxHttp } = FtxHttp

  const dummyUrl = 'http://dummy.com/path/XXXDUMMY/dummy'

  const dummyBody = { dummy: 'dummy-body' }

  const dummySignedHeaders = { 'X-MBX-APIKEY': undefined }

  const dummySignedBody = {
    signature: 'dummy',
    dataQueryString: 'dummy=dummy',
    body: '&dummy=dummy',
  }

  const formattedQuery = new URLSearchParams(
    `${dummySignedBody.dataQueryString}${dummySignedBody.body}`,
  )

  formattedQuery.append('signature', dummySignedBody.signature)

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

    await ftxHttp.publicRequest({
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

    const responseData = await ftxHttp.publicRequest({
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


  it('should defaults the http verb to post on private requests',
    async () => {

      const requestSpy = Sinon.spy(async () => ({ data: 'dummy-data' }))

      const generateAuthHeaderMock = ImportMock.mockFunction(
        FtxHttp,
        'generateAuthSignature',
        dummySignedBody,
      )

      const axiosCreate = ImportMock.mockFunction(
        axios,
        'create',
        {
          request: requestSpy,
        },
      )

      await ftxHttp.privateRequest({
      // http verb not informed
        keySecret: {} as IAlunaKeySecretSchema,
        url: 'http://dummy.com',
      })

      expect(axiosCreate.callCount).to.be.eq(1)

      expect(generateAuthHeaderMock.callCount).to.be.eq(1)

      expect(requestSpy.callCount).to.be.eq(1)

    })



  it('should execute private request just fine', async () => {

    const requestSpy = Sinon.spy(() => dummyData)

    const generateAuthHeaderMock = ImportMock.mockFunction(
      FtxHttp,
      'generateAuthSignature',
      dummySignedBody,
    )

    const axiosMock = ImportMock.mockFunction(
      axios,
      'create',
      {
        request: requestSpy,
      },
    )

    const responseData = await ftxHttp.privateRequest({
      verb: AlunaHttpVerbEnum.POST,
      url: dummyUrl,
      body: dummyBody,
      keySecret: {} as IAlunaKeySecretSchema,
    })


    expect(axiosMock.callCount).to.be.eq(1)

    expect(generateAuthHeaderMock.callCount).to.be.eq(1)
    expect(generateAuthHeaderMock.calledWith({
      verb: AlunaHttpVerbEnum.POST,
      body: dummyBody,
      path: new URL(dummyUrl).pathname,
      keySecret: {},
    })).to.be.ok

    expect(requestSpy.callCount).to.be.eq(1)

    expect(responseData).to.deep.eq(requestSpy.returnValues[0].data)

  })



  it('should ensure formatRequestError is call on request error', async () => {

    const errorMsg = 'Dummy error'

    const formatRequestErrorSpy = Sinon.spy(
      FtxHttp,
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
      FtxHttp,
      'generateAuthSignature',
      dummySignedHeaders,
    )

    let result
    let error

    try {

      result = await ftxHttp.publicRequest({
        url: dummyUrl,
      })

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok

    expect(error.message).to.be.eq(errorMsg)

    const calledArg1 = formatRequestErrorSpy.args[0][0]

    expect(formatRequestErrorSpy.callCount).to.be.eq(1)
    expect(calledArg1).to.be.ok
    expect(calledArg1.message).to.be.eq(errorMsg)



    try {

      result = await ftxHttp.privateRequest({
        url: dummyUrl,
        body: dummyBody,
        keySecret: {} as IAlunaKeySecretSchema,
      })

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok

    expect(error.message).to.be.eq(errorMsg)

    const calledArg2 = formatRequestErrorSpy.args[1][0]

    expect(formatRequestErrorSpy.callCount).to.be.eq(2)
    expect(calledArg2).to.be.ok
    expect(calledArg2.message).to.be.eq(errorMsg)

  })



  it('should ensure request error is being handle', async () => {

    const dummyError = 'dummy-error'

    const axiosError1 = {
      isAxiosError: true,
      response: {
        status: 400,
        data: {
          error: dummyError,
        },
      },
    }

    const error1 = FtxHttp.handleRequestError(axiosError1 as AxiosError)

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

    const error2 = FtxHttp.handleRequestError(axiosError2 as AxiosError)

    expect(error2 instanceof AlunaError).to.be.ok
    expect(
      error2.message,
    ).to.be.eq('Error while trying to execute Axios request')
    expect(error2.httpStatusCode).to.be.eq(400)


    const axiosError3 = {
      isAxiosError: true,
    }

    const error3 = FtxHttp.handleRequestError(axiosError3 as AxiosError)

    expect(error3 instanceof AlunaError).to.be.ok
    expect(
      error3.message,
    ).to.be.eq('Error while trying to execute Axios request')
    expect(error3.httpStatusCode).to.be.eq(400)


    const error = {
      message: dummyError,
    }

    const error4 = FtxHttp.handleRequestError(error as Error)

    expect(error4 instanceof AlunaError).to.be.ok
    expect(error4.message).to.be.eq(dummyError)
    expect(error4.httpStatusCode).to.be.eq(400)


    const unknown = {}

    const error5 = FtxHttp.handleRequestError(unknown as any)

    expect(error5 instanceof AlunaError).to.be.ok
    expect(
      error5.message,
    ).to.be.eq('Error while trying to execute Axios request')
    expect(error5.httpStatusCode).to.be.eq(400)

  })


  it('should generate signed auth header just fine with body', async () => {

    const createHmacSpy = Sinon.spy(crypto, 'createHmac')

    const updateSpy = Sinon.spy(crypto.Hmac.prototype, 'update')

    const digestSpy = Sinon.spy(crypto.Hmac.prototype, 'digest')

    const currentDate = 'current-date'

    const timestampMock = { toString: () => currentDate }

    const dateMock = ImportMock.mockFunction(
      Date.prototype,
      'getTime',
      timestampMock,
    )

    const keySecret = {
      key: 'dummy-key',
      secret: 'dummy-secret',
    } as IAlunaKeySecretSchema
    const verb = 'verb' as AlunaHttpVerbEnum
    const body = dummyBody

    const signedHash = FtxHttp.generateAuthSignature({
      keySecret,
      verb,
      body,
      path: new URL(dummyUrl).pathname,
    })

    expect(dateMock.callCount).to.be.eq(1)

    expect(createHmacSpy.callCount).to.be.eq(1)
    expect(createHmacSpy.calledWith('sha256', keySecret.secret)).to.be.ok

    expect(updateSpy.callCount).to.be.eq(4)
    expect(updateSpy.calledWith(currentDate.toString())).to.be.ok
    expect(updateSpy.calledWith(verb.toUpperCase())).to.be.ok
    expect(updateSpy.calledWith(verb.toUpperCase())).to.be.ok
    expect(updateSpy.calledWith(JSON.stringify(body))).to.be.ok
    expect(updateSpy.calledWith('')).not.to.be.ok

    expect(digestSpy.callCount).to.be.eq(1)
    expect(digestSpy.calledWith('hex')).to.be.ok

    expect(signedHash['FTX-SIGN']).to.deep.eq(digestSpy.returnValues[0])

    const signedHash2 = FtxHttp.generateAuthSignature({
      keySecret,
      verb,
      path: new URL(dummyUrl).pathname,
      // without a body
    })

    expect(dateMock.callCount).to.be.eq(2)

    expect(createHmacSpy.callCount).to.be.eq(2)

    expect(updateSpy.calledWith('')).to.be.ok

    expect(updateSpy.callCount).to.be.eq(8)

    expect(digestSpy.callCount).to.be.eq(2)

    expect(signedHash2['FTX-SIGN']).to.deep.eq(digestSpy.returnValues[1])

    Sinon.restore()

  })



})
