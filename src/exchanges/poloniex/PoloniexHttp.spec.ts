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
import * as PoloniexHttpMod from './PoloniexHttp'



describe('PoloniexHttp', () => {

  const { PoloniexHttp } = PoloniexHttpMod

  const dummyUrl = 'http://dummy.com/path/XXXDUMMY/dummy'

  const dummyBody = new URLSearchParams('dummy=dummy-body')

  const dummySignedHeaders = {
    'Content-Type': 'application/x-www-form-urlencoded',
  }

  const dummyData = { data: 'dummy-data' }

  it('should defaults the http verb to get on public requests', async () => {

    const {
      requestSpy,
      axiosCreateMock,
    } = mockAxiosRequest(dummyData)

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
    } = mockAxiosRequest(dummyData)

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

    expect(responseData).to.deep.eq(dummyData.data)

  })



  it('should defaults the http verb to post on private requests',
    async () => {

      const {
        requestSpy,
        axiosCreateMock,
      } = mockAxiosRequest(dummyData)

      const generateAuthHeaderMock = ImportMock.mockFunction(
        PoloniexHttpMod,
        'generateAuthSignature',
        dummySignedHeaders,
      )

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
    } = mockAxiosRequest(dummyData)

    const generateAuthHeaderMock = ImportMock.mockFunction(
      PoloniexHttpMod,
      'generateAuthSignature',
      dummySignedHeaders,
    )

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

    expect(responseData).to.deep.eq(dummyData.data)

  })

  it('should ensure formatRequestError is call on request error', async () => {

    const errorMsg = 'Dummy error'

    const formatRequestErrorSpy = Sinon.spy(
      PoloniexHttpMod,
      'handleRequestError',
    )

    mockAxiosRequest(Promise.reject(new Error(errorMsg)))

    ImportMock.mockFunction(
      PoloniexHttpMod,
      'generateAuthSignature',
      dummySignedHeaders,
    )

    let result
    let error

    try {

      result = await PoloniexHttp.publicRequest({
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

      result = await PoloniexHttp.privateRequest({
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
          message: dummyError,
        },
      },
    }

    const error1 = PoloniexHttpMod.handleRequestError(axiosError1 as AxiosError)

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

    const error2 = PoloniexHttpMod.handleRequestError(axiosError2 as AxiosError)

    expect(error2 instanceof AlunaError).to.be.ok
    expect(
      error2.message,
    ).to.be.eq('Error while trying to execute Axios request')
    expect(error2.httpStatusCode).to.be.eq(400)


    const axiosError3 = {
      isAxiosError: true,
    }

    const error3 = PoloniexHttpMod.handleRequestError(axiosError3 as AxiosError)

    expect(error3 instanceof AlunaError).to.be.ok
    expect(
      error3.message,
    ).to.be.eq('Error while trying to execute Axios request')
    expect(error3.httpStatusCode).to.be.eq(400)


    const error = {
      message: dummyError,
    }

    const error4 = PoloniexHttpMod.handleRequestError(error as Error)

    expect(error4 instanceof AlunaError).to.be.ok
    expect(error4.message).to.be.eq(dummyError)
    expect(error4.httpStatusCode).to.be.eq(400)


    const unknown = {}

    const error5 = PoloniexHttpMod.handleRequestError(unknown as any)

    expect(error5 instanceof AlunaError).to.be.ok
    expect(
      error5.message,
    ).to.be.eq('Error while trying to execute Axios request')
    expect(error5.httpStatusCode).to.be.eq(400)

  })

  it(
    'should ensure request error is being handle'
    + ' when the error is returned in a response',
    async () => {

      const errorMsg = 'Dummy error'

      const formatRequestErrorSpy = Sinon.spy(
        PoloniexHttpMod,
        'handleRequestError',
      )

      mockAxiosRequest({
        data: {
          error: errorMsg,
        },
      })

      ImportMock.mockFunction(
        PoloniexHttpMod,
        'generateAuthSignature',
        dummySignedHeaders,
      )

      let result
      let error

      try {

        result = await PoloniexHttp.privateRequest({
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

    },
  )


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

    mockAxiosRequest(dummyData)

    await validateCache({
      cacheResult: dummyData,
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
