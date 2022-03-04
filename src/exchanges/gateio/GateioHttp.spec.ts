import { AxiosError } from 'axios'
import { expect } from 'chai'
import crypto from 'crypto'
import Sinon from 'sinon'
import { ImportMock } from 'ts-mock-imports'

import { mockAxiosRequest } from '../../../test/helpers/http'
import { AlunaError } from '../../lib/core/AlunaError'
import { IAlunaHttpPublicParams } from '../../lib/core/IAlunaHttp'
import { AlunaHttpVerbEnum } from '../../lib/enums/AlunaHtttpVerbEnum'
import { IAlunaKeySecretSchema } from '../../lib/schemas/IAlunaKeySecretSchema'
import { validateCache } from '../../utils/cache/AlunaCache.mock'
import * as GateioHttpMod from './GateioHttp'



describe('GateioHttp', () => {

  const { GateioHttp } = GateioHttpMod

  afterEach(Sinon.restore)

  const dummyUrl = 'http://dummy.com/path/XXXDUMMY/dummy'

  const dummyBody = { dummy: 'dummy-body' }

  const dummySignedHeaders = { 'X-DUMMY': 'dummy' }

  const dummyData = { data: 'dummy-data' }

  const dummyQuery = 'dummy=dummy'

  it('should defaults the http verb to get on public requests', async () => {

    const {
      requestSpy,
      axiosCreateMock,
    } = mockAxiosRequest(dummyData)

    await GateioHttp.publicRequest({
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
    } = mockAxiosRequest(dummyData)

    const responseData = await GateioHttp.publicRequest({
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

    expect(responseData).to.deep.eq(dummyData.data)

  })

  it('should defaults the http verb to post on private requests', async () => {

    const generateAuthHeaderMock = ImportMock.mockFunction(
      GateioHttpMod,
      'generateAuthHeader',
      dummySignedHeaders,
    )

    const {
      requestSpy,
      axiosCreateMock,
    } = mockAxiosRequest(dummyData)

    await GateioHttp.privateRequest({
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
    } = mockAxiosRequest(dummyData)

    const generateAuthHeaderMock = ImportMock.mockFunction(
      GateioHttpMod,
      'generateAuthHeader',
      dummySignedHeaders,
    )

    const responseData = await GateioHttp.privateRequest({
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
      query: '',
    })).to.be.ok

    expect(requestSpy.callCount).to.be.eq(1)
    expect(requestSpy.args[0]).to.deep.eq([{
      url: dummyUrl,
      method: AlunaHttpVerbEnum.POST,
      data: dummyBody,
      headers: dummySignedHeaders,
    }])

    expect(responseData).to.deep.eq(dummyData.data)

  })

  it('should execute private request just fine with query', async () => {

    const {
      requestSpy,
      axiosCreateMock,
    } = mockAxiosRequest(dummyData)

    const generateAuthHeaderMock = ImportMock.mockFunction(
      GateioHttpMod,
      'generateAuthHeader',
      dummySignedHeaders,
    )

    const urlWithQuery = `${dummyUrl}?${dummyQuery}`

    const responseData = await GateioHttp.privateRequest({
      verb: AlunaHttpVerbEnum.POST,
      url: urlWithQuery,
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
      url: urlWithQuery,
      query: dummyQuery,
    })).to.be.ok

    expect(requestSpy.callCount).to.be.eq(1)
    expect(requestSpy.args[0]).to.deep.eq([{
      url: urlWithQuery,
      method: AlunaHttpVerbEnum.POST,
      data: dummyBody,
      headers: dummySignedHeaders,
    }])

    expect(responseData).to.deep.eq(dummyData.data)

  })

  it('should ensure formatRequestError is call on resquest error', async () => {

    const message = 'Dummy error'

    mockAxiosRequest(Promise.reject(new Error(message)))

    const formatRequestErrorSpy = Sinon.spy(
      GateioHttpMod,
      'handleRequestError',
    )

    ImportMock.mockFunction(
      GateioHttpMod,
      'generateAuthHeader',
      dummySignedHeaders,
    )

    let result
    let error

    try {

      result = await GateioHttp.publicRequest({
        url: dummyUrl,
      })

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok
    expect(error.message).to.be.eq(message)

    const calledArg = formatRequestErrorSpy.args[0][0]

    expect(formatRequestErrorSpy.callCount).to.be.eq(1)
    expect(calledArg).to.be.ok
    expect(calledArg.message).to.be.eq(message)

    try {

      result = await GateioHttp.privateRequest({
        url: dummyUrl,
        body: dummyBody,
        keySecret: {} as IAlunaKeySecretSchema,
      })

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok

    expect(error.message).to.be.eq(message)

    const calledArg2 = formatRequestErrorSpy.args[1][0]

    expect(formatRequestErrorSpy.callCount).to.be.eq(2)
    expect(calledArg2).to.be.ok
    expect(calledArg2.message).to.be.eq(message)

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

    const error1 = GateioHttpMod.handleRequestError(axiosError1 as AxiosError)

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

    const error2 = GateioHttpMod.handleRequestError(axiosError2 as AxiosError)

    expect(error2 instanceof AlunaError).to.be.ok
    expect(
      error2.message,
    ).to.be.eq('Error while trying to execute Axios request')
    expect(error2.httpStatusCode).to.be.eq(400)

    const axiosError3 = {
      isAxiosError: true,
    }

    const error3 = GateioHttpMod.handleRequestError(axiosError3 as AxiosError)

    expect(error3 instanceof AlunaError).to.be.ok
    expect(
      error3.message,
    ).to.be.eq('Error while trying to execute Axios request')
    expect(error3.httpStatusCode).to.be.eq(400)

    const error = {
      message: dummyError,
    }

    const error4 = GateioHttpMod.handleRequestError(error as Error)

    expect(error4 instanceof AlunaError).to.be.ok
    expect(error4.message).to.be.eq(dummyError)
    expect(error4.httpStatusCode).to.be.eq(400)

    const unknown = {}

    const error5 = GateioHttpMod.handleRequestError(unknown as any)

    expect(error5 instanceof AlunaError).to.be.ok
    expect(
      error5.message,
    ).to.be.eq('Error while trying to execute Axios request')
    expect(error5.httpStatusCode).to.be.eq(400)

  })

  it('should generate signed auth header just fine', async () => {

    const createHmacSpy = Sinon.spy(crypto, 'createHmac')
    const createHashSpy = Sinon.spy(crypto, 'createHash')

    const updateSpy = Sinon.spy(crypto.Hmac.prototype, 'update')
    const updateHashSpy = Sinon.spy(crypto.Hash.prototype, 'update')

    const digestHmacSpy = Sinon.spy(crypto.Hmac.prototype, 'digest')
    const digestHashSpy = Sinon.spy(crypto.Hash.prototype, 'digest')

    const timestampMock = new Date().getTime()

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
    const query = 'query'
    const url = dummyUrl

    const contentHash = crypto
      .createHash('sha512')
      .update(body ? JSON.stringify(body) : '')
      .digest('hex')

    const preSigned = [
      verb.toUpperCase(),
      path,
      query,
      contentHash,
      (timestampMock / 1000).toString(),
    ].join('\n')

    const signedHash = GateioHttpMod.generateAuthHeader({
      keySecret,
      path,
      verb,
      body,
      url,
      query,
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
    expect(signedHash.KEY).to.deep.eq(keySecret.key)
    expect(Number(signedHash.Timestamp) * 1000).to.eq(timestampMock)
    expect(signedHash.SIGN).to.deep.eq(signedHeader)

    const signedHash2 = GateioHttpMod.generateAuthHeader({
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

    expect(
      signedHash2.KEY,
    ).to.deep.eq(keySecret.key)
    expect(Number(signedHash2.Timestamp) * 1000).to.deep.eq(timestampMock)

  })

  it('should validate cache usage', async () => {

    mockAxiosRequest(dummyData)

    await validateCache({
      cacheResult: dummyData,
      callMethod: async () => {

        const params: IAlunaHttpPublicParams = {
          url: dummyUrl,
          body: dummyBody,
          verb: AlunaHttpVerbEnum.GET,
        }

        await GateioHttp.publicRequest(params)

      },

    })

  })

})
