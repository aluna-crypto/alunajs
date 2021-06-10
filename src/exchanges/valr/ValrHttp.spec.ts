import axios from 'axios'
import { expect } from 'chai'
import Sinon from 'sinon'
import { ImportMock } from 'ts-mock-imports'

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
      'formatRequestError',
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
      expect(calledArg.error).to.be.ok
      expect(calledArg.error.message).to.be.eq(errorMsg)

    }


    try {

      await valrHttp.privateRequest({
        url: dummyUrl,
        body: dummyBody,
        keySecret: {} as IAlunaKeySecretSchema,
      })

    } catch (err) {

      expect(err.message).to.be.eq(errorMsg)

      const calledArg = formatRequestErrorSpy.args[0][0]

      expect(formatRequestErrorSpy.callCount).to.be.eq(2)
      expect(calledArg.error).to.be.ok
      expect(calledArg.error.message).to.be.eq(errorMsg)

    }

  })

})
